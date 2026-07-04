// GGW API 启动入口（BE-02 骨架）：只做 Config 校验 → OTel 初始化 → 动态加载应用组装。
// 应用组装在 ./create-app——必须在 initOtel 之后 import，HTTP instrumentation 需先于
// Nest/Express 加载注册（PR #25 评论处置 3522684843）；优雅停机（SIGTERM → 退出码 0）。
import 'reflect-metadata';
import { ConfigValidationError, loadConfig } from './infrastructure/config/config';
import { initOtel } from './infrastructure/otel/otel';

async function bootstrap(): Promise<void> {
  let config;
  try {
    config = loadConfig();
  } catch (e) {
    if (e instanceof ConfigValidationError) {
      // 冒烟 #8：配置无效 → 打出缺失项清单，非 0 退出
      console.error(
        JSON.stringify({ level: 'fatal', msg: 'config validation failed', issues: e.issues }),
      );
      process.exit(1);
    }
    throw e;
  }
  await initOtel(config);
  const { createApp } = await import('./create-app');
  const app = await createApp();
  await app.listen(config.PORT, '127.0.0.1');

  console.log(JSON.stringify({ level: 'info', msg: 'api started', port: config.PORT }));
}

if (require.main === module) {
  void bootstrap();
}
