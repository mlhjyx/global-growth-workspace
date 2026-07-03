// M0 原型 Today 页 mock —— 全部从 @/data/fixtures（packages/contracts/fixtures）派生。
// 叙事：晶阳新能源（光伏，东南亚市场）workspace；同 workspace 内含建材经销商招募演示数据（见 workspace fixture 说明）。
// 口径：北极星 = 每月新增 SAO 及单位成本；结果链 Qualified Lead → SAO → Verified Outcome（ENG-016/ANA-013）。
import {
  workspace,
  campaigns,
  leads,
  opportunities,
  accountById,
  QUALIFICATION_LABELS,
  OPPORTUNITY_STAGE_LABELS,
} from '@/data/fixtures';
import type { ApprovalProposal } from '@/components/governance';

// ---- workspace 上下文（替代硬编码用户/公司名）----
export const workspaceName: string = workspace.display_name || workspace.name;
// fixtures 数据截止时间（演示数据为静态快照，任何汇总须标注数据时间，母本 6.13）
export const DATA_AS_OF = '2026-07-03';
const AS_OF_MS = new Date(`${DATA_AS_OF}T09:00:00Z`).getTime();

const daysAgo = (iso: string): string => {
  const d = Math.max(0, Math.floor((AS_OF_MS - new Date(iso).getTime()) / 86_400_000));
  return d === 0 ? '今天' : d === 1 ? '昨天' : `${d}天前`;
};

const COUNTRY_LABELS: Record<string, string> = {
  VN: '越南',
  TH: '泰国',
  MY: '马来西亚',
  PH: '菲律宾',
  ID: '印度尼西亚',
  NG: '尼日利亚',
  KE: '肯尼亚',
  GH: '加纳',
  TZ: '坦桑尼亚',
  EG: '埃及',
  ZA: '南非',
};

const INDUSTRY_LABELS: Record<string, string> = {
  solar_energy: '光伏能源',
  solar_distribution: '光伏分销',
  building_materials: '建材',
  building_materials_distribution: '建材分销',
  construction: '建筑工程',
};

// ---- 北极星口径统计（从 fixtures 计算，非拍脑袋数字）----
const runningCampaigns = campaigns.filter((c) => c.status === 'RUNNING');
// SAO：qualification_status 达到 SALES_ACCEPTED（含已验证 VERIFIED），以 accepted_at 为准
const saoOpportunities = opportunities.filter((o) => o.accepted_at);
const saoCount = saoOpportunities.length;
// Qualified Lead：已通过资格判定的线索（QUALIFIED 及其后继状态 CONTACTED/CONVERTED）
const qualifiedLeadCount = leads.filter((l) =>
  ['QUALIFIED', 'CONTACTED', 'CONVERTED'].includes(l.status),
).length;
// 单位 SAO 成本 = 运行中 Campaign 已消耗预算 ÷ 新增 SAO 数
const consumedUsd = runningCampaigns.reduce((sum, c) => sum + (c.budget?.consumed?.amount ?? 0), 0);
const costPerSao = saoCount > 0 ? Math.round(consumedUsd / saoCount) : 0;

export interface StatItem {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

// change/trend 为静态演示环比（fixtures 无历史快照可比），指标值均由 fixtures 计算
export const mockStats: StatItem[] = [
  {
    label: '本月新增 SAO',
    value: String(saoCount),
    change: `+${saoCount}`,
    trend: 'up',
    icon: 'ri-briefcase-4-line',
  },
  {
    label: 'Qualified Lead',
    value: String(qualifiedLeadCount),
    change: '+4',
    trend: 'up',
    icon: 'ri-user-follow-line',
  },
  {
    label: '单位 SAO 成本',
    value: `$${costPerSao.toLocaleString('en-US')}`,
    change: '环比持平',
    trend: 'neutral',
    icon: 'ri-money-dollar-circle-line',
  },
  {
    label: '运行中 Campaign',
    value: String(runningCampaigns.length),
    change: `草稿 ${campaigns.filter((c) => c.status === 'DRAFT').length}`,
    trend: 'neutral',
    icon: 'ri-flag-2-line',
  },
];

export interface NextAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'review' | 'approve' | 'publish' | 'respond' | 'analyze';
  time: string;
  campaign?: string;
}

const campaignNameById = new Map(campaigns.map((c) => [c.id, c.name as string]));
const runningCampaignName = runningCampaigns[0]?.name ?? '';
const draftCampaignName = campaigns.find((c) => c.status === 'DRAFT')?.name ?? '';

export const mockNextActions: NextAction[] = [
  {
    id: 'act-1',
    title: '审批第 2 批外联邮件草稿的发送授权',
    description:
      '40 封经销商招募邮件草稿已生成，按 CAM-008 需签发 ExecutionAuthorization 后才能发送。',
    priority: 'high',
    type: 'approve',
    time: '2小时前',
    campaign: runningCampaignName,
  },
  {
    id: 'act-2',
    title: `跟进 ${accountById.get(opportunities[0]?.account_id)?.trading_names?.[0] ?? 'Lagos BuildMart'} 经销协议询问`,
    description: opportunities[0]?.next_step?.description ?? '发出经销协议草案与首柜报价。',
    priority: 'high',
    type: 'respond',
    time: '4小时前',
    campaign: campaignNameById.get(opportunities[0]?.campaign_id),
  },
  {
    id: 'act-3',
    title: '评审东南亚光伏获客 Campaign 草案',
    description: 'AI 已生成目标、口径（SAO）与预算框架，需 Owner 评审后进入研究阶段。',
    priority: 'medium',
    type: 'review',
    time: '6小时前',
    campaign: draftCampaignName,
  },
  {
    id: 'act-4',
    title: '审批 3 条本地化内容（英语 · 尼日利亚市场）',
    description: '耐水石膏板应用案例内容已完成本地化，关键数字需核对 Claim 引用后批准。',
    priority: 'medium',
    type: 'approve',
    time: '1天前',
    campaign: runningCampaignName,
  },
];

export interface PendingApproval {
  id: string;
  title: string;
  submittedBy: string;
  submittedTime: string;
  type: 'content' | 'campaign' | 'budget' | 'account';
  urgency: 'urgent' | 'normal' | 'low';
}

export const mockPendingApprovals: PendingApproval[] = [
  {
    id: 'apr-1',
    title: '外联邮件序列第 2 批发送授权（40 封 · 人工审批后发送）',
    submittedBy: '市场负责人',
    submittedTime: '今天 14:30',
    type: 'campaign',
    urgency: 'urgent',
  },
  {
    id: 'apr-2',
    title: 'Qualified Lead 名单导出申请（数据导出属受管控动作）',
    submittedBy: '销售负责人',
    submittedTime: '今天 11:20',
    type: 'account',
    urgency: 'normal',
  },
  {
    id: 'apr-3',
    title: `东南亚光伏 Campaign 预算申请（$${(campaigns.find((c) => c.status === 'DRAFT')?.budget?.total?.amount ?? 4000).toLocaleString('en-US')}）`,
    submittedBy: '市场负责人',
    submittedTime: '昨天 16:45',
    type: 'budget',
    urgency: 'low',
  },
];

// 治理提案（硬边界 1：外部动作 = ActionProposal → Policy → 审批 → ExecutionAuthorization）。
// 接入治理组件库 ApprovalCard；4 个受治理动作类型，含差异对比/成本/策略/证据。
export const mockApprovalProposals: ApprovalProposal[] = [
  {
    id: 'prop-1',
    action: 'OUTBOUND_SEND',
    title: '建材非洲经销商招募 · 外联邮件序列第 2 批（42 封）',
    proposed_by: 'AI · Campaign Planning',
    proposed_at: '2026-07-03T14:30:00Z',
    risk_level: 'L2',
    scope_summary: '42 位联系人 · 邮件 · 3 天窗口',
    diff: [
      { field: '发送人数', before: '30', after: '42' },
      { field: '每日上限', before: '15', after: '20' },
    ],
    cost: {
      kind: 'ESTIMATED',
      amount: 12,
      currency: 'USD',
      category: 'EMAIL',
      detail: '邮箱验证 42 + 发送 42',
    },
    policy: {
      effect: 'REQUIRE_APPROVAL',
      reason: '外联发送需人工审批（D-019）',
      reason_codes: ['OUTBOUND_SEND'],
    },
    evidence: [
      {
        id: 'ev-1',
        subject: '联系人邮箱可投递性',
        source: 'EmailVerificationProvider',
        confidence: 0.92,
        fetched_at: '2026-07-02T00:00:00Z',
        allowed_for_outreach: true,
      },
      {
        id: 'ev-2',
        subject: '2 位联系人许可禁止外联',
        source: 'DatasetLicense',
        confidence: 1,
        fetched_at: '2026-07-01T00:00:00Z',
        allowed_for_outreach: false,
      },
    ],
    expires_at: '2026-07-06T00:00:00Z',
    status: 'PENDING',
  },
  {
    id: 'prop-2',
    action: 'DATA_EXPORT',
    title: 'Qualified Lead 名单导出（20 条 · CSV）',
    proposed_by: '销售负责人',
    proposed_at: '2026-07-03T11:20:00Z',
    risk_level: 'L3',
    scope_summary: '20 条 Lead · 含联系方式',
    policy: {
      effect: 'REQUIRE_APPROVAL',
      reason: '含许可受限字段，5 条不可导出',
      reason_codes: ['LICENSE_RESTRICTED', 'DATA_EXPORT'],
    },
    evidence: [
      {
        id: 'ev-3',
        subject: '5 条联系人禁止导出',
        source: 'DatasetLicense',
        confidence: 1,
        fetched_at: '2026-07-01T00:00:00Z',
        allowed_to_export: false,
      },
    ],
    status: 'PENDING',
  },
  {
    id: 'prop-3',
    action: 'CONTENT_PUBLISH',
    title: '光伏产品介绍图文 · 东南亚（越/英双语）',
    proposed_by: 'AI · Content Generation',
    proposed_at: '2026-07-03T09:10:00Z',
    risk_level: 'L1',
    scope_summary: '2 个平台 · 已过事实检查',
    cost: { kind: 'ESTIMATED', amount: 3, currency: 'USD', category: 'MODEL' },
    policy: { effect: 'ALLOW_WITH_DISCLOSURE', reason: '关键参数已引用 Approved Claim' },
    status: 'PENDING',
  },
  {
    id: 'prop-4',
    action: 'CROSS_BORDER_MODEL_CALL',
    title: '非洲市场深度研究 · 调用境外模型',
    proposed_by: 'AI · Market Research',
    proposed_at: '2026-07-03T08:00:00Z',
    risk_level: 'L2',
    scope_summary: '市场公开数据 · 无 PII',
    policy: {
      effect: 'REQUIRE_APPROVAL',
      reason: '跨境模型调用需审批',
      reason_codes: ['CROSS_BORDER_MODEL_CALL'],
    },
    status: 'PENDING',
  },
];

export interface Anomaly {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
  time: string;
  status: 'new' | 'acknowledged' | 'in_progress';
}

export const mockAnomalies: Anomaly[] = [
  {
    id: 'ano-1',
    title: '邮件退信率接近停止条件阈值',
    description: `「${runningCampaignName}」24 小时窗口退信率 3.8%，达到 5% 将按 StopCondition 自动暂停 Campaign。`,
    severity: 'warning',
    source: 'Campaign 守护',
    time: '今天 09:15',
    status: 'new',
  },
  {
    id: 'ano-2',
    title: '2 条内容发布失败',
    description:
      '获授权渠道 API 限流导致部分内容未能按时发布，已加入重试队列，成功批次不会重复发布。',
    severity: 'critical',
    source: '发布引擎',
    time: '今天 08:00',
    status: 'acknowledged',
  },
  {
    id: 'ano-3',
    title: '数据供应商配额使用达 80%',
    description:
      '贸易数据供应商本月查询配额剩余 20%，继续消耗将影响潜客补全任务，可调整批次或提升配额。',
    severity: 'info',
    source: '数据中心',
    time: '昨天 22:10',
    status: 'new',
  },
];

// ---- 机会卡：真正的 Opportunity（三级结果链），派生自 fixtures.opportunities ----
export interface Opportunity {
  id: string;
  company: string;
  /** 结果链级别中文标签（QUALIFICATION_LABELS），保留字段名以兼容全局搜索 */
  signal: string;
  /** 下一步动作描述（next_step.description） */
  signalDetail: string;
  stage: string;
  stageLabel: string;
  qualificationStatus: string;
  valueRange?: string;
  country: string;
  industry: string;
  time: string;
}

const formatValueRange = (vr: any): string | undefined => {
  if (!vr?.min?.amount || !vr?.max?.amount) return undefined;
  const k = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}k` : String(n));
  return `$${k(vr.min.amount)}–$${k(vr.max.amount)}`;
};

export const mockOpportunities: Opportunity[] = opportunities.map((opp) => {
  const account = accountById.get(opp.account_id);
  return {
    id: opp.id,
    company: account?.name ?? opp.title,
    signal: QUALIFICATION_LABELS[opp.qualification_status] ?? opp.qualification_status,
    signalDetail: opp.next_step?.description ?? opp.stage_reason ?? '',
    stage: opp.stage,
    stageLabel: OPPORTUNITY_STAGE_LABELS[opp.stage] ?? opp.stage,
    qualificationStatus: opp.qualification_status,
    valueRange: formatValueRange(opp.value_range),
    country: COUNTRY_LABELS[account?.country] ?? account?.country ?? '',
    industry:
      INDUSTRY_LABELS[account?.industries?.[0]] ?? opp.pack_label ?? account?.industries?.[0] ?? '',
    time: daysAgo(opp.updated_at),
  };
});
