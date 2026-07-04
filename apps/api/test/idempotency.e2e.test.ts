// BE-02 冒烟 #6/#10：ValidationPipe 统一 400 + Idempotency-Key 重放/键复用/失败可重试语义（§5.3）。
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/create-app';

describe('幂等与校验（demo 端点承载）', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('无 Idempotency-Key 的写请求：400 INVALID_SCHEMA（conventions.md 全写操作必带）', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/_demo/echo')
      .send({ message: 'hi' })
      .expect(400);
    expect(res.body.error_code).toBe('INVALID_SCHEMA');
    expect(res.body.message).toContain('Idempotency-Key');
  });

  it('Idempotency-Key 超过 128 字符：400 INVALID_SCHEMA（§5.3 头约束）', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/_demo/echo')
      .set('idempotency-key', 'k'.repeat(129))
      .send({ message: 'hi' })
      .expect(400);
    expect(res.body.error_code).toBe('INVALID_SCHEMA');
  });

  it('同 key、同语义但键序不同的 JSON：按同一请求重放，不误判键复用（规范化指纹）', async () => {
    const key = 'idem-canonical-001';
    const first = await request(app.getHttpServer())
      .post('/api/v1/_demo/echo')
      .set('idempotency-key', key)
      .set('content-type', 'application/json')
      .send('{"message":"canon","tag":"t1"}')
      .expect(200);
    const second = await request(app.getHttpServer())
      .post('/api/v1/_demo/echo')
      .set('idempotency-key', key)
      .set('content-type', 'application/json')
      .send('{"tag":"t1","message":"canon"}')
      .expect(200);
    expect(second.headers['x-idempotency-replay']).toBe('true');
    expect(second.body.execution_seq).toBe(first.body.execution_seq);
  });

  it('同 key 同请求：重放快照，不重复执行，带 x-idempotency-replay', async () => {
    const key = 'idem-replay-001';
    const first = await request(app.getHttpServer())
      .post('/api/v1/_demo/echo')
      .set('idempotency-key', key)
      .send({ message: 'once' })
      .expect(200);
    const second = await request(app.getHttpServer())
      .post('/api/v1/_demo/echo')
      .set('idempotency-key', key)
      .send({ message: 'once' })
      .expect(200);
    expect(second.headers['x-idempotency-replay']).toBe('true');
    expect(second.body.execution_seq).toBe(first.body.execution_seq);
  });

  it('同 key 不同请求体：409 键复用，统一错误体', async () => {
    const key = 'idem-mismatch-001';
    await request(app.getHttpServer())
      .post('/api/v1/_demo/echo')
      .set('idempotency-key', key)
      .send({ message: 'a' })
      .expect(200);
    const res = await request(app.getHttpServer())
      .post('/api/v1/_demo/echo')
      .set('idempotency-key', key)
      .send({ message: 'b' })
      .expect(409);
    expect(res.body.error_code).toBe('CONFLICT');
    expect(res.body.retryable).toBe(false);
  });

  it('校验失败：400 INVALID_SCHEMA 含 details；失败不占用 key，修正后同 key 可执行', async () => {
    const key = 'idem-retry-after-400';
    const bad = await request(app.getHttpServer())
      .post('/api/v1/_demo/echo')
      .set('idempotency-key', key)
      .send({ message: '', extra_field: 'x' })
      .expect(400);
    expect(bad.body.error_code).toBe('INVALID_SCHEMA');
    expect(Array.isArray(bad.body.details)).toBe(true);

    // 同 key、修正后的请求体：不应被 PENDING/mismatch 卡死（fail() 已清除）
    await request(app.getHttpServer())
      .post('/api/v1/_demo/echo')
      .set('idempotency-key', key)
      .send({ message: 'fixed' })
      .expect(200);
  });
});
