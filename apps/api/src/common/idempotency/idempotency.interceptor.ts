// 全局幂等拦截器：写方法 + Idempotency-Key 头触发（§5.3）。
// 重放带 x-idempotency-replay: true；键复用/并发 → 409 统一错误体。
import { createHash } from 'node:crypto';
import {
  type CallHandler,
  ConflictException,
  type ExecutionContext,
  Inject,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { type Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { IDEMPOTENCY_STORE, type IdempotencyStore } from './idempotency.types';

const MUTATING = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(@Inject(IDEMPOTENCY_STORE) private readonly store: IdempotencyStore) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const key = req.header('idempotency-key');

    if (!key || !MUTATING.has(req.method)) return next.handle();

    const requestHash = createHash('sha256')
      .update(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body ?? null)}`)
      .digest('hex');

    const result = this.store.begin(key, requestHash);

    if (result.kind === 'replay') {
      res.setHeader('x-idempotency-replay', 'true');
      res.status(result.response.status);
      return of(result.response.body);
    }
    if (result.kind === 'mismatch') {
      throw new ConflictException('Idempotency-Key 已被不同请求使用（键复用）');
    }
    if (result.kind === 'pending') {
      throw new ConflictException('相同 Idempotency-Key 的请求正在执行（并发冲突）');
    }

    return next.handle().pipe(
      tap((body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          this.store.complete(key, { status: res.statusCode, body });
        } else {
          this.store.fail(key);
        }
      }),
      catchError((err) => {
        this.store.fail(key);
        throw err;
      }),
    );
  }
}
