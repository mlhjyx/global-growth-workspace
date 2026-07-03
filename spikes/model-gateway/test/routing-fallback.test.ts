/**
 * 路由与故障切换：primary 命中 / primary 故障 → fallback / 全部故障 → PROVIDER_EXHAUSTED。
 */
import { describe, expect, it } from 'vitest';
import { AllProvidersFailedError, InvalidInputError } from '../src/contract.js';
import { MockFaultyProvider } from '../src/providers/mock-faulty.js';
import { MockStableProvider } from '../src/providers/mock-stable.js';
import { makeValidInput, WS_A } from '../src/providers/fixtures.js';
import { buildGateway, TASK_REF, POLICY_ID } from './harness.js';

describe('路由', () => {
  it('taskRef → model policy → primary Provider（模型名按 RoutingPolicy 下发）', async () => {
    const stable = new MockStableProvider();
    const { gateway, traces } = buildGateway({ primary: stable });

    const res = await gateway.complete(TASK_REF, makeValidInput(), { workspaceId: WS_A });

    expect(stable.requests).toHaveLength(1);
    expect(stable.requests[0]!.model).toBe('mock-large-v1');
    expect(res.trace.modelPolicy).toBe(POLICY_ID);
    expect(res.trace.provider).toBe('mock-stable');
    expect(traces).toHaveLength(1);
  });

  it('未注册 taskRef → UNKNOWN_TASK，不触达任何 Provider', async () => {
    const stable = new MockStableProvider();
    const { gateway } = buildGateway({ primary: stable });
    await expect(gateway.complete('nonexistent@1', {}, { workspaceId: WS_A })).rejects.toMatchObject({
      code: 'UNKNOWN_TASK',
    });
    expect(stable.requests).toHaveLength(0);
  });

  it('输入不符合 input Schema → INVALID_SCHEMA（不重试、不触达 Provider），Trace 状态 INVALID_INPUT', async () => {
    const stable = new MockStableProvider();
    const { gateway, traces } = buildGateway({ primary: stable });

    const bad = makeValidInput();
    delete (bad as Record<string, unknown>).website_url; // anyOf 两分支都不满足

    const err = await gateway.complete(TASK_REF, bad, { workspaceId: WS_A }).catch((e) => e);
    expect(err).toBeInstanceOf(InvalidInputError);
    expect(stable.requests).toHaveLength(0);
    expect(traces).toHaveLength(1);
    expect(traces[0]!.status).toBe('INVALID_INPUT');
  });
});

describe('故障切换（fallback）', () => {
  it('primary 抛 PROVIDER_UNAVAILABLE → 切换 fallback 成功；Trace 记录两次尝试', async () => {
    const faulty = new MockFaultyProvider(['FAIL']);
    const stable = new MockStableProvider();
    const { gateway } = buildGateway({ primary: faulty, fallbacks: [stable] });

    const res = await gateway.complete(TASK_REF, makeValidInput(), { workspaceId: WS_A });

    expect(faulty.requests).toHaveLength(1);
    expect(stable.requests).toHaveLength(1);
    expect(res.trace.attempts).toHaveLength(2);
    expect(res.trace.attempts[0]).toMatchObject({
      provider: 'mock-faulty',
      status: 'PROVIDER_ERROR',
      errorCode: 'PROVIDER_UNAVAILABLE',
    });
    expect(res.trace.attempts[1]).toMatchObject({ provider: 'mock-stable', status: 'OK' });
    expect(res.trace.provider).toBe('mock-stable');
    expect(res.trace.model).toBe('mock-small-v1'); // fallback 目标的模型
    expect(res.trace.status).toBe('OK');
  });

  it('primary 与全部 fallback 均故障 → ALL_PROVIDERS_FAILED，Trace 状态 PROVIDER_EXHAUSTED', async () => {
    const faulty1 = new MockFaultyProvider(['FAIL'], 'mock-faulty-1');
    const faulty2 = new MockFaultyProvider(['FAIL'], 'mock-faulty-2');
    const { gateway, traces } = buildGateway({ primary: faulty1, fallbacks: [faulty2] });

    const err = await gateway
      .complete(TASK_REF, makeValidInput(), { workspaceId: WS_A })
      .catch((e) => e);

    expect(err).toBeInstanceOf(AllProvidersFailedError);
    expect(err.trace.attempts).toHaveLength(2);
    expect(err.trace.status).toBe('PROVIDER_EXHAUSTED');
    expect(traces).toHaveLength(1);
    expect(traces[0]).toBe(err.trace);
  });
});
