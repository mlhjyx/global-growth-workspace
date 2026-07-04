// 每请求一条 JSON 访问日志（BE-02 冒烟 #7）：route/status/duration_ms/request_id/correlation_id。
// sink 可注入以便测试断言；生产走 stdout（结构化日志由采集侧消费）。
import type { NextFunction, Request, Response } from 'express';
import { getRequestContext } from './request-context.middleware';

export type AccessLogSink = (line: Record<string, unknown>) => void;

const defaultSink: AccessLogSink = (line) => {
  console.log(JSON.stringify(line));
};

export function accessLogMiddleware(sink: AccessLogSink = defaultSink) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startedAt = process.hrtime.bigint();
    res.on('finish', () => {
      const ctx = getRequestContext(req);
      sink({
        level: 'info',
        type: 'access',
        time: new Date().toISOString(),
        method: req.method,
        route: req.originalUrl,
        status: res.statusCode,
        duration_ms: Number((process.hrtime.bigint() - startedAt) / 1_000_000n),
        request_id: ctx?.requestId,
        correlation_id: ctx?.correlationId,
      });
    });
    next();
  };
}
