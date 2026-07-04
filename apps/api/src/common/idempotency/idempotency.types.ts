// Idempotency-Key 语义（EPIC-FOUNDATION §5.3，裁决 #6）：
// BE-02 交付接口 + 内存实现（本地/CI 可用）；BE-03 落库切换为 PG 双存储面实现，接口不变。
// BE-03 落库硬口径（§5.3 ②，PR #22 评论处置 #2）：COMPLETED 置位与响应快照必须与业务写
// 同一 PG 事务提交——届时 complete() 由事务内实现承接，接口签名不变、调用面不动。
export interface StoredResponse {
  status: number;
  body: unknown;
}

/**
 * 幂等记录键（§5.3 去重作用域）：唯一键 = (scope_id, operation_id, idempotency_key)，
 * 两个不同写端点使用同一 Idempotency-Key 互不碰撞（PR #25 评论处置：3522684850）。
 * BE-02 无认证，scopeId 恒为 UNSCOPED_SCOPE；BE-04 起租户端点用 JWT `ws`，
 * 平台/组织级端点用 organization_id 或 user_id（§5.3「所有权不一刀切」）。
 */
export interface IdempotencyKeySpec {
  scopeId: string;
  operationId: string;
  idempotencyKey: string;
}

export const UNSCOPED_SCOPE = 'unscoped';

export type BeginResult =
  | { kind: 'proceed' } // 新 key：已登记 PENDING，放行执行
  | { kind: 'replay'; response: StoredResponse } // 同 key 同请求哈希且已完成：重放快照
  | { kind: 'pending' } // 同 key 同哈希但仍在执行：并发冲突 409（§5.3）
  | { kind: 'mismatch' }; // 同 key 不同请求哈希：键复用 409

export interface IdempotencyStore {
  begin(spec: IdempotencyKeySpec, requestHash: string): BeginResult;
  /** 仅 2xx 快照可重放（§5.3：response_body 按 DATA_CLASSIFICATION 标注，24h TTL） */
  complete(spec: IdempotencyKeySpec, response: StoredResponse): void;
  /** 非 2xx / 抛错：清除 PENDING，允许重试 */
  fail(spec: IdempotencyKeySpec): void;
}

export const IDEMPOTENCY_STORE = Symbol.for('ggw.idempotencyStore');
export const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;
