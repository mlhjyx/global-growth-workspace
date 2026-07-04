// 内存实现（仅 local/CI；单进程语义）。时钟可注入以便 TTL 测试。
import {
  type BeginResult,
  IDEMPOTENCY_TTL_MS,
  type IdempotencyStore,
  type StoredResponse,
} from './idempotency.types';

interface Entry {
  requestHash: string;
  status: 'PENDING' | 'COMPLETED';
  response?: StoredResponse;
  storedAt: number;
}

export class MemoryIdempotencyStore implements IdempotencyStore {
  private readonly entries = new Map<string, Entry>();

  constructor(private readonly now: () => number = () => Date.now()) {}

  begin(key: string, requestHash: string): BeginResult {
    const existing = this.entries.get(key);
    if (existing && this.now() - existing.storedAt > IDEMPOTENCY_TTL_MS) {
      this.entries.delete(key);
      return this.begin(key, requestHash);
    }
    if (!existing) {
      this.entries.set(key, { requestHash, status: 'PENDING', storedAt: this.now() });
      return { kind: 'proceed' };
    }
    if (existing.requestHash !== requestHash) return { kind: 'mismatch' };
    if (existing.status === 'PENDING') return { kind: 'pending' };
    return { kind: 'replay', response: existing.response! };
  }

  complete(key: string, response: StoredResponse): void {
    const entry = this.entries.get(key);
    if (entry) {
      entry.status = 'COMPLETED';
      entry.response = response;
      entry.storedAt = this.now();
    }
  }

  fail(key: string): void {
    this.entries.delete(key);
  }
}
