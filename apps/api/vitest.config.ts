import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // esbuild 不产出装饰器 metadata（Nest DI 与 ValidationPipe DTO 校验依赖），测试转换换 SWC
  plugins: [swc.vite({ tsconfigFile: './tsconfig.json' })],
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});
