/**
 * BudgetGuard：工作区（workspace）日预算熔断（母本 11.15 BUDGET_EXCEEDED、9.10 成本归因、ADR-001 租户边界）。
 *
 * Spike 实现为进程内存；生产实现须落 PG（Budget/Quota 表随 BE-03）并保证并发原子性。
 * 语义：调用前用估算成本预检（spent + estimate > limit → 熔断，不触达 Provider），
 * 调用成功后按实际成本记账。日界 = UTC 日期；clock 可注入以便测试跨日重置。
 */
import { BudgetExceededError } from './contract.js';

export interface BudgetGuard {
  /** 预检：会超限则抛 BudgetExceededError（调用方保证此时尚未触达 Provider） */
  assertWithinBudget(workspaceId: string, estimateUsd: number): void;
  /** 成功调用后按实际成本记账 */
  charge(workspaceId: string, actualUsd: number): void;
  /** 当日已用（USD） */
  spentToday(workspaceId: string): number;
}

export class InMemoryBudgetGuard implements BudgetGuard {
  /** workspaceId -> 日预算上限（USD）；未配置的 workspace 使用 defaultDailyLimitUsd */
  private readonly limits: Map<string, number>;
  /** `${workspaceId}:${utcDate}` -> 已用 USD */
  private readonly spent = new Map<string, number>();

  constructor(
    limits: Record<string, number> = {},
    private readonly defaultDailyLimitUsd = 10,
    private readonly clock: () => Date = () => new Date(),
  ) {
    this.limits = new Map(Object.entries(limits));
  }

  private dayKey(workspaceId: string): string {
    return `${workspaceId}:${this.clock().toISOString().slice(0, 10)}`;
  }

  private limitFor(workspaceId: string): number {
    return this.limits.get(workspaceId) ?? this.defaultDailyLimitUsd;
  }

  assertWithinBudget(workspaceId: string, estimateUsd: number): void {
    const limit = this.limitFor(workspaceId);
    const used = this.spent.get(this.dayKey(workspaceId)) ?? 0;
    if (used + estimateUsd > limit) {
      throw new BudgetExceededError(
        `workspace ${workspaceId} 日预算熔断：已用 $${used.toFixed(4)} + 估算 $${estimateUsd.toFixed(4)} > 上限 $${limit.toFixed(4)}`,
      );
    }
  }

  charge(workspaceId: string, actualUsd: number): void {
    const key = this.dayKey(workspaceId);
    this.spent.set(key, (this.spent.get(key) ?? 0) + actualUsd);
  }

  spentToday(workspaceId: string): number {
    return this.spent.get(this.dayKey(workspaceId)) ?? 0;
  }
}
