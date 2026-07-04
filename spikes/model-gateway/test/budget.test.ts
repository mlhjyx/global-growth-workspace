/**
 * BudgetGuard：工作区日预算熔断（预检不触达 Provider）、按 workspace 隔离、UTC 跨日重置。
 */
import { describe, expect, it } from 'vitest';
import { BudgetExceededError } from '../src/contract.js';
import { MockFaultyProvider } from '../src/providers/mock-faulty.js';
import { MockStableProvider } from '../src/providers/mock-stable.js';
import { makeValidInput, WS_A, WS_B } from '../src/providers/fixtures.js';
import { buildGateway, target, POLICY_ID, TASK_REF } from './harness.js';

// 稳定 Provider 单次成本：1200/1000*0.003 + 900/1000*0.015 = 0.0171 USD
const COST_PER_CALL = 0.0171;

describe('预算熔断（BUDGET_EXCEEDED）', () => {
  it('第一次调用成功记账；预算耗尽后第二次调用被熔断且不触达 Provider', async () => {
    const stable = new MockStableProvider();
    const { gateway, budget, traces } = buildGateway({
      primary: stable,
      budgets: { [WS_A]: 0.02 }, // 只够一次调用（预检估算 ~0.0154 < 0.02，第二次 0.0171+估算 > 0.02）
    });

    const res = await gateway.complete(TASK_REF, makeValidInput(), { workspaceId: WS_A });
    expect(res.trace.costUsd).toBeCloseTo(COST_PER_CALL, 6);
    expect(budget.spentToday(WS_A)).toBeCloseTo(COST_PER_CALL, 6);

    const err = await gateway
      .complete(TASK_REF, makeValidInput(), { workspaceId: WS_A })
      .catch((e) => e);
    expect(err).toBeInstanceOf(BudgetExceededError);
    expect(err.code).toBe('BUDGET_EXCEEDED');
    expect(stable.requests).toHaveLength(1); // 熔断调用未触达 Provider
    expect(err.trace.status).toBe('BUDGET_EXCEEDED');
    expect(err.trace.attempts).toHaveLength(0);
    expect(traces).toHaveLength(2); // 失败调用同样产出 Trace
  });

  it('预算按 workspace 隔离：WS_A 熔断不影响 WS_B（ADR-001 租户边界）', async () => {
    const stable = new MockStableProvider();
    const { gateway } = buildGateway({
      primary: stable,
      budgets: { [WS_A]: 0.001, [WS_B]: 1 }, // WS_A 直接熔断
    });

    await expect(
      gateway.complete(TASK_REF, makeValidInput(WS_A), { workspaceId: WS_A }),
    ).rejects.toBeInstanceOf(BudgetExceededError);

    const res = await gateway.complete(TASK_REF, makeValidInput(WS_B), { workspaceId: WS_B });
    expect(res.trace.status).toBe('OK');
    expect(res.trace.workspaceId).toBe(WS_B);
  });

  it('fallback 单价高于 primary：预算只够 primary 时 fallback 被熔断、不触达 Provider（Codex 3521756900）', async () => {
    const faulty = new MockFaultyProvider(['FAIL'], 'mock-faulty-primary');
    const stable = new MockStableProvider();
    const { gateway, routing, traces } = buildGateway({
      primary: faulty,
      fallbacks: [stable],
      budgets: { [WS_A]: 0.05 }, // 够 primary 估算（~0.0157），不够高价 fallback（~0.103）
    });
    // 覆盖 harness 默认路由：fallback 换成高价目标（1k output $0.1）
    routing.register({
      policyId: POLICY_ID,
      primary: target(faulty.name, 'mock-large-v1'),
      fallbacks: [{ provider: stable.name, model: 'mock-pricey-v1', costPer1kInputUsd: 0.02, costPer1kOutputUsd: 0.1 }],
    });

    const err = await gateway
      .complete(TASK_REF, makeValidInput(), { workspaceId: WS_A })
      .catch((e) => e);

    expect(err).toBeInstanceOf(BudgetExceededError);
    expect(err.trace.status).toBe('BUDGET_EXCEEDED');
    expect(err.trace.attempts).toHaveLength(1); // primary 已尝试并故障
    expect(err.trace.attempts[0]!.status).toBe('PROVIDER_ERROR');
    expect(stable.requests).toHaveLength(0); // 高价 fallback 未被触达
    expect(traces).toHaveLength(1);
  });

  it('估算成本超任务单次上限（maxCostPerRunUsd=0.8）：拒绝而非 clamp 掩盖，不触达 Provider（Codex 3521756909）', async () => {
    const stable = new MockStableProvider();
    const { gateway, routing } = buildGateway({ primary: stable, budgets: { [WS_A]: 100 } });
    // 单价高到估算必超 0.8（1k output $1.0），日预算充足——熔断必须来自单次上限而非日预算
    routing.register({
      policyId: POLICY_ID,
      primary: { provider: stable.name, model: 'mock-huge-v1', costPer1kInputUsd: 0.5, costPer1kOutputUsd: 1.0 },
      fallbacks: [],
    });

    const err = await gateway
      .complete(TASK_REF, makeValidInput(), { workspaceId: WS_A })
      .catch((e) => e);

    expect(err).toBeInstanceOf(BudgetExceededError);
    expect(err.message).toContain('单次上限');
    expect(err.trace.status).toBe('BUDGET_EXCEEDED');
    expect(stable.requests).toHaveLength(0);
  });

  it('UTC 跨日后预算重置（clock 注入）', async () => {
    const stable = new MockStableProvider();
    let now = new Date('2026-07-04T23:50:00Z');
    const { gateway, budget } = buildGateway({
      primary: stable,
      budgets: { [WS_A]: 0.02 },
      clock: () => now,
    });

    await gateway.complete(TASK_REF, makeValidInput(), { workspaceId: WS_A });
    await expect(
      gateway.complete(TASK_REF, makeValidInput(), { workspaceId: WS_A }),
    ).rejects.toBeInstanceOf(BudgetExceededError);

    now = new Date('2026-07-05T00:10:00Z'); // 跨 UTC 日界
    expect(budget.spentToday(WS_A)).toBe(0);
    const res = await gateway.complete(TASK_REF, makeValidInput(), { workspaceId: WS_A });
    expect(res.trace.status).toBe('OK');
  });
});
