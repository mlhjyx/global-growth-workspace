/**
 * Membership 状态机
 * 负责域：workspace | schema_version: 1
 * 来源：母本 7.1（WSP-002 角色、WSP-004 代理商委派、WSP-009 SCIM 成员生命周期）。
 * 扩展说明：母本 11.9 未列出 Membership 状态机，本文件依据 WSP-002/009
 * 成员邀请-激活-停用-移除生命周期补充。
 * 角色枚举（WSP-002，与 json-schema/workspace/membership.schema.json $defs.role 一致）：
 * OWNER / ADMIN / STRATEGIST / MARKETER / SALES / REVIEWER / EXPERT / VIEWER
 */

export type MembershipState = 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'REMOVED';

export const MEMBERSHIP_TRANSITIONS: Record<MembershipState, MembershipState[]> = {
  INVITED: ['ACTIVE', 'REMOVED'],
  ACTIVE: ['SUSPENDED', 'REMOVED'],
  SUSPENDED: ['ACTIVE', 'REMOVED'],
  REMOVED: [],
};

/**
 * 所有转移统一触发 MembershipChanged 事件，
 * 具体差异由 payload.change_type 表达（INVITED/ACTIVATED/ROLE_CHANGED/SUSPENDED/REACTIVATED/REMOVED）。
 * 定义见 asyncapi/workspace.events.yaml。
 */
export const MEMBERSHIP_TRANSITION_EVENTS: Record<string, string> = {
  'INVITED->ACTIVE': 'MembershipChanged',
  'INVITED->REMOVED': 'MembershipChanged',
  'ACTIVE->SUSPENDED': 'MembershipChanged',
  'ACTIVE->REMOVED': 'MembershipChanged',
  'SUSPENDED->ACTIVE': 'MembershipChanged',
  'SUSPENDED->REMOVED': 'MembershipChanged',
};
