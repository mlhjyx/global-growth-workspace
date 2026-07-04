// 非生产 demo 端点：给幂等/校验横切能力提供真实可测的落点（不属业务；仅 local/ci 注册）。
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class EchoDto {
  @IsString()
  @MinLength(1)
  message!: string;

  // 第二字段仅用于键序无关指纹（canonical JSON）的 e2e 断言
  @IsOptional()
  @IsString()
  tag?: string;
}

let counter = 0;

@Controller('_demo')
export class DemoController {
  @Post('echo')
  @HttpCode(200)
  echo(@Body() dto: EchoDto) {
    counter += 1;
    return { echoed: dto.message, execution_seq: counter };
  }
}
