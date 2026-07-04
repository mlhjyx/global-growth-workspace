import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { IdempotencyInterceptor } from './idempotency.interceptor';
import { IDEMPOTENCY_STORE } from './idempotency.types';
import { MemoryIdempotencyStore } from './memory-idempotency.store';

@Global()
@Module({
  providers: [
    // BE-03 起换成 PG 实现（租户级 + 平台级双存储面），token 与调用面不变
    { provide: IDEMPOTENCY_STORE, useValue: new MemoryIdempotencyStore() },
    { provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor },
  ],
  exports: [IDEMPOTENCY_STORE],
})
export class IdempotencyModule {}
