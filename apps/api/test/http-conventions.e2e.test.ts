// BE-02 冒烟 #4/#5：统一错误体形状、request-id/correlation-id 回显与透传。
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/main';

describe('HTTP 约定（错误体 + 请求上下文头）', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('404 返回统一错误体 { error_code, message, retryable, request_id }', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/nope').expect(404);
    expect(res.body.error_code).toBe('NOT_FOUND');
    expect(typeof res.body.message).toBe('string');
    expect(res.body.retryable).toBe(false);
    expect(typeof res.body.request_id).toBe('string');
  });

  it('未带头时生成 request-id 并回显，correlation-id 缺省等于 request-id', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
    const rid = res.headers['x-request-id'];
    expect(rid).toBeTruthy();
    expect(res.headers['x-correlation-id']).toBe(rid);
  });

  it('入站 x-request-id / x-correlation-id 原样透传回显', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/health')
      .set('x-request-id', 'req-abc-123')
      .set('x-correlation-id', 'corr-xyz-789')
      .expect(200);
    expect(res.headers['x-request-id']).toBe('req-abc-123');
    expect(res.headers['x-correlation-id']).toBe('corr-xyz-789');
  });

  it('错误体的 request_id 与响应头一致（可追溯）', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/nope')
      .set('x-request-id', 'trace-me-404')
      .expect(404);
    expect(res.body.request_id).toBe('trace-me-404');
    expect(res.headers['x-request-id']).toBe('trace-me-404');
  });
});
