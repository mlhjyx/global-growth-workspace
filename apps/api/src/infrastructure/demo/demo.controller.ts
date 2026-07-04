// 非生产 demo 端点：给幂等/校验横切能力提供真实可测的落点（不属业务；production 不注册）。
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';

export class EchoDto {
  @IsString()
  @MinLength(1)
  message!: string;
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
