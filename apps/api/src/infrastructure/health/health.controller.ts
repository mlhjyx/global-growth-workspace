// health/readiness（BE-02 冒烟 #1/#2）。readiness 的 checks 骨架期为空对象占位，
// BE-03 起接 DB ping、BE-05 起接 DLQ 深度（EPIC-FOUNDATION §5.7）。
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
