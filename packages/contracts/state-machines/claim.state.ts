/**
 * Claim 状态机（母本 11.9、KNW-003；负责域：knowledge；schema_version=1）
 *
 * 母本 11.9 原文：
 *   INGESTED -> EXTRACTED -> NEEDS_REVIEW -> APPROVED -> EXPIRED / REVOKED
 *
 * 扩展说明（conventions.md 要求在文件头注明来源）：
 * - NEEDS_REVIEW -> REVOKED：母本 4.8.5「可查看和撤销每条 Claim」——评审拒绝/来源删除
 *   （KNW-007 级联失效）时允许在审核阶段直接撤销，不强制先批准。
 * - EXPIRED / REVOKED 为终态：重新抓取或续期产生新 Claim 并用
 *   superseded_by_claim_id 关联（KNW-004 版本比较、KNW-009 重新抓取），不复活旧记录。
 *
 * 取值必须与 json-schema/knowledge/claim.schema.json 的 status 枚举完全一致。
 * 本文件为受保护路径：改动 = 业务规则变更，走 plan mode 审批。
 */

export const CLAIM_STATES = [
  'INGESTED',
  'EXTRACTED',
  'NEEDS_REVIEW',
  'APPROVED',
  'EXPIRED',
  'REVOKED',
] as const;

export type ClaimState = (typeof CLAIM_STATES)[number];

/**
 * 显式转移表：仅表中列出的转移合法（KNW-003）。
 * 对外生成只允许使用适用范围内的 APPROVED Claim（KNW-003 验收）。
 */
export const CLAIM_TRANSITIONS: Record<ClaimState, ClaimState[]> = {
  INGESTED: ['EXTRACTED'],
  EXTRACTED: ['NEEDS_REVIEW'],
  NEEDS_REVIEW: ['APPROVED', 'REVOKED'],
  APPROVED: ['EXPIRED', 'REVOKED'],
  EXPIRED: [],
  REVOKED: [],
};

export type ClaimTransition = `${ClaimState}->${ClaimState}`;

/**
 * 转移 -> 领域事件映射（事件定义见 asyncapi/knowledge.events.yaml，母本 11.11）。
 * 值为 null 的转移是摄取管线内部步骤，不发布跨域业务事件
 * （来源解析完成统一由 KnowledgeSourceIndexed 表达，KNW-001）。
 */
export const CLAIM_TRANSITION_EVENTS: Record<ClaimTransition, string | null> = {
  'INGESTED->EXTRACTED': null,
  'EXTRACTED->NEEDS_REVIEW': null,
  'NEEDS_REVIEW->APPROVED': 'ClaimApproved',
  'NEEDS_REVIEW->REVOKED': 'ClaimRevoked',
  'APPROVED->EXPIRED': 'ClaimExpired',
  'APPROVED->REVOKED': 'ClaimRevoked',
} as Record<ClaimTransition, string | null>;

/** 终态集合：进入后不再转移，续期/重抓走新 Claim（KNW-009）。 */
export const CLAIM_TERMINAL_STATES: readonly ClaimState[] = ['EXPIRED', 'REVOKED'];

/** 校验一次状态转移是否合法。 */
export function canTransitionClaim(from: ClaimState, to: ClaimState): boolean {
  return CLAIM_TRANSITIONS[from].includes(to);
}
