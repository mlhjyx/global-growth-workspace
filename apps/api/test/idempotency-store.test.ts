// 幂等存储单元测试：作用域键控（scope/operation 隔离，3522684850）与规范化指纹（3522684846）。
import { describe, expect, it } from 'vitest';
import { canonicalJson } from '../src/common/idempotency/canonical-json';
import { MemoryIdempotencyStore } from '../src/common/idempotency/memory-idempotency.store';
import { IDEMPOTENCY_TTL_MS } from '../src/common/idempotency/idempotency.types';

const spec = (overrides: Partial<Parameters<MemoryIdempotencyStore['begin']>[0]> = {}) => ({
  scopeId: 'ws_A',
  operationId: 'POST /things',
  idempotencyKey: 'key-1',
  ...overrides,
});

describe('canonicalJson', () => {
  it('对象键递归排序：键序不同的等价 JSON 序列化一致', () => {
    expect(canonicalJson({ b: 1, a: { d: [{ z: 1, y: 2 }], c: 3 } })).toBe(
      canonicalJson({ a: { c: 3, d: [{ y: 2, z: 1 }] }, b: 1 }),
    );
  });

  it('数组顺序保留（数组序是语义的一部分，不排序）', () => {
    expect(canonicalJson({ a: [1, 2] })).not.toBe(canonicalJson({ a: [2, 1] }));
  });
});

describe('MemoryIdempotencyStore 作用域键控', () => {
  it('同 key 不同 operation：互不碰撞，各自 proceed', () => {
    const store = new MemoryIdempotencyStore();
    expect(store.begin(spec(), 'h1').kind).toBe('proceed');
    expect(store.begin(spec({ operationId: 'POST /others' }), 'h2').kind).toBe('proceed');
  });

  it('同 key 不同 scope：互不碰撞（BE-04 起租户隔离的存储面前提）', () => {
    const store = new MemoryIdempotencyStore();
    expect(store.begin(spec(), 'h1').kind).toBe('proceed');
    expect(store.begin(spec({ scopeId: 'ws_B' }), 'h1').kind).toBe('proceed');
  });

  it('同 (scope, operation, key) 不同 hash：mismatch', () => {
    const store = new MemoryIdempotencyStore();
    store.begin(spec(), 'h1');
    expect(store.begin(spec(), 'h2').kind).toBe('mismatch');
  });

  it('COMPLETED 后同 hash 重放；TTL 过期后重新执行', () => {
    let t = 1_000;
    const store = new MemoryIdempotencyStore(() => t);
    store.begin(spec(), 'h1');
    store.complete(spec(), { status: 200, body: { ok: true } });
    const replay = store.begin(spec(), 'h1');
    expect(replay.kind).toBe('replay');
    t += IDEMPOTENCY_TTL_MS + 1;
    expect(store.begin(spec(), 'h1').kind).toBe('proceed');
  });
});
