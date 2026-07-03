/**
 * Redaction 钩子：发给 Provider 前对入参文本脱敏（母本 9.10：Trace 写入前敏感字段脱敏/摘要化；
 * task-contract.md 2.2 数据范围）。
 *
 * Spike 演示 = email / 电话正则脱敏。生产实现须升级为字段感知策略
 * （按 Canonical 字段 privacy_classification / allowed_actions 决定，DAT-005/006），
 * 正则兜底只是最后一道防线。
 */
import type { RedactionSummary } from './contract.js';

export interface RedactionResult {
  text: string;
  redactions: RedactionSummary[];
}

export type RedactionHook = (text: string) => RedactionResult;

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
// 连续数字/常见分隔符、总位数 >= 7 才视为电话，避免误伤普通小数字
const PHONE_CANDIDATE_RE = /\+?\d[\d\s\-().]{5,}\d/g;

function digitCount(s: string): number {
  return (s.match(/\d/g) ?? []).length;
}

export const defaultRedactionHook: RedactionHook = (text) => {
  let emailCount = 0;
  let phoneCount = 0;

  let out = text.replace(EMAIL_RE, () => {
    emailCount += 1;
    return '[REDACTED_EMAIL]';
  });

  out = out.replace(PHONE_CANDIDATE_RE, (m) => {
    if (digitCount(m) < 7) return m;
    phoneCount += 1;
    return '[REDACTED_PHONE]';
  });

  const redactions: RedactionSummary[] = [];
  if (emailCount > 0) redactions.push({ kind: 'EMAIL', count: emailCount });
  if (phoneCount > 0) redactions.push({ kind: 'PHONE', count: phoneCount });
  return { text: out, redactions };
};
