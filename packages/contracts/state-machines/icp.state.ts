/**
 * ICP 状态机
 *
 * 母本 11.9：DRAFT -> HYPOTHESIS -> VALIDATING -> ACTIVE -> SUPERSEDED -> ARCHIVED
 * 负责域：lead；schema_version: 1；需求：LED-001/003/004（母本 7.5）
 *
 * 扩展说明（conventions.md：扩展必须注明来源）：
 * - VALIDATING -> HYPOTHESIS：回测未通过退回假设（LED-004 验收「未回测 ICP 标记为 Hypothesis」）。
 * - DRAFT/HYPOTHESIS -> ARCHIVED：未投入使用的定义可直接归档（运营需要，不改变 11.9 主链语义）。
 * - ACTIVE -> SUPERSEDED 必须由新版本 ICP 激活（ICPActivated）显式触发：
 *   ICP 重大变更不静默影响运行中的 Campaign（母本 7.5.4 验收）。
 *
 * 枚举取值与 json-schema/lead/icp-definition.schema.json 的 status 完全一致。
 */

export type IcpState = 'DRAFT' | 'HYPOTHESIS' | 'VALIDATING' | 'ACTIVE' | 'SUPERSEDED' | 'ARCHIVED';

export const ICP_STATES: readonly IcpState[] = [
  'DRAFT',
  'HYPOTHESIS',
  'VALIDATING',
  'ACTIVE',
  'SUPERSEDED',
  'ARCHIVED',
] as const;

export const ICP_INITIAL_STATE: IcpState = 'DRAFT';

/** 显式转移表：key=当前状态，value=允许进入的状态 */
export const ICP_TRANSITIONS: Record<IcpState, IcpState[]> = {
  DRAFT: ['HYPOTHESIS', 'ARCHIVED'],
  HYPOTHESIS: ['VALIDATING', 'ARCHIVED'],
  VALIDATING: ['ACTIVE', 'HYPOTHESIS', 'ARCHIVED'],
  ACTIVE: ['SUPERSEDED', 'ARCHIVED'],
  SUPERSEDED: ['ARCHIVED'],
  ARCHIVED: [],
};

/**
 * 转移 -> 触发事件名映射（PascalCase，母本 11.11；lead 域事件定义见 asyncapi/lead.events.yaml）。
 * 值为 null 的转移是内部编辑/评审步骤，不发跨域事件。
 */
export const ICP_TRANSITION_EVENTS: Record<string, string | null> = {
  'DRAFT->HYPOTHESIS': null, // 结构化完成，进入假设（LED-001）
  'DRAFT->ARCHIVED': null,
  'HYPOTHESIS->VALIDATING': null, // 回测开始（LED-004）
  'HYPOTHESIS->ARCHIVED': null,
  'VALIDATING->ACTIVE': 'ICPActivated', // 回测通过并激活；下游 Campaign/查询计划可用（LED-004/005）
  'VALIDATING->HYPOTHESIS': null, // 回测未通过退回（LED-004）
  'VALIDATING->ARCHIVED': null,
  'ACTIVE->SUPERSEDED': 'ICPActivated', // 由新版本 ICP 的激活事件驱动，payload.superseded_icp_id 指向本 ICP（母本 7.5.4）
  'ACTIVE->ARCHIVED': null,
  'SUPERSEDED->ARCHIVED': null,
};

export function canTransitionIcp(from: IcpState, to: IcpState): boolean {
  return ICP_TRANSITIONS[from]?.includes(to) ?? false;
}
