// request-id / correlation-id（BE-02，EPIC-FOUNDATION §5）：
// 入站头透传或生成，响应头回显；correlation 缺省 = request id（链路起点）。
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export const REQUEST_ID_HEADER = 'x-request-id';
export const CORRELATION_ID_HEADER = 'x-correlation-id';

export interface RequestContext {
  requestId: string;
  correlationId: string;
}

// 不做 express 全局类型增强（@types/express v5 下不稳定），用显式存取器
const CTX_KEY = Symbol.for('ggw.requestContext');

export function getRequestContext(req: Request): RequestContext | undefined {
  return (req as Request & { [CTX_KEY]?: RequestContext })[CTX_KEY];
}

export function requestContextMiddleware(req: Request, res: Response, next: NextFunction): void {
  const requestId = firstHeader(req, REQUEST_ID_HEADER) ?? randomUUID();
  const correlationId = firstHeader(req, CORRELATION_ID_HEADER) ?? requestId;
  (req as Request & { [CTX_KEY]?: RequestContext })[CTX_KEY] = { requestId, correlationId };
  res.setHeader(REQUEST_ID_HEADER, requestId);
  res.setHeader(CORRELATION_ID_HEADER, correlationId);
  next();
}

function firstHeader(req: Request, name: string): string | undefined {
  const v = req.headers[name];
  const s = Array.isArray(v) ? v[0] : v;
  return s && s.trim() !== '' ? s : undefined;
}
