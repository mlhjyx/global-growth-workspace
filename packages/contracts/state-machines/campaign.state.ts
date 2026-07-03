/**
 * Campaign 状态机
 *
 * 来源：母本 11.9（Campaign 行）、CAM-005（状态集合与迁移审计）、CAM-009（暂停/恢复/结束/归档）。
 * 负责域：campaign；schema_version=1。
 * 状态取值与 json-schema/campaign/campaign.schema.json 的 status 枚举完全一致。
 *
 * 扩展说明（相对母本 11.9 线性链的迁移表细化，业务依据）：
 * - RESEARCHING→DRAFT / READY_FOR_REVIEW→DRAFT：审批人可以退回具体问题（CAM-007）。
 * - DRAFT/RESEARCHING→ARCHIVED：草稿放弃归档（CAM-009 支持归档）。
 * - SCHEDULED→PAUSED/BLOCKED：暂停可在 SLA 内阻断未开始动作（CAM-009）；
 *   Kill Switch / 授权失效可在开跑前阻断（WSP-007、母本 5.10.1）。
 * - PAUSED/BLOCKED→COMPLETED：暂停或阻断中允许人工结束（CAM-009）。
 * - 母本 11.9 中 PAUSED/BLOCKED 为并列旁路状态：RUNNING 可进入二者，恢复后回 RUNNING。
 */

export type CampaignState =
  | 'DRAFT'
  | 'RESEARCHING'
  | 'READY_FOR_REVIEW'
  | 'APPROVED'
  | 'SCHEDULED'
  | 'RUNNING'
  | 'PAUSED'
  | 'BLOCKED'
  | 'COMPLETED'
  | 'LEARNED'
  | 'ARCHIVED';

export const CAMPAIGN_STATES: readonly CampaignState[] = [
  'DRAFT',
  'RESEARCHING',
  'READY_FOR_REVIEW',
  'APPROVED',
  'SCHEDULED',
  'RUNNING',
  'PAUSED',
  'BLOCKED',
  'COMPLETED',
  'LEARNED',
  'ARCHIVED',
] as const;

/** 初始状态：创建 Campaign（含 Quick Campaign，CAM-012）即进入 DRAFT。 */
export const CAMPAIGN_INITIAL_STATE: CampaignState = 'DRAFT';

/** 终态：不再允许任何迁移。 */
export const CAMPAIGN_TERMINAL_STATES: readonly CampaignState[] = ['ARCHIVED'] as const;

/**
 * 显式转移表（CAM-005：状态迁移有规则和审计）。
 * 服务层守卫（非本表表达）：
 * - READY_FOR_REVIEW 进入前必须具备完整上下文（目标/Offering/Market/受众/预算/时间，CAM-002）。
 * - APPROVED 进入时必须已生成有效 ExecutionAuthorization（CAM-008、母本 5.9）。
 * - RUNNING 期间超硬预算 → 自动停止新任务（CAM-013）；StopCondition 触发 → PAUSED（CAM-010）。
 */
export const TRANSITIONS: Record<CampaignState, CampaignState[]> = {
  DRAFT: ['RESEARCHING', 'ARCHIVED'],
  RESEARCHING: ['READY_FOR_REVIEW', 'DRAFT', 'ARCHIVED'],
  READY_FOR_REVIEW: ['APPROVED', 'DRAFT'],
  APPROVED: ['SCHEDULED'],
  SCHEDULED: ['RUNNING', 'PAUSED', 'BLOCKED'],
  RUNNING: ['PAUSED', 'BLOCKED', 'COMPLETED'],
  PAUSED: ['RUNNING', 'COMPLETED'],
  BLOCKED: ['RUNNING', 'PAUSED', 'COMPLETED'],
  COMPLETED: ['LEARNED'],
  LEARNED: ['ARCHIVED'],
  ARCHIVED: [],
};

/** campaign 域领域事件名（asyncapi/campaign.events.yaml；母本 11.11 Campaign 类别 + 评审补充）。 */
export type CampaignEventType =
  | 'CampaignCreated'
  | 'CampaignApproved'
  | 'CampaignPaused'
  | 'CampaignResumed'
  | 'CampaignCompleted'
  | 'CampaignRevisionCreated'
  | 'StopConditionTriggered';

/** 进入初始状态（DRAFT）时发布的事件。 */
export const CAMPAIGN_CREATION_EVENT: CampaignEventType = 'CampaignCreated';

/**
 * 迁移 → 领域事件映射（仅列 P0 对外发布事件；未列出的迁移仅写审计日志，
 * 不产生跨域事件——如 DRAFT→RESEARCHING、APPROVED→SCHEDULED 为域内编排步骤）。
 * BLOCKED 由系统性阻断（授权过期/平台限制/Kill Switch）进入，对外统一以
 * CampaignPaused（payload.triggered_by 区分）通知，与母本 5.10.1 自动暂停语义一致。
 */
export const TRANSITION_EVENTS: Partial<
  Record<`${CampaignState}->${CampaignState}`, CampaignEventType>
> = {
  'READY_FOR_REVIEW->APPROVED': 'CampaignApproved',
  'SCHEDULED->PAUSED': 'CampaignPaused',
  'SCHEDULED->BLOCKED': 'CampaignPaused',
  'RUNNING->PAUSED': 'CampaignPaused',
  'RUNNING->BLOCKED': 'CampaignPaused',
  'PAUSED->RUNNING': 'CampaignResumed',
  'BLOCKED->RUNNING': 'CampaignResumed',
  'RUNNING->COMPLETED': 'CampaignCompleted',
  'PAUSED->COMPLETED': 'CampaignCompleted',
  'BLOCKED->COMPLETED': 'CampaignCompleted',
};

/** 迁移合法性判断（消费方共用，避免各服务重复实现）。 */
export function canTransition(from: CampaignState, to: CampaignState): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}
