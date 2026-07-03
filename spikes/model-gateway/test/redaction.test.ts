/**
 * Redaction 钩子：email/电话在触达 Provider 前被正则脱敏，Trace 记录脱敏统计。
 */
import { describe, expect, it } from 'vitest';
import { defaultRedactionHook } from '../src/redaction.js';
import { MockStableProvider } from '../src/providers/mock-stable.js';
import { makeInputWithPii, WS_A } from '../src/providers/fixtures.js';
import { buildGateway, TASK_REF } from './harness.js';

describe('defaultRedactionHook（单元）', () => {
  it('email 与电话被替换为占位符并计数', () => {
    const r = defaultRedactionHook('联系 a.b+c@ex.io 或 zhang@corp.com.cn，电话 +86 138-0013-8000 / (021) 5555 6666');
    expect(r.text).not.toMatch(/@/);
    expect(r.text).toContain('[REDACTED_EMAIL]');
    expect(r.text).toContain('[REDACTED_PHONE]');
    expect(r.redactions).toContainEqual({ kind: 'EMAIL', count: 2 });
    expect(r.redactions.find((x) => x.kind === 'PHONE')!.count).toBeGreaterThanOrEqual(2);
  });

  it('普通小数字不误伤（总位数 < 7 不脱敏）', () => {
    const r = defaultRedactionHook('成立于 2008 年，员工 120 人，MOQ 500 pcs');
    expect(r.text).toContain('2008');
    expect(r.text).toContain('120');
    expect(r.redactions).toHaveLength(0);
  });
});

describe('Gateway 集成：Provider 只见脱敏后的入参', () => {
  it('email/手机号不出现在 ProviderRequest 中；Trace 带脱敏统计', async () => {
    const stable = new MockStableProvider();
    const { gateway } = buildGateway({ primary: stable });

    const res = await gateway.complete(TASK_REF, makeInputWithPii(), { workspaceId: WS_A });

    const sent = stable.requests[0]!.user;
    expect(sent).not.toContain('zhang.wei@acme-solar.cn');
    expect(sent).not.toContain('138 0013 8000');
    expect(sent).toContain('[REDACTED_EMAIL]');
    expect(sent).toContain('[REDACTED_PHONE]');

    expect(res.trace.redactions).toContainEqual({ kind: 'EMAIL', count: 1 });
    expect(res.trace.redactions).toContainEqual({ kind: 'PHONE', count: 1 });
    // 脱敏不破坏 JSON 结构：Provider 仍能解析出 workspace_id 回填输出
    expect((res.output as { workspace_id: string }).workspace_id).toBe(WS_A);
  });
});
