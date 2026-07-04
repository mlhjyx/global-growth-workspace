// 全局幂等拦截器（§5.3）：全部写方法（POST/PATCH/PUT/DELETE）必带 Idempotency-Key，
// 缺失/非法长度 → 400 INVALID_SCHEMA（PR #25 评论处置：3522684836/3522684848）；
// 重放带 x-idempotency-replay: true；键复用/并发 → 409 统一错误体。
import { createHash } from 'node:crypto';
import {
  BadRequestException,
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
import { canonicalJson } from './canonical-json';
import {
  IDEMPOTENCY_STORE,
  type IdempotencyKeySpec,
  type IdempotencyStore,
  UNSCOPED_SCOPE,
} from './idempotency.types';

const MUTATING = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(@Inject(IDEMPOTENCY_STORE) private readonly store: IdempotencyStore) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    if (!MUTATING.has(req.method)) return next.handle();

    const key = req.header('idempotency-key');
    if (key === undefined) {
      // contracts conventions.md：所有写操作要求 Idempotency-Key；缺失 → 400 INVALID_SCHEMA（§5.3）
      throw new BadRequestException('写操作必须携带 Idempotency-Key 头（1..128 字符）');
    }
    if (key.length < 1 || key.length > 128) {
      throw new BadRequestException('Idempotency-Key 长度必须在 1..128 字符内');
    }

    // 去重作用域 (scope_id, operation_id, idempotency_key)：operation 取路由模式；
    // 实际路径（含路径参数取值）进指纹，同 key 打到不同资源按键复用处理
    const spec: IdempotencyKeySpec = {
      scopeId: UNSCOPED_SCOPE, // BE-04 起：租户端点 = JWT ws，平台端点 = org/user ID
      operationId: `${req.method} ${req.route?.path ?? req.path}`,
      idempotencyKey: key,
    };
    const requestHash = createHash('sha256')
      .update(`${req.path} ${canonicalJson(req.body ?? null)}`)
      .digest('hex');

    const result = this.store.begin(spec, requestHash);

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
          this.store.complete(spec, { status: res.statusCode, body });
        } else {
          this.store.fail(spec);
        }
      }),
      catchError((err) => {
        this.store.fail(spec);
        throw err;
      }),
    );
  }
}
