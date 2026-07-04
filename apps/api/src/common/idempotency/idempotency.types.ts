// Idempotency-Key 语义（EPIC-FOUNDATION §5.3，裁决 #6）：
// BE-02 交付接口 + 内存实现（本地/CI 可用）；BE-03 落库切换为 PG 双存储面实现，接口不变。
export interface StoredResponse {
  status: number;
  body: unknown;
}

export type BeginResult =
  | { kind: 'proceed' } // 新 key：已登记 PENDING，放行执行
  | { kind: 'replay'; response: StoredResponse } // 同 key 同请求哈希且已完成：重放快照
  | { kind: 'pending' } // 同 key 同哈希但仍在执行：并发冲突 409（§5.3）
  | { kind: 'mismatch' }; // 同 key 不同请求哈希：键复用 409

export interface IdempotencyStore {
  begin(key: string, requestHash: string): BeginResult;
  /** 仅 2xx 快照可重放（§5.3：response_body 按 DATA_CLASSIFICATION 标注，24h TTL） */
  complete(key: string, response: StoredResponse): void;
  /** 非 2xx / 抛错：清除 PENDING，允许重试 */
  fail(key: string): void;
}

export const IDEMPOTENCY_STORE = Symbol.for('ggw.idempotencyStore');
export const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;
