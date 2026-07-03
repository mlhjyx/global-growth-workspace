/**
 * SPK-MGW：自有 ModelGateway Contract（形状验证，Mock Provider）。
 *
 * 定位（M1_BACKEND_FOUNDATION_PLAN §3 SPK-MGW 行）：
 * - 业务代码永远只面对本文件的接口（CLAUDE.md 硬边界 2 / ADR-007：不直接 import 厂商 SDK）。
 * - LiteLLM 是**未来内核候选**（业务负责人拍板 F 项：进入 Spike ≠ 生产采用）；
 *   若未来引入，它挂在 ModelProvider 适配层之下，本 Contract 不变。
 * - 本 Spike 不接任何真实模型 API；真实 Key 路径只写文档约定（见 REPORT.md 前置清单）。
 */

// ---------------------------------------------------------------------------
// Gateway 对业务侧的唯一入口
// ---------------------------------------------------------------------------

export interface ModelGateway {
  /**
   * 按 TaskRegistry 中注册的任务执行一次结构化模型调用。
   * @param taskRef  任务引用，如 "company-understanding@1"
   * @param input    必须符合任务注册的 input JSON Schema
   * @param opts     调用期选项（workspace、预算上限、prompt 版本钉住等）
   */
  complete(taskRef: string, input: unknown, opts: CompleteOptions): Promise<CompleteResult>;
}

export interface CompleteOptions {
  /** 租户边界（ADR-001）：预算、Trace、审计一律按 workspace 归因 */
  workspaceId: string;
  /** 业务关联链 ID（母本 11.10 envelope correlation_id 口径） */
  correlationId?: string;
  /** 钉住某个 prompt 版本（缺省 = PromptRegistry 该 prompt 的最新 released 版本） */
  promptVersion?: string;
}

export interface CompleteResult {
  /** 已通过任务 output JSON Schema 校验的结构化输出 */
  output: unknown;
  /** 本次调用的完整 Trace（Langfuse 是未来 Trace 落地候选，本 Spike 只定形状） */
  trace: GatewayTrace;
}

// ---------------------------------------------------------------------------
// Trace（每次调用必产出，成功与失败都产出）
// ---------------------------------------------------------------------------

export type AttemptStatus = 'OK' | 'PROVIDER_ERROR' | 'INVALID_OUTPUT';

export interface ProviderAttempt {
  /** Provider 名（如 mock-stable / mock-faulty；未来为 anthropic/openai/litellm 等） */
  provider: string;
  /** 具体模型标识 */
  model: string;
  /** 该 Provider 上的第几次尝试（结构化输出校验重试会 +1） */
  attempt: number;
  status: AttemptStatus;
  latencyMs: number;
  /** 失败时的错误码（PROVIDER_UNAVAILABLE / STRUCTURED_OUTPUT_INVALID 等） */
  errorCode?: string;
  errorMessage?: string;
  /** 成功尝试的 token 用量与成本估算 */
  usage?: TokenUsage;
  costUsd?: number;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
}

export interface RedactionSummary {
  /** 脱敏类别，如 EMAIL / PHONE */
  kind: string;
  count: number;
}

export interface GatewayTrace {
  traceId: string;
  taskRef: string;
  taskType: string;
  workspaceId: string;
  correlationId?: string;
  /** RoutingPolicy 的策略名，如 structured_extraction.default（母本 9.5） */
  modelPolicy: string;
  promptId: string;
  promptVersion: string;
  /** 输入/输出 Schema 的 $id（Schema Registry 口径，母本 9.6） */
  inputSchemaId: string;
  outputSchemaId: string;
  /** 逐 Provider、逐尝试的记录（含故障切换与校验重试） */
  attempts: ProviderAttempt[];
  /** 最终成功的 Provider；全部失败时为 null */
  provider: string | null;
  model: string | null;
  totalLatencyMs: number;
  /** 本次调用成本估算（USD，按 RoutingPolicy 单价 × usage） */
  costUsd: number;
  /** 发给 Provider 前应用的脱敏统计（母本 9.10：Trace 写入前敏感字段脱敏） */
  redactions: RedactionSummary[];
  /** 结构化输出校验：尝试次数与最终结果 */
  validation: { attempts: number; valid: boolean };
  status: 'OK' | 'BUDGET_EXCEEDED' | 'INVALID_INPUT' | 'PROVIDER_EXHAUSTED' | 'INVALID_OUTPUT';
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Provider 适配层（Mock 与未来真实 Provider/LiteLLM 的共同形状）
// ---------------------------------------------------------------------------

export interface ProviderRequest {
  model: string;
  /** 系统指令（来自 PromptRegistry 指定版本） */
  system: string;
  /** 用户消息 = 序列化 + 脱敏后的任务输入（可能附带上一轮校验错误反馈） */
  user: string;
  /** 本 Provider 上的第几次尝试（1 起） */
  attempt: number;
}

export interface ProviderResponse {
  /** 模型原始文本输出（期望为单个 JSON 对象） */
  text: string;
  usage: TokenUsage;
}

export interface ModelProvider {
  readonly name: string;
  invoke(req: ProviderRequest): Promise<ProviderResponse>;
}

// ---------------------------------------------------------------------------
// 错误（错误码对齐 task-contract.md 第 5 节 / 母本 11.15 行为矩阵）
// ---------------------------------------------------------------------------

export class GatewayError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    /** 失败调用同样产出 Trace，挂在错误上供上游落盘 */
    public trace?: GatewayTrace,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

/** 工作区日预算超限：调用被熔断，不触达 Provider（母本 11.15 BUDGET_EXCEEDED） */
export class BudgetExceededError extends GatewayError {
  constructor(message: string, trace?: GatewayTrace) {
    super('BUDGET_EXCEEDED', message, trace);
  }
}

/** 输入不符合任务 input Schema：不重试（母本 11.15：INVALID_SCHEMA 输入不重试） */
export class InvalidInputError extends GatewayError {
  constructor(
    message: string,
    public readonly errors: string[],
    trace?: GatewayTrace,
  ) {
    super('INVALID_SCHEMA', message, trace);
  }
}

/** 输出结构化校验失败且重试一次后仍失败：永不透传不合规响应（task-contract.md 第 1.3 节） */
export class StructuredOutputError extends GatewayError {
  constructor(
    message: string,
    public readonly errors: string[],
    trace?: GatewayTrace,
  ) {
    super('STRUCTURED_OUTPUT_INVALID', message, trace);
  }
}

/** Provider 侧临时故障（Mock 注入用；真实场景对应 429/5xx/网络错误） */
export class ProviderUnavailableError extends GatewayError {
  constructor(provider: string, message: string) {
    super('PROVIDER_UNAVAILABLE', `[${provider}] ${message}`);
  }
}

/** primary 与全部 fallback 均不可用 */
export class AllProvidersFailedError extends GatewayError {
  constructor(message: string, trace?: GatewayTrace) {
    super('ALL_PROVIDERS_FAILED', message, trace);
  }
}

export class UnknownTaskError extends GatewayError {
  constructor(taskRef: string) {
    super('UNKNOWN_TASK', `TaskRegistry 中不存在任务：${taskRef}`);
  }
}

export class UnknownPromptError extends GatewayError {
  constructor(promptId: string, version?: string) {
    super('UNKNOWN_PROMPT', `PromptRegistry 中不存在 prompt：${promptId}${version ? '@' + version : ''}`);
  }
}
