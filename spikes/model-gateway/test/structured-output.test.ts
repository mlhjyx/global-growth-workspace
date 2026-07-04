/**
 * StructuredOutput：输出经 ajv 校验；失败带错误反馈重试一次；再失败 → STRUCTURED_OUTPUT_INVALID。
 */
import { describe, expect, it } from 'vitest';
import { StructuredOutputError } from '../src/contract.js';
import { MockFaultyProvider } from '../src/providers/mock-faulty.js';
import { MockStableProvider } from '../src/providers/mock-stable.js';
import { makeValidInput, WS_A } from '../src/providers/fixtures.js';
import { buildGateway, TASK_REF } from './harness.js';

describe('结构化输出校验与重试', () => {
  it('首次输出违反 Schema → 带校验错误反馈重试一次 → 第二次合规 → 成功', async () => {
    const faulty = new MockFaultyProvider(['SCHEMA_VIOLATION', 'OK']);
    const { gateway } = buildGateway({ primary: faulty });

    const res = await gateway.complete(TASK_REF, makeValidInput(), { workspaceId: WS_A });

    expect(faulty.requests).toHaveLength(2);
    expect(faulty.requests[0]!.attempt).toBe(1);
    expect(faulty.requests[1]!.attempt).toBe(2);
    // 重试请求携带上一轮的 Schema 校验错误反馈
    expect(faulty.requests[1]!.user).toContain('[SCHEMA_VALIDATION_FEEDBACK]');
    expect(faulty.requests[1]!.user).toContain('ggw://contracts/ai-tasks/company-understanding/output');

    expect(res.trace.validation).toEqual({ attempts: 2, valid: true });
    expect(res.trace.attempts).toHaveLength(2);
    expect(res.trace.attempts[0]!.status).toBe('INVALID_OUTPUT');
    expect(res.trace.attempts[1]!.status).toBe('OK');
    // 两次调用都计费（真实 Provider 同样收费）
    expect(res.trace.costUsd).toBeGreaterThan(res.trace.attempts[1]!.costUsd!);
  });

  it('非 JSON 输出同样走重试路径', async () => {
    const faulty = new MockFaultyProvider(['INVALID_JSON', 'OK']);
    const { gateway } = buildGateway({ primary: faulty });

    const res = await gateway.complete(TASK_REF, makeValidInput(), { workspaceId: WS_A });
    expect(faulty.requests).toHaveLength(2);
    expect(res.trace.validation).toEqual({ attempts: 2, valid: true });
  });

  it('输出 workspace_id 与请求不符：Schema 合法也拒收，禁止跨租户归因/泄漏（Codex 3521756898）', async () => {
    const stable = new MockStableProvider(); // 回显输入中的 workspace_id
    const { gateway, traces } = buildGateway({ primary: stable });

    // 输入体携带 WS_B（Provider 将回显 WS_B），请求方 workspace 是 WS_A → 输出必须被拒
    const err = await gateway
      .complete(TASK_REF, makeValidInput('ws_01JZW0RK000000000000000002'), { workspaceId: WS_A })
      .catch((e) => e);

    expect(err).toBeInstanceOf(StructuredOutputError);
    expect(err.errors.join(';')).toContain('workspace');
    expect(err.trace.status).toBe('INVALID_OUTPUT');
    expect(err.trace.validation.valid).toBe(false);
    expect(stable.requests).toHaveLength(2); // 走一次修复重试后终止，串扰输出从未被返回
    expect(traces).toHaveLength(1);
  });

  it('重试一次后仍违例 → STRUCTURED_OUTPUT_INVALID，恰好 2 次 Provider 调用，不做故障切换', async () => {
    const faulty = new MockFaultyProvider(['SCHEMA_VIOLATION', 'SCHEMA_VIOLATION']);
    const stable = new MockStableProvider(); // fallback 存在但不得被用于兜接输出质量问题
    const { gateway, traces } = buildGateway({ primary: faulty, fallbacks: [stable] });

    const err = await gateway
      .complete(TASK_REF, makeValidInput(), { workspaceId: WS_A })
      .catch((e) => e);

    expect(err).toBeInstanceOf(StructuredOutputError);
    expect(err.code).toBe('STRUCTURED_OUTPUT_INVALID');
    expect(err.errors.length).toBeGreaterThan(0);
    expect(faulty.requests).toHaveLength(2);
    expect(stable.requests).toHaveLength(0); // 校验失败 ≠ Provider 不可用，不切换
    expect(err.trace.status).toBe('INVALID_OUTPUT');
    expect(err.trace.validation).toEqual({ attempts: 2, valid: false });
    expect(traces).toHaveLength(1);
  });

  it('不合规响应永不透传：失败路径无 output（task-contract.md 1.3）', async () => {
    const faulty = new MockFaultyProvider(['SCHEMA_VIOLATION', 'INVALID_JSON']);
    const { gateway } = buildGateway({ primary: faulty });
    await expect(
      gateway.complete(TASK_REF, makeValidInput(), { workspaceId: WS_A }),
    ).rejects.toBeInstanceOf(StructuredOutputError);
  });
});
