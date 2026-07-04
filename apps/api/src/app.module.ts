// 根模块（BE-02）：只挂 infrastructure 横切模块；业务 modules/* 随 BE-09A..D 逐个启用（§0.2）。
import { Module } from '@nestjs/common';
import { HealthModule } from './infrastructure/health/health.module';

@Module({
  imports: [HealthModule],
})
export class AppModule {}
