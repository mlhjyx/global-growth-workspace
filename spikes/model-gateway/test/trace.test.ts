/**
 * Trace：每次调用（成功/失败）恰好一条，含 provider、latency、cost 估算、prompt 版本、Schema $id。
 */
import { describe, expect, it } from 'vitest';
import { MockFaultyProvider } from '../src/providers/mock-faulty.js';
import { MockStableProvider } from '../src/providers/mock-stable.js';
import { makeValidInput, WS_A } from '../src/providers/fixtures.js';
import { buildGateway, TASK_REF, POLICY_ID } from './harness.js';

describe('GatewayTrace', () => {
  it('成功调用：Trace 五要素齐全（provider/latency/cost/prompt 版本/Schema 引用）', async () => {
    const stable = new MockStableProvider();
    const { gateway, traces } = buildGateway({ primary: stable });

    const { trace, output } = await gateway.complete(TASK_REF, makeValidInput(), {
      workspaceId: WS_A,
      correlationId: 'corr-demo-001',
    });

    expect(trace.traceId).toMatch(/^trc_/);
    expect(trace.taskRef).toBe(TASK_REF);
    expect(trace.taskType).toBe('COMPANY_UNDERSTANDING');
    expect(trace.workspaceId).toBe(WS_A);
    expect(trace.correlationId).toBe('corr-demo-001');
    expect(trace.modelPolicy).toBe(POLICY_ID);
    expect(trace.promptId).toBe('company-understanding/prompt');
    expect(trace.promptVersion).toBe('v1');
    expect(trace.inputSchemaId).toBe('ggw://contracts/ai-tasks/company-understanding/input');
    expect(trace.outputSchemaId).toBe('ggw://contracts/ai-tasks/company-understanding/output');
    expect(trace.provider).toBe('mock-stable');
    expect(trace.model).toBe('mock-large-v1');
    expect(trace.totalLatencyMs).toBeGreaterThanOrEqual(0);
    // cost = 1200/1000*0.003 + 900/1000*0.015
    expect(trace.costUsd).toBeCloseTo(0.0171, 6);
    expect(trace.attempts[0]!.usage).toEqual({ inputTokens: 1200, outputTokens: 900 });
    expect(trace.validation).toEqual({ attempts: 1, valid: true });
    expect(trace.status).toBe('OK');
    expect(Date.parse(trace.createdAt)).not.toBeNaN();

    expect(traces).toHaveLength(1);
    expect(traces[0]).toBe(trace);
    expect(output).toBeTruthy();
  });

  it('失败调用同样产出 Trace 且挂在错误上（可供 Langfuse 类 sink 落盘）', async () => {
    const faulty = new MockFaultyProvider(['FAIL'], 'mock-faulty-only');
    const { gateway, traces } = buildGateway({ primary: faulty });

    const err = await gateway
      .complete(TASK_REF, makeValidInput(), { workspaceId: WS_A })
      .catch((e) => e);

    expect(err.trace).toBeDefined();
    expect(err.trace.status).toBe('PROVIDER_EXHAUSTED');
    expect(err.trace.promptVersion).toBe('v1');
    expect(err.trace.attempts).toHaveLength(1);
    expect(traces).toHaveLength(1);
  });

  it('连续 N 次调用产出 N 条 Trace（无遗漏、无重复）', async () => {
    const stable = new MockStableProvider();
    const { gateway, traces } = buildGateway({ primary: stable });

    for (let i = 0; i < 3; i++) {
      await gateway.complete(TASK_REF, makeValidInput(), { workspaceId: WS_A });
    }
    expect(traces).toHaveLength(3);
    expect(new Set(traces.map((t) => t.traceId)).size).toBe(3);
  });

  it('钉住 prompt 版本：opts.promptVersion 显式取 draft；缺省解析只落最新 released', async () => {
    const stable = new MockStableProvider();
    const { gateway, prompts } = buildGateway({ primary: stable });
    prompts.register({
      promptId: 'company-understanding/prompt',
      version: 'v2',
      taskType: 'COMPANY_UNDERSTANDING',
      system: 'v2 系统指令（演示）',
      releaseStatus: 'draft',
    });

    const pinned = await gateway.complete(TASK_REF, makeValidInput(), {
      workspaceId: WS_A,
      promptVersion: 'v1',
    });
    expect(pinned.trace.promptVersion).toBe('v1');

    // draft v2 不服务未钉版本的调用（Codex 3521756913）；发布后缺省解析切到 v2
    const beforeRelease = await gateway.complete(TASK_REF, makeValidInput(), { workspaceId: WS_A });
    expect(beforeRelease.trace.promptVersion).toBe('v1');
    prompts.release('company-understanding/prompt', 'v2');
    const afterRelease = await gateway.complete(TASK_REF, makeValidInput(), { workspaceId: WS_A });
    expect(afterRelease.trace.promptVersion).toBe('v2');
    expect(stable.requests[2]!.system).toBe('v2 系统指令（演示）');
  });

  it('钉住不存在的 prompt 版本：失败同样产出恰好一条 Trace（Codex 3521756902）', async () => {
    const stable = new MockStableProvider();
    const { gateway, traces } = buildGateway({ primary: stable });

    const err = await gateway
      .complete(TASK_REF, makeValidInput(), { workspaceId: WS_A, promptVersion: 'v9' })
      .catch((e) => e);

    expect(err.code).toBe('UNKNOWN_PROMPT');
    expect(err.trace).toBeDefined();
    expect(err.trace.status).toBe('UNKNOWN_PROMPT');
    expect(err.trace.promptVersion).toBe('v9'); // 记请求的版本，供审计归因
    expect(err.trace.attempts).toHaveLength(0);
    expect(traces).toHaveLength(1);
    expect(stable.requests).toHaveLength(0); // 未触达 Provider
  });
});
