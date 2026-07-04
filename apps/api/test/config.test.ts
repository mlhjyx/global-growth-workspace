// BE-02 冒烟 #8：Config 校验单元测试——占位密钥拒绝、Dev IdP 环境栅栏、非法端口。
import { describe, expect, it } from 'vitest';
import { ConfigValidationError, loadConfig } from '../src/infrastructure/config/config';

const base = { NODE_ENV: 'test' } as NodeJS.ProcessEnv;

describe('Config 启动校验', () => {
  it('默认值通过（骨架期无必填密钥）', () => {
    const cfg = loadConfig(base);
    expect(cfg.PORT).toBe(3001);
    expect(cfg.APP_ENV).toBe('local');
    expect(cfg.OTEL_ENABLED).toBe(false);
  });

  it('占位值密钥被拒（前缀命中）', () => {
    expect(() => loadConfig({ ...base, JWT_SECRET: 'changeme-1234567890' })).toThrow(
      ConfigValidationError,
    );
    expect(() => loadConfig({ ...base, JWT_SECRET: 'your_secret_key_here' })).toThrow(
      ConfigValidationError,
    );
    expect(() => loadConfig({ ...base, JWT_SECRET: '<fill-me-in-please>' })).toThrow(
      ConfigValidationError,
    );
  });

  it('短密钥被拒（<16 字符）', () => {
    expect(() => loadConfig({ ...base, JWT_SECRET: 'short' })).toThrow(ConfigValidationError);
  });

  it('合法密钥通过', () => {
    const cfg = loadConfig({ ...base, JWT_SECRET: 'k9f2m8x1q7w4e6r3t5y0' });
    expect(cfg.JWT_SECRET).toBeTruthy();
  });

  it('Dev IdP 环境栅栏：staging/production 拒绝启动（§6.3）', () => {
    expect(() => loadConfig({ ...base, AUTH_PROVIDER: 'dev', APP_ENV: 'production' })).toThrow(
      /Dev IdP/,
    );
    expect(() => loadConfig({ ...base, AUTH_PROVIDER: 'dev', APP_ENV: 'staging' })).toThrow(
      ConfigValidationError,
    );
    // external IdP 在 production 合法
    expect(() =>
      loadConfig({ ...base, AUTH_PROVIDER: 'external', APP_ENV: 'production' }),
    ).not.toThrow();
  });

  it('非法端口被拒且错误信息含字段路径', () => {
    try {
      loadConfig({ ...base, PORT: '99999' });
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(ConfigValidationError);
      expect((e as ConfigValidationError).issues.some((i) => i.path === 'PORT')).toBe(true);
    }
  });
});
