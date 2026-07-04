// 结构化 JSON 日志（BE-02 冒烟 #7）：每行一个 JSON 对象，零外部依赖。
// M1 后期可换 pino 等实现，调用面（Nest LoggerService）不变。
import type { LoggerService } from '@nestjs/common';

type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

function emit(level: Level, message: unknown, context?: string, extra?: unknown): void {
  const line = JSON.stringify({
    level,
    time: new Date().toISOString(),
    context,
    msg: typeof message === 'string' ? message : JSON.stringify(message),
    ...(extra !== undefined ? { extra } : {}),
  });
  // eslint-disable-next-line no-console
  (level === 'error' || level === 'fatal' ? console.error : console.log)(line);
}

export class JsonLogger implements LoggerService {
  log(message: unknown, context?: string): void {
    emit('info', message, context);
  }
  warn(message: unknown, context?: string): void {
    emit('warn', message, context);
  }
  error(message: unknown, trace?: string, context?: string): void {
    emit('error', message, context, trace);
  }
  debug(message: unknown, context?: string): void {
    emit('debug', message, context);
  }
  verbose(message: unknown, context?: string): void {
    emit('debug', message, context);
  }
  fatal(message: unknown, context?: string): void {
    emit('fatal', message, context);
  }
}
