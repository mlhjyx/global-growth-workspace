// GGW API 启动入口（BE-02 骨架）。约定见 EPIC-FOUNDATION §0.2/§5：
// /api/v1 前缀、全局 ValidationPipe、OpenAPI 输出、优雅停机（SIGTERM → 退出码 0）。
import 'reflect-metadata';
import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error'],
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );
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
  const app = await createApp();
  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port, '127.0.0.1');
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ level: 'info', msg: 'api started', port }));
}

if (require.main === module) {
  void bootstrap();
}
