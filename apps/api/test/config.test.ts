// BE-02 冒烟 #8：Config 校验单元测试——占位密钥拒绝、Dev IdP 环境栅栏、非法端口、
// production 缺 APP_ENV fail-closed、组装期环境判定。
import { describe, expect, it } from 'vitest';
import {
  ConfigValidationError,
  isDevToolingEnv,
  loadConfig,
  resolveComposedAppEnv,
} from '../src/infrastructure/config/config';

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
    // 测试值刻意可读非真密钥（gitleaks 低熵不误报），且不落占位前缀 denylist
    const cfg = loadConfig({ ...base, JWT_SECRET: 'unit-test-value-not-real-0001' });
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

  it('NODE_ENV=production 且未显式设 APP_ENV：拒绝启动（fail-closed，3522684845）', () => {
    expect(() =>
      loadConfig({ NODE_ENV: 'production', AUTH_PROVIDER: 'external' } as NodeJS.ProcessEnv),
    ).toThrow(/APP_ENV/);
    // 显式 APP_ENV=production + external IdP 才是合法生产组合
    expect(() =>
      loadConfig({
        NODE_ENV: 'production',
        APP_ENV: 'production',
        AUTH_PROVIDER: 'external',
      } as NodeJS.ProcessEnv),
    ).not.toThrow();
    // production + 默认 AUTH_PROVIDER=dev 依然被 Dev IdP 栅栏拦截
    expect(() =>
      loadConfig({ NODE_ENV: 'production', APP_ENV: 'production' } as NodeJS.ProcessEnv),
    ).toThrow(/Dev IdP/);
  });
});

describe('组装期环境判定（DemoModule 门禁，3522684839）', () => {
  const env = (e: Record<string, string>) => e as NodeJS.ProcessEnv;

  it('APP_ENV 显式值优先，staging/production 关闭 dev tooling', () => {
    expect(resolveComposedAppEnv(env({ APP_ENV: 'staging' }))).toBe('staging');
    expect(isDevToolingEnv(env({ APP_ENV: 'staging' }))).toBe(false);
    expect(isDevToolingEnv(env({ APP_ENV: 'production', NODE_ENV: 'development' }))).toBe(false);
    expect(isDevToolingEnv(env({ APP_ENV: 'ci' }))).toBe(true);
    expect(isDevToolingEnv(env({ APP_ENV: 'local' }))).toBe(true);
  });

  it('APP_ENV 未设 + NODE_ENV=production：fail-closed 视为 production', () => {
    expect(resolveComposedAppEnv(env({ NODE_ENV: 'production' }))).toBe('production');
    expect(isDevToolingEnv(env({ NODE_ENV: 'production' }))).toBe(false);
  });

  it('两者都未设：本地开发默认 local', () => {
    expect(resolveComposedAppEnv(env({}))).toBe('local');
    expect(isDevToolingEnv(env({}))).toBe(true);
  });

  it('APP_ENV 非法值不采信：回落 NODE_ENV 判定', () => {
    expect(resolveComposedAppEnv(env({ APP_ENV: 'prod', NODE_ENV: 'production' }))).toBe(
      'production',
    );
  });
});
