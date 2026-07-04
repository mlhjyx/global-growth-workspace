/**
 * ModelGateway 实现（Spike）：路由 → 脱敏 → 预算预检 → Provider 调用（故障切换）
 * → 结构化输出校验（失败重试一次）→ 记账 → Trace。
 *
 * 每次 complete（无论成败）产出恰好一条 GatewayTrace：成功挂在结果上，
 * 失败挂在 GatewayError.trace 上，并统一推给 onTrace 落盘钩子
 * （Langfuse 为未来落盘候选，本 Spike 只验证形状）。
 */
import { randomUUID } from 'node:crypto';
import {
  AllProvidersFailedError,
  BudgetExceededError,
  InvalidInputError,
  ProviderUnavailableError,
  StructuredOutputError,
  type CompleteOptions,
  type CompleteResult,
  type GatewayTrace,
  type ModelGateway,
  type ModelProvider,
  type ProviderAttempt,
  type GatewayError,
} from './contract.js';
import { UnknownPromptError } from './contract.js';
import type { BudgetGuard } from './budget-guard.js';
import type { PromptEntry, PromptRegistry } from './prompt-registry.js';
import { actualCostUsd, estimateCostUsd, type RoutingPolicy, type ProviderTarget } from './routing-policy.js';
import type { RedactionHook } from './redaction.js';
import { defaultRedactionHook } from './redaction.js';
import type { TaskRegistry } from './task-registry.js';
import { SchemaValidator } from './structured-output.js';

export interface GatewayDeps {
  tasks: TaskRegistry;
  prompts: PromptRegistry;
  routing: RoutingPolicy;
  budget: BudgetGuard;
  providers: Map<string, ModelProvider>;
  redact?: RedactionHook;
  validator?: SchemaValidator;
  /** Trace 落盘钩子：每次调用（含失败）恰好回调一次 */
  onTrace?: (trace: GatewayTrace) => void;
  clock?: () => Date;
}

/** 结构化输出校验失败时，同一 Provider 上最多尝试次数（首次 + 重试一次） */
const MAX_VALIDATION_ATTEMPTS = 2;

export class ModelGatewayImpl implements ModelGateway {
  private readonly redact: RedactionHook;
  private readonly validator: SchemaValidator;
  private readonly clock: () => Date;

  constructor(private readonly deps: GatewayDeps) {
    this.redact = deps.redact ?? defaultRedactionHook;
    this.validator = deps.validator ?? new SchemaValidator();
    this.clock = deps.clock ?? (() => new Date());
  }

  async complete(taskRef: string, input: unknown, opts: CompleteOptions): Promise<CompleteResult> {
    const task = this.deps.tasks.get(taskRef); // UnknownTaskError（无 Trace：任务未注册即无归因目标）
    const startedAt = Date.now();

    const attempts: ProviderAttempt[] = [];
    const trace: GatewayTrace = {
      traceId: `trc_${randomUUID()}`,
      taskRef,
      taskType: task.taskType,
      workspaceId: opts.workspaceId,
      correlationId: opts.correlationId,
      modelPolicy: task.modelPolicy,
      promptId: task.defaultPromptId,
      promptVersion: opts.promptVersion ?? '(unresolved)',
      inputSchemaId: task.inputSchemaId,
      outputSchemaId: task.outputSchemaId,
      attempts,
      provider: null,
      model: null,
      totalLatencyMs: 0,
      costUsd: 0,
      redactions: [],
      validation: { attempts: 0, valid: false },
      status: 'OK',
      createdAt: this.clock().toISOString(),
    };

    const fail = <E extends GatewayError>(err: E, status: GatewayTrace['status']): never => {
      trace.status = status;
      trace.totalLatencyMs = Date.now() - startedAt;
      err.trace = trace;
      this.deps.onTrace?.(trace);
      throw err;
    };

    // 0) Prompt 解析在 Trace 化失败路径内：钉住不存在的版本/无 released 版本同样要可审计
    //    ——「每次 complete 恰好一条 Trace」的保证不豁免此路径（Codex 3521756902）
    let prompt: PromptEntry;
    try {
      prompt = this.deps.prompts.resolve(task.defaultPromptId, opts.promptVersion);
    } catch (e) {
      if (e instanceof UnknownPromptError) return fail(e, 'UNKNOWN_PROMPT');
      throw e;
    }
    trace.promptVersion = prompt.version;

    // 1) 输入校验（INVALID_SCHEMA 不重试，母本 11.15）
    const inputCheck = this.validator.validateInput(task, input);
    if (!inputCheck.valid) {
      return fail(
        new InvalidInputError(`输入不符合 ${task.inputSchemaId}`, inputCheck.errors),
        'INVALID_INPUT',
      );
    }

    // 1a) 入参租户归属校验：跨租户载荷在触达 Provider **之前**拒绝——仅靠输出校验时，
    //     他租户数据已被发出（Codex 3522746089；输出侧校验保留，防 Provider 串扰）
    if (input !== null && typeof input === 'object') {
      const inWs = (input as Record<string, unknown>)['workspace_id'];
      if (typeof inWs === 'string' && inWs !== opts.workspaceId) {
        return fail(
          new InvalidInputError(
            `输入 workspace_id（${inWs}）与请求 workspace（${opts.workspaceId}）不符`,
            [],
          ),
          'INVALID_INPUT',
        );
      }
    }

    // 2) 脱敏：发给 Provider 前对序列化入参做脱敏（母本 9.10）
    const redacted = this.redact(JSON.stringify(input));
    trace.redactions = redacted.redactions;

    // 3) 路由：成本/预算预检按目标逐一执行（见循环内）——fallback 单价可能高于 primary，
    //    只按 primary 估算一次会击穿预算熔断承诺（Codex 3521756900）
    const targets = this.deps.routing.targets(task.modelPolicy);

    // 4) 逐目标尝试：Provider 故障 → 切换下一目标；输出校验失败 → 同一目标重试一次后终止
    let lastValidationErrors: string[] = [];
    for (const target of targets) {
      const provider = this.deps.providers.get(target.provider);
      if (!provider) throw new Error(`RoutingPolicy 指向未注册 Provider：${target.provider}`);

      // 4a) 单次成本上限：估算超过任务契约 maxCostPerRunUsd 直接拒绝，
      //     禁止 clamp 掩盖后照常触达 Provider（Codex 3521756909）
      const estimate = estimateCostUsd(target, redacted.text.length);
      if (estimate > task.maxCostPerRunUsd) {
        trace.costUsd = attempts.reduce((s, a) => s + (a.costUsd ?? 0), 0);
        return fail(
          new BudgetExceededError(
            `目标 ${target.provider}/${target.model} 估算成本 $${estimate.toFixed(4)} ` +
              `超过任务单次上限 $${task.maxCostPerRunUsd.toFixed(4)}（task-contract 第 3 节）`,
          ),
          'BUDGET_EXCEEDED',
        );
      }
      // 4b) 日预算预检对将尝试的每个目标执行（含 fallback），超限即熔断、不触达 Provider
      try {
        this.deps.budget.assertWithinBudget(opts.workspaceId, estimate);
      } catch (e) {
        if (e instanceof BudgetExceededError) {
          trace.costUsd = attempts.reduce((s, a) => s + (a.costUsd ?? 0), 0);
          return fail(e, 'BUDGET_EXCEEDED');
        }
        throw e;
      }

      let repairFeedback = '';
      for (let attempt = 1; attempt <= MAX_VALIDATION_ATTEMPTS; attempt++) {
        const t0 = Date.now();
        let text: string;
        let usage: { inputTokens: number; outputTokens: number };
        try {
          const res = await provider.invoke({
            model: target.model,
            system: prompt.system,
            user: redacted.text + repairFeedback,
            attempt,
          });
          text = res.text;
          usage = res.usage;
        } catch (e) {
          const err = e instanceof ProviderUnavailableError ? e : new ProviderUnavailableError(target.provider, String(e));
          attempts.push({
            provider: target.provider,
            model: target.model,
            attempt,
            status: 'PROVIDER_ERROR',
            latencyMs: Date.now() - t0,
            errorCode: err.code,
            errorMessage: err.message,
          });
          break; // Provider 级故障 → 故障切换到下一目标
        }

        // 结构化输出：解析 + Schema 校验
        trace.validation.attempts += 1;
        const cost = actualCostUsd(target, usage);

        // 4c) 单次运行**实际累计**成本上限：预检估算挡不住 Provider 实报用量超预估、
        //     或修复重试的第二次计费——累计越过 cap 即终止；已发生费用照常记账（钱已花出）
        //     （Codex 3522746088）
        const aggregateCost = attempts.reduce((s, a) => s + (a.costUsd ?? 0), 0) + cost;
        if (aggregateCost > task.maxCostPerRunUsd) {
          attempts.push({
            provider: target.provider,
            model: target.model,
            attempt,
            status: 'COST_CAP_EXCEEDED',
            latencyMs: Date.now() - t0,
            errorCode: 'BUDGET_EXCEEDED',
            errorMessage: `实际累计成本 $${aggregateCost.toFixed(4)} 超过单次上限 $${task.maxCostPerRunUsd.toFixed(4)}`,
            usage,
            costUsd: cost,
          });
          this.deps.budget.charge(opts.workspaceId, cost);
          trace.costUsd = aggregateCost;
          return fail(
            new BudgetExceededError(
              `单次运行实际累计成本 $${aggregateCost.toFixed(4)} 超过任务上限 $${task.maxCostPerRunUsd.toFixed(4)}（task-contract 第 3 节）`,
            ),
            'BUDGET_EXCEEDED',
          );
        }
        let parsed: unknown;
        let outcome: { valid: boolean; errors: string[] };
        try {
          parsed = JSON.parse(text);
          outcome = this.validator.validateOutput(task, parsed);
        } catch {
          outcome = { valid: false, errors: ['输出不是合法 JSON'] };
        }

        // 输出租户归属校验：Schema 只校验 ID 形状，不校验归属——Provider 缺陷/串扰重试
        // 返回他租户 workspace_id 时必须拒收，禁止跨租户归因与泄漏（Codex 3521756898）
        if (outcome.valid) {
          const outWs = (parsed as Record<string, unknown>)['workspace_id'];
          if (typeof outWs === 'string' && outWs !== opts.workspaceId) {
            outcome = {
              valid: false,
              errors: [`输出 workspace_id（${outWs}）与请求 workspace（${opts.workspaceId}）不符`],
            };
          }
        }

        if (outcome.valid) {
          attempts.push({
            provider: target.provider,
            model: target.model,
            attempt,
            status: 'OK',
            latencyMs: Date.now() - t0,
            usage,
            costUsd: cost,
          });
          this.deps.budget.charge(opts.workspaceId, cost);
          trace.provider = target.provider;
          trace.model = target.model;
          trace.costUsd = attempts.reduce((s, a) => s + (a.costUsd ?? 0), 0);
          trace.validation.valid = true;
          trace.totalLatencyMs = Date.now() - startedAt;
          trace.status = 'OK';
          this.deps.onTrace?.(trace);
          return { output: parsed, trace };
        }

        // 校验失败：该次调用照样计费（真实 Provider 也会收费）
        attempts.push({
          provider: target.provider,
          model: target.model,
          attempt,
          status: 'INVALID_OUTPUT',
          latencyMs: Date.now() - t0,
          errorCode: 'STRUCTURED_OUTPUT_INVALID',
          errorMessage: outcome.errors.slice(0, 5).join('; '),
          usage,
          costUsd: cost,
        });
        this.deps.budget.charge(opts.workspaceId, cost);
        lastValidationErrors = outcome.errors;
        repairFeedback =
          `\n\n[SCHEMA_VALIDATION_FEEDBACK] 上一次输出未通过 ${task.outputSchemaId} 校验：` +
          outcome.errors.slice(0, 5).join('; ') +
          '。请只输出一个符合该 Schema 的 JSON 对象。';
      }

      const last = attempts[attempts.length - 1];
      if (last && last.status === 'INVALID_OUTPUT') {
        // 校验失败重试一次仍失败 → 终止（不做 Provider 切换：这是输出质量问题，不是可用性问题）
        trace.costUsd = attempts.reduce((s, a) => s + (a.costUsd ?? 0), 0);
        return fail(
          new StructuredOutputError(
            `输出经 ${MAX_VALIDATION_ATTEMPTS} 次尝试仍不符合 ${task.outputSchemaId}`,
            lastValidationErrors,
          ),
          'INVALID_OUTPUT',
        );
      }
      // PROVIDER_ERROR → 继续 fallback
    }

    trace.costUsd = attempts.reduce((s, a) => s + (a.costUsd ?? 0), 0);
    return fail(
      new AllProvidersFailedError(
        `模型策略 ${task.modelPolicy} 的 primary 与全部 fallback（共 ${targets.length} 个）均不可用`,
      ),
      'PROVIDER_EXHAUSTED',
    );
  }
}
