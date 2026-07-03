/**
 * Workspace 状态机
 * 负责域：workspace | schema_version: 1
 * 来源：母本 7.1（WSP-001 创建、WSP-008 账户关闭流程）。
 * 扩展说明：母本 11.9 未列出 Workspace 状态机，本文件依据 WSP-008
 * （数据导出、保留期、删除和账户关闭流程）补充 CLOSING/CLOSED 生命周期。
 */

export type WorkspaceState = 'ACTIVE' | 'SUSPENDED' | 'CLOSING' | 'CLOSED';

export const WORKSPACE_TRANSITIONS: Record<WorkspaceState, WorkspaceState[]> = {
  ACTIVE: ['SUSPENDED', 'CLOSING'],
  SUSPENDED: ['ACTIVE', 'CLOSING'],
  CLOSING: ['CLOSED'],
  CLOSED: [],
};

/** 转移 -> 触发事件名（定义见 asyncapi/workspace.events.yaml） */
export const WORKSPACE_TRANSITION_EVENTS: Record<string, string> = {
  'ACTIVE->SUSPENDED': 'WorkspaceSuspended',
  'SUSPENDED->ACTIVE': 'WorkspaceResumed',
  'ACTIVE->CLOSING': 'WorkspaceCloseRequested',
  'SUSPENDED->CLOSING': 'WorkspaceCloseRequested',
  'CLOSING->CLOSED': 'WorkspaceClosed',
};
