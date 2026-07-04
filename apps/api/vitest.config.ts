import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    // Nest DI 依赖 emitDecoratorMetadata；esbuild 不产出 metadata，
    // 骨架期规避方式：注入一律用显式 @Inject(token)，不靠构造参数类型反射（见 README 约定）。
  },
});
