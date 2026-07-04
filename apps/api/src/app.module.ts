// 根模块（BE-02）：只挂 infrastructure 横切模块；业务 modules/* 随 BE-09A..D 逐个启用（§0.2）。
import { Module } from '@nestjs/common';
import { IdempotencyModule } from './common/idempotency/idempotency.module';
import { DemoModule } from './infrastructure/demo/demo.module';
import { isDevToolingEnv } from './infrastructure/config/config';
import { HealthModule } from './infrastructure/health/health.module';

// demo 端点仅 local/ci 注册（横切能力的可测落点，非业务）——门禁以 APP_ENV 为安全边界，
// NODE_ENV 不再单独作判定（staging/production 若漏设 NODE_ENV 也不会暴露 _demo 写端点）
const nonProductionModules = isDevToolingEnv() ? [DemoModule] : [];

@Module({
  imports: [HealthModule, IdempotencyModule, ...nonProductionModules],
})
export class AppModule {}
