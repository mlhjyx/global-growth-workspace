/**
 * 测试装配：TaskRegistry + PromptRegistry + RoutingPolicy + BudgetGuard + Providers → Gateway。
 */
import type { GatewayTrace, ModelProvider } from '../src/contract.js';
import { InMemoryBudgetGuard, type BudgetGuard } from '../src/budget-guard.js';
import { ModelGatewayImpl } from '../src/gateway.js';
import { PromptRegistry, registerCompanyUnderstandingPromptV1 } from '../src/prompt-registry.js';
import { RoutingPolicy, type ProviderTarget } from '../src/routing-policy.js';
import { TaskRegistry, registerCompanyUnderstandingTask } from '../src/task-registry.js';
import { SchemaValidator } from '../src/structured-output.js';

export const TASK_REF = 'company-understanding@1';
export const POLICY_ID = 'structured_extraction.default';

// 单价采用市价量级（Claude Sonnet 档 / 廉价档），仅用于成本估算演示
export function target(provider: string, model: string, cheap = false): ProviderTarget {
  return cheap
    ? { provider, model, costPer1kInputUsd: 0.0008, costPer1kOutputUsd: 0.004 }
    : { provider, model, costPer1kInputUsd: 0.003, costPer1kOutputUsd: 0.015 };
}

export interface HarnessOptions {
  primary: ModelProvider;
  fallbacks?: ModelProvider[];
  /** workspace -> 日预算（USD） */
  budgets?: Record<string, number>;
  defaultDailyLimitUsd?: number;
  /** 覆盖预算卫兵（测试观测预检参数用）；缺省 InMemoryBudgetGuard */
  budgetGuard?: BudgetGuard;
  clock?: () => Date;
}

export function buildGateway(opts: HarnessOptions) {
  const tasks = new TaskRegistry();
  registerCompanyUnderstandingTask(tasks);

  const prompts = new PromptRegistry();
  registerCompanyUnderstandingPromptV1(prompts);
  // 模拟母本 9.6 发布动作：默认解析只落在 released 版本，draft 不服务未钉版本的调用
  //（Codex 3521756913；真实 v1 在 prompt.v1.md 中为 draft，Gate 3 前发布是测试装配假设）
  prompts.release('company-understanding/prompt', 'v1');

  const routing = new RoutingPolicy();
  const fallbacks = opts.fallbacks ?? [];
  routing.register({
    policyId: POLICY_ID,
    primary: target(opts.primary.name, 'mock-large-v1'),
    fallbacks: fallbacks.map((p) => target(p.name, 'mock-small-v1', true)),
  });

  const budget =
    opts.budgetGuard ??
    new InMemoryBudgetGuard(opts.budgets ?? {}, opts.defaultDailyLimitUsd ?? 10, opts.clock);

  const providers = new Map<string, ModelProvider>();
  providers.set(opts.primary.name, opts.primary);
  for (const p of fallbacks) providers.set(p.name, p);

  const traces: GatewayTrace[] = [];
  const gateway = new ModelGatewayImpl({
    tasks,
    prompts,
    routing,
    budget,
    providers,
    validator: new SchemaValidator(),
    onTrace: (t) => traces.push(t),
    clock: opts.clock,
  });

  return { gateway, tasks, prompts, routing, budget, traces };
}
