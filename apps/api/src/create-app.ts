// GGW 应用组装（BE-02 骨架）。约定见 EPIC-FOUNDATION §0.2/§5：
// /api/v1 前缀（health/readiness 探针除外，§5.1）、全局 ValidationPipe、OpenAPI 输出。
// 本文件由 main.ts 在 OTel 初始化之后动态 import——HTTP instrumentation 必须先于
// Nest/Express 模块加载注册，否则入站请求不产 span（PR #25 评论处置 3522684843）。
import 'reflect-metadata';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { accessLogMiddleware, type AccessLogSink } from './common/http/access-log.middleware';
import { GlobalExceptionFilter } from './common/http/http-exception.filter';
import { requestContextMiddleware } from './common/http/request-context.middleware';
import { JsonLogger } from './infrastructure/logging/json-logger';

export interface CreateAppOptions {
  accessLogSink?: AccessLogSink;
}

export async function createApp(options: CreateAppOptions = {}): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: new JsonLogger(),
  });
  // 探针不带版本前缀（§5.1 冻结口径，PR #22 评论处置 #3）：属 LB/编排面，不随 API 版本演进
  app.setGlobalPrefix('api/v1', { exclude: ['health', 'readiness'] });
  app.use(requestContextMiddleware);
  app.use(accessLogMiddleware(options.accessLogSink));
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
