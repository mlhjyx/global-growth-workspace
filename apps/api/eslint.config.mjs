// ESLint 边界规则（EPIC-FOUNDATION §0.3 规则 1-3，机器可判定部分；规则 4/5 由运行时测试/评审承接）
// 规则 1：分层单向 modules → infrastructure → common，反向 import 即 CI 失败
// 规则 2：modules/* 之间禁止互相 import（跨 Context 只允许契约 DTO + ID + Outbox 事件）
//   —— 1/2 用 import/no-restricted-paths（按解析后真实路径判定，相对导入也拦得住）
// 规则 3：厂商/Provider SDK denylist（硬边界 2/ADR-007）——denylist 在此维护，新增依赖走 lockfile 审查
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';

const CONTEXTS = ['workspace', 'knowledge', 'lead', 'campaign', 'opportunity'];

const VENDOR_SDK_DENYLIST = [
  // 模型厂商 SDK：一律经 Model Gateway Contract（ADR-007）
  { name: 'openai', message: '禁止直连模型厂商 SDK，经 Model Gateway Contract（ADR-007）' },
  {
    name: '@anthropic-ai/sdk',
    message: '禁止直连模型厂商 SDK，经 Model Gateway Contract（ADR-007）',
  },
  {
    name: '@google/generative-ai',
    message: '禁止直连模型厂商 SDK，经 Model Gateway Contract（ADR-007）',
  },
  { name: 'cohere-ai', message: '禁止直连模型厂商 SDK，经 Model Gateway Contract（ADR-007）' },
];

const VENDOR_SDK_PATTERNS = [
  {
    group: ['@aws-sdk/*', '@sendgrid/*', 'stripe'],
    message: '禁止业务代码直连 Provider SDK（硬边界 2），经 Adapter/Contract 接入',
  },
];

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { paths: VENDOR_SDK_DENYLIST, patterns: VENDOR_SDK_PATTERNS },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    },
  },
  {
    // 规则 1/2：解析路径级分区（相对导入也按真实落点判定）
    files: ['src/**/*.ts'],
    plugins: { import: importPlugin },
    settings: {
      // 默认 node 解析器不认 .ts —— 不加这行整套 zone 规则会静默失效（已用探针验证）
      'import/resolver': { node: { extensions: ['.ts', '.js'] } },
    },
    rules: {
      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/common',
              from: './src/infrastructure',
              message: '分层违规：common 不得依赖 infrastructure（§0.3 规则 1）',
            },
            {
              target: './src/common',
              from: './src/modules',
              message: '分层违规：common 不得依赖 modules（§0.3 规则 1）',
            },
            {
              target: './src/infrastructure',
              from: './src/modules',
              message: '分层违规：infrastructure 不得依赖 modules（§0.3 规则 1）',
            },
            ...CONTEXTS.map((ctx) => ({
              target: `./src/modules/${ctx}`,
              from: './src/modules',
              except: [`./${ctx}`],
              message: `跨 Context 违规：modules/${ctx} 不得 import 其他 Context 内部（§0.3 规则 2，只允许契约 DTO/ID/事件）`,
            })),
          ],
        },
      ],
    },
  },
);
