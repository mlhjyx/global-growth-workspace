// BE-02 冒烟 #1/#2/#3：health/readiness 200、OpenAPI 可获取（真实起 Nest 应用测）。
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/main';

describe('BE-02 骨架冒烟', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createApp();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/v1/health → 200 ok', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health').expect(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime_s).toBe('number');
  });

  it('GET /api/v1/readiness → 200 ready', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/readiness').expect(200);
    expect(res.body.status).toBe('ready');
    expect(res.body.checks).toBeTypeOf('object');
  });

  it('GET /api/v1/openapi.json → 200 且含 openapi 字段', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/openapi.json').expect(200);
    expect(res.body.openapi).toMatch(/^3\./);
    expect(res.body.info.version).toBe('v1');
  });

  it('未知路由 → 404', async () => {
    await request(app.getHttpServer()).get('/api/v1/nonexistent').expect(404);
  });
});
