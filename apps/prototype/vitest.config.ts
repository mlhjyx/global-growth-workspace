// 合并 vite.config：AutoImport 等插件与 define/alias 保持与应用一致
// （路由表等依赖 unplugin-auto-import 注入的 react-router-dom 符号）
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      include: ['test/**/*.test.{ts,tsx}'],
    },
  }),
);
