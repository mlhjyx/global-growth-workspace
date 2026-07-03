/**
 * CommercialOutcome 验证状态机
 *
 * 来源：ENG-017/ANA-013/ANA-014 评审补丁——母本 11.9 未列 CommercialOutcome 状态机，
 * 评审发现北极星三级结果链后段断链（Opportunity 止于 WON/LOST、无 Outcome 验证生命周期），
 * 本文件补齐：PENDING -> VERIFIED / EXPIRED / REVOKED。
 *
 * - PENDING：结果已回写待验证（ENG-017：对 SAO 在 7/30/90 天回写会议/样品/报价/合同/Won/Lost）。
 * - VERIFIED：证据确认（附录 G：Verified Commercial Outcome；ENG-016 验收：证据均可审计）。
 * - EXPIRED：7/30/90 天窗口到期仍未验证，由 Temporal 定时工作流置位（母本 9.8 Durable Workflow，
 *   补母本用例；ENG-017 验收：不允许只靠用户点击接受永久计为有效结果）。
 * - REVOKED：撤销/纠错（ANA-014：结果纠错并对历史报表重算或标记版本）。
 *
 * 枚举取值与 json-schema/opportunity/commercial-outcome.schema.json verification_status 完全一致。
 * 负责域：opportunity。schema_version: 1。受保护路径：改动走 plan mode 审批。
 */

export const COMMERCIAL_OUTCOME_STATES = [
  'PENDING',
  'VERIFIED',
  'EXPIRED',
  'REVOKED',
] as const;

export type CommercialOutcomeState = (typeof COMMERCIAL_OUTCOME_STATES)[number];

/**
 * 显式转移表。VERIFIED -> REVOKED 为 ANA-014 纠错补丁（已验证结果发现虚假/失效时撤销）。
 * EXPIRED 与 REVOKED 为终态。
 */
export const TRANSITIONS: Record<CommercialOutcomeState, CommercialOutcomeState[]> = {
  PENDING: ['VERIFIED', 'EXPIRED', 'REVOKED'],
  VERIFIED: ['REVOKED'],
  EXPIRED: [],
  REVOKED: [],
};

/**
 * 转移触发事件映射（事件契约见 asyncapi/opportunity.events.yaml，母本 11.11）。
 */
export const TRANSITION_EVENTS: Partial<
  Record<`${CommercialOutcomeState}->${CommercialOutcomeState}`, string>
> = {
  'PENDING->VERIFIED': 'OutcomeVerified',
  // 由 Temporal 7/30/90 天定时工作流在窗口到期时触发（母本 9.8）
  'PENDING->EXPIRED': 'OutcomeExpired',
  'PENDING->REVOKED': 'OutcomeRevoked',
  // ANA-014 纠错补丁
  'VERIFIED->REVOKED': 'OutcomeRevoked',
};
