// GGW API 启动入口（BE-02 骨架）。约定见 EPIC-FOUNDATION §0.2/§5：
// /api/v1 前缀、全局 ValidationPipe、OpenAPI 输出、优雅停机（SIGTERM → 退出码 0）。
import 'reflect-metadata';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/http/http-exception.filter';
import { requestContextMiddleware } from './common/http/request-context.middleware';
import { ConfigValidationError, loadConfig } from './infrastructure/config/config';
import { JsonLogger } from './infrastructure/logging/json-logger';
import { initOtel } from './infrastructure/otel/otel';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: new JsonLogger(),
  });
  app.setGlobalPrefix('api/v1');
  app.use(requestContextMiddleware);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableShutdownHooks();

  const openapi = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('GGW API')
      .setDescription('Global Growth Workspace API（契约事实源在 packages/contracts/openapi）')
      .setVersion('v1')
      .build(),
  );
  SwaggerModule.setup('api/v1/openapi', app, openapi, {
    jsonDocumentUrl: 'api/v1/openapi.json',
  });

  return app;
}

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
  const app = await createApp();
  await app.listen(config.PORT, '127.0.0.1');
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ level: 'info', msg: 'api started', port: config.PORT }));
}

if (require.main === module) {
  void bootstrap();
}
