/**
 * ControlSwitch 状态机（Kill Switch / Campaign Pause / Provider Disable）
 * 负责域：workspace | schema_version: 1
 * 来源：母本 7.1（WSP-007：停止后未开始任务不再执行，已执行项保留审计）。
 * 扩展说明：母本 11.9 未列出 ControlSwitch 状态机，本文件依据 WSP-007 补充。
 */

export type ControlSwitchState = 'ACTIVE' | 'RELEASED';

export type ControlSwitchType = 'KILL_SWITCH' | 'CAMPAIGN_PAUSE' | 'PROVIDER_DISABLE';

export const CONTROL_SWITCH_TRANSITIONS: Record<ControlSwitchState, ControlSwitchState[]> = {
  ACTIVE: ['RELEASED'],
  RELEASED: ['ACTIVE'],
};

/**
 * 触发事件按开关类型区分（见 asyncapi/workspace.events.yaml）。
 * 注意：CAMPAIGN_PAUSE 的 CampaignPaused / CampaignResumed 属 campaign 域事件
 * （母本 11.11 Campaign 行），在 asyncapi/campaign.events.yaml 定义，
 * 本域不重复定义（conventions.md：同一事件不得在两个域重复定义）。
 */
export const CONTROL_SWITCH_TRANSITION_EVENTS: Record<
  ControlSwitchType,
  Record<'ACTIVATE' | 'RELEASE', string>
> = {
  KILL_SWITCH: { ACTIVATE: 'KillSwitchActivated', RELEASE: 'KillSwitchReleased' },
  PROVIDER_DISABLE: { ACTIVATE: 'ProviderDisabled', RELEASE: 'ProviderEnabled' },
  CAMPAIGN_PAUSE: { ACTIVATE: 'CampaignPaused', RELEASE: 'CampaignResumed' },
};
