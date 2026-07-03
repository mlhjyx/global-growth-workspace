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
import type { BudgetGuard } from './budget-guard.js';
import type { PromptRegistry } from './prompt-registry.js';
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
    const prompt = this.deps.prompts.resolve(task.defaultPromptId, opts.promptVersion);
    const startedAt = Date.now();

    const attempts: ProviderAttempt[] = [];
    const trace: GatewayTrace = {
      traceId: `trc_${randomUUID()}`,
      taskRef,
      taskType: task.taskType,
      workspaceId: opts.workspaceId,
      correlationId: opts.correlationId,
      modelPolicy: task.modelPolicy,
      promptId: prompt.promptId,
      promptVersion: prompt.version,
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

    // 1) 输入校验（INVALID_SCHEMA 不重试，母本 11.15）
    const inputCheck = this.validator.validateInput(task, input);
    if (!inputCheck.valid) {
      return fail(
        new InvalidInputError(`输入不符合 ${task.inputSchemaId}`, inputCheck.errors),
        'INVALID_INPUT',
      );
    }

    // 2) 脱敏：发给 Provider 前对序列化入参做脱敏（母本 9.10）
    const redacted = this.redact(JSON.stringify(input));
    trace.redactions = redacted.redactions;

    // 3) 路由 + 预算预检（超限即熔断，不触达 Provider）
    const targets = this.deps.routing.targets(task.modelPolicy);
    const primary = targets[0]!;
    const estimate = Math.min(estimateCostUsd(primary, redacted.text.length), task.maxCostPerRunUsd);
    try {
      this.deps.budget.assertWithinBudget(opts.workspaceId, estimate);
    } catch (e) {
      if (e instanceof BudgetExceededError) return fail(e, 'BUDGET_EXCEEDED');
      throw e;
    }

    // 4) 逐目标尝试：Provider 故障 → 切换下一目标；输出校验失败 → 同一目标重试一次后终止
    let lastValidationErrors: string[] = [];
    for (const target of targets) {
      const provider = this.deps.providers.get(target.provider);
      if (!provider) throw new Error(`RoutingPolicy 指向未注册 Provider：${target.provider}`);

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
        let parsed: unknown;
        let outcome: { valid: boolean; errors: string[] };
        try {
          parsed = JSON.parse(text);
          outcome = this.validator.validateOutput(task, parsed);
        } catch {
          outcome = { valid: false, errors: ['输出不是合法 JSON'] };
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
