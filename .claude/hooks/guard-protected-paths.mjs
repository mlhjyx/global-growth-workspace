#!/usr/bin/env node
// PreToolUse guard for Write|Edit|MultiEdit.
// - Hard-blocks writing secrets/env files into the repo (exit 2).
// - Warns (non-blocking) when touching protected contract/policy/migration/state paths.
import { readFileSync } from 'node:fs';

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

let payload;
try {
  payload = JSON.parse(readStdin() || '{}');
} catch {
  process.exit(0); // can't parse -> don't block
}

const fp = payload?.tool_input?.file_path;
if (!fp || typeof fp !== 'string') process.exit(0);

const p = fp.replace(/\\/g, '/');

// 1) Hard block: secrets must never enter the repo.
const isEnv = /(^|\/)\.env(\.[^/]+)?$/.test(p) && !/\.env\.example$/.test(p);
const isSecret = /(^|\/)secrets\//.test(p) || /\.(pem|key)$/.test(p);
if (isEnv || isSecret) {
  process.stderr.write(
    `[guard] 拒绝写入密钥/环境文件：${fp}\n` +
      `密钥不得进入仓库。用 .env.example 占位，真实值放本地未追踪的 .env 或密钥库。\n`,
  );
  process.exit(2);
}

// 2) Warn (non-blocking) on protected contract/policy/migration/state paths.
const protectedPatterns = [
  /(^|\/)packages\/contracts\//,
  /(^|\/)packages\/policy\//,
  /\/prisma\/migrations\//,
  /\.state\.ts$/,
];
if (protectedPatterns.some((re) => re.test(p))) {
  process.stderr.write(
    `[guard] 提示：${fp} 属于受保护契约/策略路径。\n` +
      `改动可能是跨域 breaking change：确认已在 plan mode 经 Owner 批准，并会同步更新 ADR、契约测试与消费方。\n`,
  );
}

process.exit(0);
