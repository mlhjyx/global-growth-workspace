// Gate 1 验证埋点（EPIC-M0-06 T2，母本 14.1 Usability）。
// M0 原型无后端：事件落 localStorage 环形缓冲（供 Insights Gate-1 看板与 UAT 采集导出），
// 同时 console.debug 便于测试主持人实时观察。M1 起由真实遥测替换，事件名保持稳定。

export type Gate1Event =
  | 'journey_start' // 旅程启动（J-A/J-B）
  | 'journey_step_complete' // 旅程单步完成（任务完成率分子）
  | 'journey_complete' // 全旅程走通（目标→SAO）
  | 'term_help_open' // 术语/证据求助（EvidenceDrawer 等）——术语理解探针
  | 'error_recover' // 错误态下点击重试并恢复——错误恢复探针
  | 'approval_decision'; // 审批决策（批准/退回/限制范围）——审批理解探针

export interface Gate1Record {
  event: Gate1Event;
  at: string; // ISO 时间
  props?: Record<string, string | number | boolean>;
}

const STORE_KEY = 'ggw_gate1_events';
const MAX_EVENTS = 500;

function read(): Gate1Record[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Gate1Record[]) : [];
  } catch {
    return [];
  }
}

export function track(event: Gate1Event, props?: Gate1Record['props']): void {
  const record: Gate1Record = { event, at: new Date().toISOString(), props };
  try {
    const events = read();
    events.push(record);
    localStorage.setItem(STORE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    // 存储不可用（隐私模式等）不阻断交互——埋点是观察面不是功能面
  }
  console.debug('[gate1]', record.event, record.props ?? {});
}

export function getGate1Events(): Gate1Record[] {
  return read();
}

export interface Gate1Metrics {
  journeyStarts: number;
  journeyCompletes: number;
  stepCompletions: number;
  termHelpOpens: number;
  errorRecovers: number;
  approvalDecisions: number;
  /** 旅程完成率（完成数/启动数），无启动时为 null */
  completionRate: number | null;
}

export function getGate1Metrics(): Gate1Metrics {
  const events = read();
  const count = (e: Gate1Event) => events.filter((r) => r.event === e).length;
  const starts = count('journey_start');
  const completes = count('journey_complete');
  return {
    journeyStarts: starts,
    journeyCompletes: completes,
    stepCompletions: count('journey_step_complete'),
    termHelpOpens: count('term_help_open'),
    errorRecovers: count('error_recover'),
    approvalDecisions: count('approval_decision'),
    completionRate: starts > 0 ? completes / starts : null,
  };
}

/** UAT 会话重置（每位受试者开始前清零，见 docs/testing/UAT_SCRIPTS_M0.md） */
export function clearGate1Events(): void {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch {
    /* 同上，不阻断 */
  }
}

/** UAT 采集导出：JSON 字符串（主持人复制进数据采集表附件列） */
export function exportGate1Events(): string {
  return JSON.stringify(read(), null, 2);
}
