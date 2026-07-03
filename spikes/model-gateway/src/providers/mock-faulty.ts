/**
 * MockFaultyProvider：可注入故障脚本的 Mock Provider。
 * 脚本按调用次序消费；耗尽后默认 OK。
 *
 * 故障类型：
 * - FAIL             抛 ProviderUnavailableError（触发故障切换）
 * - INVALID_JSON     返回非 JSON 文本（触发结构化输出重试）
 * - SCHEMA_VIOLATION 返回合法 JSON 但违反 output Schema（触发结构化输出重试）
 * - OK               返回合法输出
 */
import {
  ProviderUnavailableError,
  type ModelProvider,
  type ProviderRequest,
  type ProviderResponse,
  type TokenUsage,
} from '../contract.js';
import { makeSchemaViolatingOutput, makeValidOutput, WS_A } from './fixtures.js';

export type FaultKind = 'FAIL' | 'INVALID_JSON' | 'SCHEMA_VIOLATION' | 'OK';

export class MockFaultyProvider implements ModelProvider {
  readonly name: string;
  readonly requests: ProviderRequest[] = [];
  private callIndex = 0;

  constructor(
    private readonly script: FaultKind[],
    name = 'mock-faulty',
    private readonly usage: TokenUsage = { inputTokens: 1100, outputTokens: 700 },
  ) {
    this.name = name;
  }

  async invoke(req: ProviderRequest): Promise<ProviderResponse> {
    this.requests.push(req);
    const behavior = this.script[this.callIndex] ?? 'OK';
    this.callIndex += 1;

    switch (behavior) {
      case 'FAIL':
        throw new ProviderUnavailableError(this.name, '注入故障：模拟 429/5xx/网络错误');
      case 'INVALID_JSON':
        return { text: '抱歉，我无法…（非 JSON 输出）', usage: this.usage };
      case 'SCHEMA_VIOLATION':
        return { text: JSON.stringify(makeSchemaViolatingOutput(this.workspaceFrom(req))), usage: this.usage };
      case 'OK':
        return { text: JSON.stringify(makeValidOutput(this.workspaceFrom(req))), usage: this.usage };
    }
  }

  private workspaceFrom(req: ProviderRequest): string {
    try {
      const parsed = JSON.parse(req.user.split('\n\n[SCHEMA_VALIDATION_FEEDBACK]')[0]!) as {
        workspace_id?: string;
      };
      return parsed.workspace_id ?? WS_A;
    } catch {
      return WS_A;
    }
  }
}
