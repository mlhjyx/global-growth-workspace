// 内存实现（仅 local/CI；单进程语义）。时钟可注入以便 TTL 测试。
import {
  type BeginResult,
  IDEMPOTENCY_TTL_MS,
  type IdempotencyKeySpec,
  type IdempotencyStore,
  type StoredResponse,
} from './idempotency.types';

interface Entry {
  requestHash: string;
  status: 'PENDING' | 'COMPLETED';
  response?: StoredResponse;
  storedAt: number;
}

// NUL 字符作复合键分隔符：HTTP 头与路由中不可能出现，无拼接碰撞风险
const SEP = String.fromCharCode(0);
const composite = (spec: IdempotencyKeySpec): string =>
  `${spec.scopeId}${SEP}${spec.operationId}${SEP}${spec.idempotencyKey}`;

export class MemoryIdempotencyStore implements IdempotencyStore {
  private readonly entries = new Map<string, Entry>();

  constructor(private readonly now: () => number = () => Date.now()) {}

  begin(spec: IdempotencyKeySpec, requestHash: string): BeginResult {
    const key = composite(spec);
    const existing = this.entries.get(key);
    if (existing && this.now() - existing.storedAt > IDEMPOTENCY_TTL_MS) {
      this.entries.delete(key);
      return this.begin(spec, requestHash);
    }
    if (!existing) {
      this.entries.set(key, { requestHash, status: 'PENDING', storedAt: this.now() });
      return { kind: 'proceed' };
    }
    if (existing.requestHash !== requestHash) return { kind: 'mismatch' };
    if (existing.status === 'PENDING') return { kind: 'pending' };
    return { kind: 'replay', response: existing.response! };
  }

  complete(spec: IdempotencyKeySpec, response: StoredResponse): void {
    const entry = this.entries.get(composite(spec));
    if (entry) {
      entry.status = 'COMPLETED';
      entry.response = response;
      entry.storedAt = this.now();
    }
  }

  fail(spec: IdempotencyKeySpec): void {
    this.entries.delete(composite(spec));
  }
}
