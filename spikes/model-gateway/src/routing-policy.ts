/**
 * RoutingPolicy：模型策略名 → primary + fallback Provider 目标列表（母本 9.5、INT-002 单 Provider 熔断的路由前提）。
 * 单价用于成本估算与 BudgetGuard 预检（母本 9.10 成本归因）。
 */

export interface ProviderTarget {
  /** ModelProvider.name */
  provider: string;
  model: string;
  /** 每 1K input token 单价（USD） */
  costPer1kInputUsd: number;
  /** 每 1K output token 单价（USD） */
  costPer1kOutputUsd: number;
}

export interface RoutingRule {
  policyId: string;
  primary: ProviderTarget;
  fallbacks: ProviderTarget[];
}

export class RoutingPolicy {
  private readonly rules = new Map<string, RoutingRule>();

  register(rule: RoutingRule): void {
    this.rules.set(rule.policyId, rule);
  }

  resolve(policyId: string): RoutingRule {
    const rule = this.rules.get(policyId);
    if (!rule) throw new Error(`RoutingPolicy 中不存在策略：${policyId}`);
    return rule;
  }

  /** 按声明顺序返回尝试链：primary 在前，fallback 依序在后 */
  targets(policyId: string): ProviderTarget[] {
    const rule = this.resolve(policyId);
    return [rule.primary, ...rule.fallbacks];
  }
}

/** 目标成本估算（预检用；输出 token 未知时用保守假设值） */
export const ASSUMED_OUTPUT_TOKENS = 1000;

export function estimateCostUsd(target: ProviderTarget, inputChars: number): number {
  const estInputTokens = Math.ceil(inputChars / 4); // 粗略 4 chars/token
  return (
    (estInputTokens / 1000) * target.costPer1kInputUsd +
    (ASSUMED_OUTPUT_TOKENS / 1000) * target.costPer1kOutputUsd
  );
}

export function actualCostUsd(
  target: ProviderTarget,
  usage: { inputTokens: number; outputTokens: number },
): number {
  return (
    (usage.inputTokens / 1000) * target.costPer1kInputUsd +
    (usage.outputTokens / 1000) * target.costPer1kOutputUsd
  );
}
