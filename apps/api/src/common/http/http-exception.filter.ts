// 统一错误体（BE-02，对齐 packages/contracts/conventions.md 错误模型）：
// { error_code, message, retryable, request_id, details? }——全局唯一错误出口，禁止各处自造错误形状。
import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { getRequestContext } from './request-context.middleware';

interface ErrorBody {
  error_code: string;
  message: string;
  retryable: boolean;
  request_id?: string;
  details?: unknown;
}

const CODE_BY_STATUS: Record<number, string> = {
  400: 'VALIDATION_FAILED',
  401: 'UNAUTHENTICATED',
  403: 'PERMISSION_DENIED',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  412: 'VERSION_CONFLICT',
  422: 'UNPROCESSABLE',
  429: 'RATE_LIMITED',
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const res = http.getResponse<Response>();
    const req = http.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const body: ErrorBody = {
      error_code: CODE_BY_STATUS[status] ?? (status >= 500 ? 'INTERNAL' : 'REQUEST_FAILED'),
      message: this.safeMessage(exception, status),
      // 5xx 与 429 可重试；4xx 业务错误不可重试（conventions.md）
      retryable: status >= 500 || status === 429,
      request_id: getRequestContext(req)?.requestId,
    };

    if (exception instanceof HttpException) {
      const resp = exception.getResponse();
      // ValidationPipe 的字段错误列表进 details，不改变顶层形状
      if (typeof resp === 'object' && resp !== null && 'message' in resp) {
        const m = (resp as { message: unknown }).message;
        if (Array.isArray(m)) body.details = m;
      }
    }

    res.status(status).json(body);
  }

  private safeMessage(exception: unknown, status: number): string {
    // 5xx 不向外泄漏内部细节（栈/SQL 等只进日志）
    if (status >= 500) return 'Internal error';
    if (exception instanceof HttpException) {
      const resp = exception.getResponse();
      if (typeof resp === 'string') return resp;
      if (typeof resp === 'object' && resp !== null && 'message' in resp) {
        const m = (resp as { message: unknown }).message;
        if (typeof m === 'string') return m;
        if (Array.isArray(m)) return 'Validation failed';
      }
      return exception.message;
    }
    return 'Request failed';
  }
}
