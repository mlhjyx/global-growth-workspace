/**
 * Budget 健康状态机
 * 负责域：workspace | schema_version: 1
 * 来源：母本 7.1（WSP-005 五类预算与配额：模型/数据/媒体/邮件/专家；
 * 验收：超预算前预警，超过硬限制时阻止新任务）、11.15（BUDGET_EXCEEDED）。
 * 扩展说明：母本 11.9 未列出 Budget 状态机，本文件依据 WSP-005 验收标准补充。
 * 注意：这是预算健康度（health_status）的状态机，不是预算对象生命周期
 * （生命周期只有 ACTIVE/ARCHIVED，无复杂转移）。
 */

export type BudgetHealthState = 'OK' | 'WARNING' | 'EXCEEDED';

export const BUDGET_HEALTH_TRANSITIONS: Record<BudgetHealthState, BudgetHealthState[]> = {
  OK: ['WARNING', 'EXCEEDED'],
  WARNING: ['EXCEEDED', 'OK'],
  EXCEEDED: ['WARNING', 'OK'],
};

/**
 * 转移 -> 触发事件名（定义见 asyncapi/workspace.events.yaml）。
 * 回落转移（预算上调 / 周期重置 / 用量修正）统一触发 BudgetRecovered，
 * 原因由 payload.reason 表达。
 */
export const BUDGET_HEALTH_TRANSITION_EVENTS: Record<string, string> = {
  'OK->WARNING': 'BudgetThresholdReached',
  'OK->EXCEEDED': 'BudgetExceeded',
  'WARNING->EXCEEDED': 'BudgetExceeded',
  'WARNING->OK': 'BudgetRecovered',
  'EXCEEDED->WARNING': 'BudgetRecovered',
  'EXCEEDED->OK': 'BudgetRecovered',
};
