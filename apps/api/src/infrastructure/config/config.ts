// Config 启动校验（BE-02 冒烟 #8）：缺失/占位值密钥 → 启动失败（非 0 退出），指明缺失项。
// Dev IdP 环境栅栏（EPIC-FOUNDATION §6.3 预落）：AUTH_PROVIDER=dev 禁入 staging/production。
import { z } from 'zod';

// 前缀命中即拒（changeme-xxx、your_secret_key 之类都算占位）；含 <> 视为模板未填
const PLACEHOLDER_PATTERN =
  /^(changeme|change_me|placeholder|xxx|todo|dummy|example|secret|password|your[-_])/i;

const secretString = (name: string) =>
  z
    .string()
    .min(16, `${name} 至少 16 字符`)
    .refine((v) => !PLACEHOLDER_PATTERN.test(v) && !v.includes('<'), `${name} 是占位值，拒绝启动`);

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    APP_ENV: z.enum(['local', 'ci', 'staging', 'production']).default('local'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3001),
    OTEL_ENABLED: z
      .string()
      .default('false')
      .transform((v) => v === 'true' || v === '1'),
    AUTH_PROVIDER: z.enum(['dev', 'external']).default('dev'),
    // 骨架期无必填密钥；提供即校验。BE-04 起 JWT_SECRET 在非 local/ci 转必填。
    JWT_SECRET: secretString('JWT_SECRET').optional(),
    DATABASE_URL: z.string().url().optional(),
  })
  .superRefine((cfg, ctx) => {
    if (
      cfg.AUTH_PROVIDER === 'dev' &&
      (cfg.APP_ENV === 'staging' || cfg.APP_ENV === 'production')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['AUTH_PROVIDER'],
        message: 'Dev IdP 仅允许 local/ci 环境（EPIC-FOUNDATION §6.3），拒绝启动',
      });
    }
  });

export type AppConfig = z.infer<typeof schema>;

export class ConfigValidationError extends Error {
  constructor(public readonly issues: { path: string; message: string }[]) {
    super(`config validation failed: ${issues.map((i) => `${i.path}: ${i.message}`).join('; ')}`);
    this.name = 'ConfigValidationError';
  }
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const result = schema.safeParse(env);
  if (!result.success) {
    throw new ConfigValidationError(
      result.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    );
  }
  return result.data;
}
