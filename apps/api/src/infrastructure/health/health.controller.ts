// health/readiness（BE-02 冒烟 #1/#2）：不带 /api/v1 前缀（§5.1 冻结口径——探针属
// LB/编排面，不随 API 版本演进；create-app 的 setGlobalPrefix exclude 承接）。
// readiness 的 checks 骨架期为空对象占位，BE-03 起接 DB ping、BE-05 起接 DLQ 深度（§5.7）。
import { Controller, Get } from '@nestjs/common';

const startedAt = Date.now();

@Controller()
export class HealthController {
  @Get('health')
  health() {
    return {
      status: 'ok',
      uptime_s: Math.round((Date.now() - startedAt) / 1000),
    };
  }

  @Get('readiness')
  readiness() {
    return {
      status: 'ready',
      checks: {},
    };
  }
}
