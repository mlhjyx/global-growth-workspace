/**
 * Lead 状态机
 *
 * 母本 11.9：DISCOVERED -> ENRICHING -> REVIEW -> QUALIFIED/REJECTED/SUPPRESSED -> CONTACTED -> CONVERTED
 * 负责域：lead；schema_version: 1；需求：LED-005..009（母本 7.5）
 *
 * 扩展说明（conventions.md：扩展必须注明来源）：
 * - 任一非终态 -> SUPPRESSED：全局 Suppression 优先阻断（母本 4.5.5「已退订、投诉或被标记禁止联系的对象全局抑制」、
 *   LED-007 验收「模型不能覆盖硬性排除和 Suppression」、母本 4117「全局 Suppression 优先阻断」）。
 * - REJECTED / SUPPRESSED / CONVERTED 为终态：被拒绝或失效的线索保留历史但不进入发送队列（母本 7.5.4 验收）。
 *
 * 枚举取值与 json-schema/lead/lead.schema.json 的 status 完全一致。
 */

export type LeadState =
  | 'DISCOVERED'
  | 'ENRICHING'
  | 'REVIEW'
  | 'QUALIFIED'
  | 'REJECTED'
  | 'SUPPRESSED'
  | 'CONTACTED'
  | 'CONVERTED';

export const LEAD_STATES: readonly LeadState[] = [
  'DISCOVERED',
  'ENRICHING',
  'REVIEW',
  'QUALIFIED',
  'REJECTED',
  'SUPPRESSED',
  'CONTACTED',
  'CONVERTED',
] as const;

export const LEAD_INITIAL_STATE: LeadState = 'DISCOVERED';

/** 显式转移表：key=当前状态，value=允许进入的状态 */
export const LEAD_TRANSITIONS: Record<LeadState, LeadState[]> = {
  DISCOVERED: ['ENRICHING', 'SUPPRESSED'],
  ENRICHING: ['REVIEW', 'SUPPRESSED'],
  REVIEW: ['QUALIFIED', 'REJECTED', 'SUPPRESSED'],
  QUALIFIED: ['CONTACTED', 'SUPPRESSED'],
  REJECTED: [],
  SUPPRESSED: [],
  CONTACTED: ['CONVERTED', 'SUPPRESSED'],
  CONVERTED: [],
};

/**
 * 转移 -> 触发事件名映射（PascalCase，母本 11.11；lead 域事件定义见 asyncapi/lead.events.yaml）。
 * 值为 null 的转移是内部处理步骤，不发跨域事件。
 * OutboundSent / OpportunityAccepted 分别由 outreach / opportunity 域拥有，此处仅作为触发引用，不在 lead 域重复定义。
 */
export const LEAD_TRANSITION_EVENTS: Record<string, string | null> = {
  'DISCOVERED->ENRICHING': null, // 内部补全流程启动（母本 5.6.1 处理链）
  'DISCOVERED->SUPPRESSED': 'SuppressionApplied',
  'ENRICHING->REVIEW': null, // 补全完成进入人工/规则审查
  'ENRICHING->SUPPRESSED': 'SuppressionApplied',
  'REVIEW->QUALIFIED': 'LeadQualified', // LED-009 ACCEPTED 决策
  'REVIEW->REJECTED': 'LeadRejected', // LED-009 REJECTED 决策
  'REVIEW->SUPPRESSED': 'SuppressionApplied',
  'QUALIFIED->CONTACTED': 'OutboundSent', // outreach 域事件（母本 11.11）
  'QUALIFIED->SUPPRESSED': 'SuppressionApplied',
  'CONTACTED->CONVERTED': 'OpportunityAccepted', // opportunity 域事件（母本 11.11）
  'CONTACTED->SUPPRESSED': 'SuppressionApplied',
};

/** 进入状态时由 lead 域发布的事件（入口事件） */
export const LEAD_STATE_ENTRY_EVENTS: Partial<Record<LeadState, string>> = {
  DISCOVERED: 'LeadDiscovered',
  QUALIFIED: 'LeadQualified',
  REJECTED: 'LeadRejected',
  SUPPRESSED: 'SuppressionApplied',
};

export function canTransitionLead(from: LeadState, to: LeadState): boolean {
  return LEAD_TRANSITIONS[from]?.includes(to) ?? false;
}
