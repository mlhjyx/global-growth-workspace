// BE-02 冒烟 #7：每请求恰好一条 JSON 访问日志，含 route/status/duration/request_id/correlation_id。
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/create-app';

describe('访问日志（结构化 JSON）', () => {
  let app: INestApplication;
  const lines: Record<string, unknown>[] = [];

  beforeAll(async () => {
    app = await createApp({ accessLogSink: (line) => lines.push(line) });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('每请求恰好一条，字段齐全且与响应头一致', async () => {
    lines.length = 0;
    await request(app.getHttpServer())
      .get('/health')
      .set('x-request-id', 'log-probe-1')
      .set('x-correlation-id', 'corr-probe-1')
      .expect(200);

    expect(lines).toHaveLength(1);
    const line = lines[0]!;
    expect(line.type).toBe('access');
    expect(line.method).toBe('GET');
    expect(line.route).toBe('/health');
    expect(line.status).toBe(200);
    expect(typeof line.duration_ms).toBe('number');
    expect(line.request_id).toBe('log-probe-1');
    expect(line.correlation_id).toBe('corr-probe-1');
  });

  it('错误响应同样落日志（status=404）', async () => {
    lines.length = 0;
    await request(app.getHttpServer()).get('/api/v1/nope').expect(404);
    expect(lines).toHaveLength(1);
    expect(lines[0]!.status).toBe(404);
  });

  it('query string 不落日志（敏感检索参数不进集中采集，3522684842）', async () => {
    lines.length = 0;
    await request(app.getHttpServer())
      .get('/health?filter=secret-email@example.com&cursor=abc')
      .expect(200);
    expect(lines).toHaveLength(1);
    expect(lines[0]!.route).toBe('/health');
    expect(JSON.stringify(lines[0])).not.toContain('secret-email');
  });
});
