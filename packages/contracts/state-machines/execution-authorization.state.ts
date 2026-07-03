/**
 * ExecutionAuthorization 状态机
 *
 * 来源：母本 11.9 未列此状态机，按 CAM-008（不可变授权：固化范围/模板/频率/预算/阈值/有效期，
 * 执行服务只接受有效授权）与 WSP-007（Workspace Kill Switch / Campaign Pause，停止后未开始任务
 * 不再执行、已执行项保留审计）评审补充；另依据母本 5.9（批准后生成不可变 ExecutionAuthorization，
 * 超出边界的动作重新审批）、5.10.1（授权过期触发自动暂停）、CAM-006（重大变更重新授权 → 旧授权
 * 被替代）。
 * 负责域：campaign；schema_version=1。
 * 状态取值与 json-schema/campaign/execution-authorization.schema.json 的 status 枚举完全一致。
 *
 * 语义：
 * - ISSUED：已签发但未到 valid_from；执行服务不接受。
 * - ACTIVE：valid_from ≤ now < valid_until；执行服务唯一接受的状态（CAM-008 验收）。
 * - EXPIRED：到达 valid_until，系统定时器迁移；触发 Campaign 自动暂停（母本 5.10.1）。终态。
 * - REVOKED：人工撤销或 Kill Switch（WSP-007）；未开始任务不再执行。终态。
 * - SUPERSEDED：被新授权替代（CampaignRevision 重新授权，CAM-006）。终态。
 * - 授权对象本身不可变：状态迁移只改 status/revoked_*/superseded_by_id 生命周期字段，
 *   不修改任何已固化边界（CAM-008）。
 */

export type ExecutionAuthorizationState =
  | 'ISSUED'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'REVOKED'
  | 'SUPERSEDED';

export const EXECUTION_AUTHORIZATION_STATES: readonly ExecutionAuthorizationState[] = [
  'ISSUED',
  'ACTIVE',
  'EXPIRED',
  'REVOKED',
  'SUPERSEDED',
] as const;

/** 初始状态：审批通过即签发（母本 5.9）。 */
export const EXECUTION_AUTHORIZATION_INITIAL_STATE: ExecutionAuthorizationState = 'ISSUED';

/** 终态：授权失效后不可复活，只能签发新授权（CAM-008 不可变性）。 */
export const EXECUTION_AUTHORIZATION_TERMINAL_STATES: readonly ExecutionAuthorizationState[] = [
  'EXPIRED',
  'REVOKED',
  'SUPERSEDED',
] as const;

/**
 * 显式转移表。
 * - ISSUED→ACTIVE：到达 valid_from（系统定时器）。
 * - ISSUED→EXPIRED：签发后从未激活即到达 valid_until（边界场景）。
 * - ISSUED/ACTIVE→REVOKED：人工撤销 / Workspace Kill Switch（WSP-007）。
 * - ISSUED/ACTIVE→SUPERSEDED：新授权签发替代（CAM-006 重新授权）。
 * - ACTIVE→EXPIRED：到达 valid_until（母本 5.10.1 自动暂停）。
 */
export const TRANSITIONS: Record<ExecutionAuthorizationState, ExecutionAuthorizationState[]> = {
  ISSUED: ['ACTIVE', 'EXPIRED', 'REVOKED', 'SUPERSEDED'],
  ACTIVE: ['EXPIRED', 'REVOKED', 'SUPERSEDED'],
  EXPIRED: [],
  REVOKED: [],
  SUPERSEDED: [],
};

/** 授权相关领域事件名（asyncapi/campaign.events.yaml；AuthorizationIssued 见母本 11.11，Revoked/Expired 为评审补充）。 */
export type ExecutionAuthorizationEventType =
  | 'AuthorizationIssued'
  | 'AuthorizationRevoked'
  | 'AuthorizationExpired';

/** 进入初始状态（ISSUED）时发布的事件。 */
export const EXECUTION_AUTHORIZATION_CREATION_EVENT: ExecutionAuthorizationEventType =
  'AuthorizationIssued';

/**
 * 迁移 → 领域事件映射。
 * ISSUED→ACTIVE 为定时器域内迁移，仅审计不发事件；
 * →SUPERSEDED 由新授权的 AuthorizationIssued（payload.supersedes_authorization_id）表达因果，
 * 不再重复发事件（母本 ADR-009 消费者幂等 + conventions：payload 放 ID 与变更要点）。
 */
export const TRANSITION_EVENTS: Partial<
  Record<
    `${ExecutionAuthorizationState}->${ExecutionAuthorizationState}`,
    ExecutionAuthorizationEventType
  >
> = {
  'ISSUED->REVOKED': 'AuthorizationRevoked',
  'ACTIVE->REVOKED': 'AuthorizationRevoked',
  'ISSUED->EXPIRED': 'AuthorizationExpired',
  'ACTIVE->EXPIRED': 'AuthorizationExpired',
};

/** 迁移合法性判断。 */
export function canTransition(
  from: ExecutionAuthorizationState,
  to: ExecutionAuthorizationState,
): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

/** 执行服务准入判断（CAM-008：执行服务只接受有效授权）。 */
export function isExecutable(
  state: ExecutionAuthorizationState,
  now: Date,
  validFrom: Date,
  validUntil: Date,
): boolean {
  return state === 'ACTIVE' && now >= validFrom && now < validUntil;
}
