/**
 * MockStableProvider：始终成功、始终返回符合 output Schema 的 JSON。
 * 记录收到的每个请求，供测试断言（脱敏是否生效、路由是否命中等）。
 */
import type { ModelProvider, ProviderRequest, ProviderResponse, TokenUsage } from '../contract.js';
import { makeValidOutput, WS_A } from './fixtures.js';

export class MockStableProvider implements ModelProvider {
  readonly name = 'mock-stable';
  readonly requests: ProviderRequest[] = [];

  constructor(private readonly usage: TokenUsage = { inputTokens: 1200, outputTokens: 900 }) {}

  async invoke(req: ProviderRequest): Promise<ProviderResponse> {
    this.requests.push(req);
    // 从（已脱敏的）用户消息中解析 workspace_id，回填输出（脱敏不破坏 JSON 结构的演示）
    let workspaceId = WS_A;
    try {
      const parsed = JSON.parse(req.user.split('\n\n[SCHEMA_VALIDATION_FEEDBACK]')[0]!) as {
        workspace_id?: string;
      };
      if (parsed.workspace_id) workspaceId = parsed.workspace_id;
    } catch {
      /* 保底用默认 workspace */
    }
    return {
      text: JSON.stringify(makeValidOutput(workspaceId)),
      usage: this.usage,
    };
  }
}
