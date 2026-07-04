// 根模块（BE-02）：只挂 infrastructure 横切模块；业务 modules/* 随 BE-09A..D 逐个启用（§0.2）。
import { Module } from '@nestjs/common';
import { IdempotencyModule } from './common/idempotency/idempotency.module';
import { DemoModule } from './infrastructure/demo/demo.module';
import { HealthModule } from './infrastructure/health/health.module';

// demo 端点仅非生产注册（横切能力的可测落点，非业务）
const nonProductionModules = process.env.NODE_ENV === 'production' ? [] : [DemoModule];

@Module({
  imports: [HealthModule, IdempotencyModule, ...nonProductionModules],
})
export class AppModule {}
