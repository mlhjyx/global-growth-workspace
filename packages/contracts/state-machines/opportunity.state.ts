/**
 * Opportunity 状态机（母本 11.9）
 *
 * 基线（母本 11.9）：NEW -> QUALIFIED -> MEETING/SAMPLE_DEMO -> PROPOSAL -> WON/LOST
 * 评审补丁（来源 ENG-017 / ANA-014）：
 *   - 补 WITHDRAWN（撤回）：机会不再符合条件、重复合并（merged_into_id）或数据纠错时撤回；
 *     ENG-017 验收「不允许只靠用户点击接受永久计为有效结果」。
 *   - 补 DOWNGRADED（降级）：SAO 降回 Qualified Lead 层级，可在重新符合条件后回到 QUALIFIED。
 *   - WON/LOST 不再是绝对终态：WON 可撤回/降级、LOST 可因合并纠错撤回（ANA-014
 *     「虚假或失效机会不会继续充当成功指标」，历史报表重算或标记版本）。
 * 同文件附 ENG-016 三级结果链 qualification_status 状态机（QUALIFIED_LEAD ->
 * SALES_ACCEPTED -> VERIFIED），其 7/30/90 天验证回写由 Temporal 定时工作流驱动（母本 9.8）。
 *
 * 枚举取值与 json-schema/opportunity/opportunity.schema.json 完全一致。
 * 负责域：opportunity。schema_version: 1。受保护路径：改动走 plan mode 审批。
 */

export const OPPORTUNITY_STAGES = [
  'NEW',
  'QUALIFIED',
  'MEETING',
  'SAMPLE_DEMO',
  'PROPOSAL',
  'WON',
  'LOST',
  'WITHDRAWN',
  'DOWNGRADED',
] as const;

export type OpportunityStage = (typeof OPPORTUNITY_STAGES)[number];

/**
 * 显式转移表（母本 11.9 + ENG-017/ANA-014 评审补丁）。
 * MEETING 与 SAMPLE_DEMO 为并列可互达阶段（母本 11.9「MEETING/SAMPLE/DEMO」；ENG-008 行业 Pack 可定义阶段映射）。
 */
export const TRANSITIONS: Record<OpportunityStage, OpportunityStage[]> = {
  NEW: ['QUALIFIED', 'LOST', 'WITHDRAWN'],
  QUALIFIED: ['MEETING', 'SAMPLE_DEMO', 'PROPOSAL', 'LOST', 'WITHDRAWN', 'DOWNGRADED'],
  MEETING: ['SAMPLE_DEMO', 'PROPOSAL', 'LOST', 'WITHDRAWN', 'DOWNGRADED'],
  SAMPLE_DEMO: ['MEETING', 'PROPOSAL', 'LOST', 'WITHDRAWN', 'DOWNGRADED'],
  PROPOSAL: ['WON', 'LOST', 'WITHDRAWN', 'DOWNGRADED'],
  // ENG-017 评审补丁：WON 后不再符合条件时可撤回或降级（如合同回退、验证失败）
  WON: ['WITHDRAWN', 'DOWNGRADED'],
  // ANA-014 评审补丁：LOST 机会在重复合并/结果纠错时可撤回
  LOST: ['WITHDRAWN'],
  WITHDRAWN: [],
  // ENG-017 评审补丁：降级机会重新符合条件后可回到 QUALIFIED；重复合并可撤回
  DOWNGRADED: ['QUALIFIED', 'WITHDRAWN'],
};

/**
 * 转移触发事件映射（事件契约见 asyncapi/opportunity.events.yaml，母本 11.11）。
 * 键格式 "<from>-><to>"。
 */
export const TRANSITION_EVENTS: Partial<Record<`${OpportunityStage}->${OpportunityStage}`, string>> = {
  'NEW->QUALIFIED': 'OpportunityStageChanged',
  'NEW->LOST': 'OpportunityStageChanged',
  'NEW->WITHDRAWN': 'SAOWithdrawn',
  'QUALIFIED->MEETING': 'OpportunityStageChanged',
  'QUALIFIED->SAMPLE_DEMO': 'OpportunityStageChanged',
  'QUALIFIED->PROPOSAL': 'OpportunityStageChanged',
  'QUALIFIED->LOST': 'OpportunityStageChanged',
  'QUALIFIED->WITHDRAWN': 'SAOWithdrawn',
  'QUALIFIED->DOWNGRADED': 'SAODowngraded',
  'MEETING->SAMPLE_DEMO': 'OpportunityStageChanged',
  'MEETING->PROPOSAL': 'OpportunityStageChanged',
  'MEETING->LOST': 'OpportunityStageChanged',
  'MEETING->WITHDRAWN': 'SAOWithdrawn',
  'MEETING->DOWNGRADED': 'SAODowngraded',
  'SAMPLE_DEMO->MEETING': 'OpportunityStageChanged',
  'SAMPLE_DEMO->PROPOSAL': 'OpportunityStageChanged',
  'SAMPLE_DEMO->LOST': 'OpportunityStageChanged',
  'SAMPLE_DEMO->WITHDRAWN': 'SAOWithdrawn',
  'SAMPLE_DEMO->DOWNGRADED': 'SAODowngraded',
  'PROPOSAL->WON': 'OpportunityStageChanged',
  'PROPOSAL->LOST': 'OpportunityStageChanged',
  'PROPOSAL->WITHDRAWN': 'SAOWithdrawn',
  'PROPOSAL->DOWNGRADED': 'SAODowngraded',
  'WON->WITHDRAWN': 'SAOWithdrawn',
  'WON->DOWNGRADED': 'SAODowngraded',
  'LOST->WITHDRAWN': 'SAOWithdrawn',
  'DOWNGRADED->QUALIFIED': 'OpportunityStageChanged',
  'DOWNGRADED->WITHDRAWN': 'SAOWithdrawn',
};

/**
 * ENG-016 三级结果链（北极星）：Qualified Lead -> Sales Accepted Opportunity ->
 * Verified Commercial Outcome（附录 G 术语表；ANA-013 分别统计并展示 7/30/90 天滞后转化）。
 */
export const QUALIFICATION_STATUSES = [
  'QUALIFIED_LEAD',
  'SALES_ACCEPTED',
  'VERIFIED',
] as const;

export type QualificationStatus = (typeof QUALIFICATION_STATUSES)[number];

/**
 * 三级结果链转移表（ENG-016 基线 + ENG-017/ANA-014 评审补丁的回落转移）。
 * - SALES_ACCEPTED -> QUALIFIED_LEAD：SAO 降级（SAODowngraded）或撤回（SAOWithdrawn，
 *   同时 stage -> WITHDRAWN，机会退出结果链计数）。
 * - VERIFIED -> SALES_ACCEPTED：结果被撤销纠错（OutcomeRevoked，ANA-014）。
 */
export const QUALIFICATION_TRANSITIONS: Record<QualificationStatus, QualificationStatus[]> = {
  QUALIFIED_LEAD: ['SALES_ACCEPTED'],
  SALES_ACCEPTED: ['VERIFIED', 'QUALIFIED_LEAD'],
  VERIFIED: ['SALES_ACCEPTED'],
};

export const QUALIFICATION_TRANSITION_EVENTS: Partial<
  Record<`${QualificationStatus}->${QualificationStatus}`, string>
> = {
  'QUALIFIED_LEAD->SALES_ACCEPTED': 'SAOAccepted',
  // OutcomeVerified 由 Temporal 7/30/90 天回写工作流或人工验证触发（母本 9.8、ENG-017）
  'SALES_ACCEPTED->VERIFIED': 'OutcomeVerified',
  // 降级 SAODowngraded；撤回 SAOWithdrawn 同样使 qualification 回落并使 stage=WITHDRAWN
  'SALES_ACCEPTED->QUALIFIED_LEAD': 'SAODowngraded',
  'VERIFIED->SALES_ACCEPTED': 'OutcomeRevoked',
};
