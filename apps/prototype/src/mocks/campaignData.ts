// M0 原型 Batch 1（数据与术语层）：Campaign 域 mock 一律从 packages/contracts/fixtures 派生
// （Demo Gap Analysis D 组结论：mock 换 contracts/fixtures，状态对齐 campaign.state.ts 11 态）。
// 「战役」保留为 Campaign 的中文标签（母本 5.2），但对象语义不再是项目管理：
// 阶段/任务板仅为 Batch 1 的过渡形态（叙事已换成 PDR-001 两个 Campaign），Batch 3 按 6.12.5 重做画布结构。
import {
  campaigns as fixtureCampaigns,
  audiences,
  executionAuthorizations,
  stopConditions,
  CAMPAIGN_STATE_LABELS,
} from '@/data/fixtures';

// ---- 契约对齐类型 ----

/** 契约 money 对象（campaign.schema.json budget.*） */
export interface Money {
  amount: number;
  currency: string;
}

/** campaign.state.ts 11 态（Demo 原 4 态已废弃） */
export type CampaignStatus =
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

/** 契约 budget 对象：总预算 / 硬上限 / 日上限 / 已消耗 */
export interface CampaignBudget {
  total: Money;
  hardCap?: Money;
  dailyCap?: Money;
  consumed?: Money;
}

export interface Campaign {
  id: string;
  name: string;
  goal: string;
  /** 契约 11 态，展示用 CAMPAIGN_STATE_LABELS 翻译 */
  status: CampaignStatus;
  /** 原型展示用近似完成度（非契约字段，Batch 3 画布重做时移除） */
  progress: number;
  startDate: string;
  endDate: string;
  owner: string;
  budget: CampaignBudget;
  channels: string[];
  /** 受众名单已接受成员数（audience.member_count） */
  leads: number;
  /** 已授权内容模板数（execution-authorization.templates） */
  content: number;
}

export interface CampaignStage {
  id: string;
  name: string;
  order: number;
  status: 'completed' | 'in_progress' | 'pending';
  progress: number;
  tasks: CampaignTask[];
}

/** Batch 1 过渡对象：Campaign 计划项（不再称「任务/项目管理」，Batch 3 换契约计划对象） */
export interface CampaignTask {
  id: string;
  title: string;
  assignee: string;
  assigneeAvatar: string;
  status: 'completed' | 'in_progress' | 'pending' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  tags: string[];
  description?: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  userAvatar: string;
  action: string;
  target: string;
  time: string;
  type: 'create' | 'update' | 'approve' | 'publish' | 'comment' | 'alert';
}

export interface AIInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'evidence' | 'risk';
  title: string;
  content: string;
  confidence: number;
  relatedTo?: string;
  actionable: boolean;
  actionText?: string;
}

// ---- 展示辅助 ----

const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CNY: '¥' };

export const formatMoney = (m?: Money | null): string => {
  if (!m) return '—';
  const symbol = CURRENCY_SYMBOLS[m.currency] ?? `${m.currency} `;
  return `${symbol}${m.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
};

/** 契约 11 态 → 视觉配置（标签统一取 CAMPAIGN_STATE_LABELS，禁止自造词） */
export const CAMPAIGN_STATUS_UI: Record<
  CampaignStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  DRAFT: {
    label: CAMPAIGN_STATE_LABELS.DRAFT,
    color: 'text-foreground-500',
    bg: 'bg-foreground-500/10',
    border: 'border-foreground-500/20',
  },
  RESEARCHING: {
    label: CAMPAIGN_STATE_LABELS.RESEARCHING,
    color: 'text-info',
    bg: 'bg-info/10',
    border: 'border-info/30',
  },
  READY_FOR_REVIEW: {
    label: CAMPAIGN_STATE_LABELS.READY_FOR_REVIEW,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
  },
  APPROVED: {
    label: CAMPAIGN_STATE_LABELS.APPROVED,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/30',
  },
  SCHEDULED: {
    label: CAMPAIGN_STATE_LABELS.SCHEDULED,
    color: 'text-info',
    bg: 'bg-info/10',
    border: 'border-info/30',
  },
  RUNNING: {
    label: CAMPAIGN_STATE_LABELS.RUNNING,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/30',
  },
  PAUSED: {
    label: CAMPAIGN_STATE_LABELS.PAUSED,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
  },
  BLOCKED: {
    label: CAMPAIGN_STATE_LABELS.BLOCKED,
    color: 'text-error',
    bg: 'bg-error/10',
    border: 'border-error/30',
  },
  COMPLETED: {
    label: CAMPAIGN_STATE_LABELS.COMPLETED,
    color: 'text-info',
    bg: 'bg-info/10',
    border: 'border-info/30',
  },
  LEARNED: {
    label: CAMPAIGN_STATE_LABELS.LEARNED,
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
    border: 'border-primary-500/30',
  },
  ARCHIVED: {
    label: CAMPAIGN_STATE_LABELS.ARCHIVED,
    color: 'text-foreground-600',
    bg: 'bg-white/5',
    border: 'border-white/10',
  },
};

// ---- 从 fixtures 派生 Campaign 列表 ----
// PDR-001：建材非洲经销商招募（RUNNING）+ 光伏东南亚主动获客（DRAFT）

/** fixtures memberships 仅有 ID；原型用 teamData 人名映射（mem_001=OWNER / mem_002=MARKETER / mem_003=SALES） */
const OWNER_NAMES: Record<string, string> = {
  mem_01JZMEMB000000000000000001: 'Leo Chen',
  mem_01JZMEMB000000000000000002: 'Sarah Weber',
  mem_01JZMEMB000000000000000003: 'David Müller',
};

const CHANNEL_LABELS: Record<string, string> = {
  EMAIL: '邮件',
  LINKEDIN: 'LinkedIn（获授权）',
};

/** 原型展示用近似完成度（非契约字段） */
const PROGRESS_BY_STATUS: Partial<Record<CampaignStatus, number>> = {
  DRAFT: 8,
  RUNNING: 42,
};

const toMoney = (m: any): Money | undefined =>
  m && typeof m.amount === 'number' ? { amount: m.amount, currency: m.currency } : undefined;

export const mockCampaigns: Campaign[] = fixtureCampaigns.map((c) => {
  const campaignAudiences = audiences.filter((a) => (c.audience_ids ?? []).includes(a.id));
  const memberCount = campaignAudiences.reduce((n, a) => n + (a.member_count ?? 0), 0);
  const auths = executionAuthorizations.filter((a) => a.campaign_id === c.id);
  const templateCount = auths.reduce((n, a) => n + (a.templates?.length ?? 0), 0);
  const cadence: string[] = (c.strategy_snapshot?.channel_cadence ?? []).map(
    (x: any) => CHANNEL_LABELS[x.channel] ?? x.channel,
  );

  return {
    id: c.id,
    name: c.name,
    goal: c.objective?.goal_statement ?? '',
    status: c.status as CampaignStatus,
    progress: PROGRESS_BY_STATUS[c.status as CampaignStatus] ?? 0,
    startDate: (c.dates?.planned_start_at ?? '').slice(0, 10),
    endDate: (c.dates?.planned_end_at ?? '').slice(0, 10),
    owner: OWNER_NAMES[c.owner_id] ?? c.owner_id,
    budget: {
      total: toMoney(c.budget?.total)!,
      hardCap: toMoney(c.budget?.hard_cap),
      dailyCap: toMoney(c.budget?.daily_cap),
      consumed: toMoney(c.budget?.consumed),
    },
    channels: cadence.length > 0 ? cadence : ['邮件（草案计划）'],
    leads: memberCount,
    content: templateCount,
  };
});

/** 运行中 Campaign 的停止条件摘要（stop-condition fixtures，供叙事引用） */
export const runningStopConditions = stopConditions;

// ---- Campaign 计划项（Batch 1 过渡形态：分组沿 J-B 经销商招募旅程叙事，Batch 3 重做画布结构）----
// 叙事对象：cam_01JZCAMP000000000000000001 非洲经销商招募 · 耐水石膏板（尼日利亚/肯尼亚首发）

export const mockStages: CampaignStage[] = [
  {
    id: 's1',
    name: '市场研究与 ICP 确认',
    order: 1,
    status: 'completed',
    progress: 100,
    tasks: [
      {
        id: 't1',
        title: '尼日利亚/肯尼亚建材经销市场速览（HS 6809 进口记录核验）',
        assignee: 'Sarah Weber',
        assigneeAvatar: 'S',
        status: 'completed',
        priority: 'high',
        dueDate: '2026-06-16',
        tags: ['Research', 'Market Pack'],
        description:
          '基于贸易数据确认 Tier1（有石膏制品进口记录）与 Tier2（关联建材品类）两级受众假设。',
      },
      {
        id: 't2',
        title: '经销商 ICP 确认（icp_…002 建材经销商画像）',
        assignee: 'Leo Chen',
        assigneeAvatar: 'L',
        status: 'completed',
        priority: 'high',
        dueDate: '2026-06-17',
        tags: ['ICP'],
        description: 'ICP 条件与排除规则经 Owner 确认后用于名单筛选。',
      },
      {
        id: 't3',
        title: '硬性排除复核：终端施工方移出名单（LED-003）',
        assignee: 'David Müller',
        assigneeAvatar: 'D',
        status: 'completed',
        priority: 'medium',
        dueDate: '2026-06-18',
        tags: ['Audience', '排除规则'],
        description: '复核发现 1 家命中硬性排除（终端施工方），人工移出并记录原因。',
      },
    ],
  },
  {
    id: 's2',
    name: '受众名单与内容准备',
    order: 2,
    status: 'completed',
    progress: 100,
    tasks: [
      {
        id: 't4',
        title: '受众名单冻结（5 家经销商 · FROZEN 快照）',
        assignee: 'Sarah Weber',
        assigneeAvatar: 'S',
        status: 'completed',
        priority: 'high',
        dueDate: '2026-06-18',
        tags: ['Audience', 'Snapshot'],
        description: '名单版本 v3 冻结，执行批次可追溯当时名单快照（CAM-003）。',
      },
      {
        id: 't5',
        title: '英文邮件模板起草：SONCAP 认证背书（第 1 封）',
        assignee: 'David Müller',
        assigneeAvatar: 'D',
        status: 'completed',
        priority: 'high',
        dueDate: '2026-06-19',
        tags: ['Content', 'Email'],
      },
      {
        id: 't6',
        title: '英文邮件模板起草：项目案例跟进（第 2 封）',
        assignee: 'David Müller',
        assigneeAvatar: 'D',
        status: 'completed',
        priority: 'medium',
        dueDate: '2026-06-19',
        tags: ['Content', 'Email'],
      },
      {
        id: 't7',
        title: 'LinkedIn DM 模板起草（仅 Tier1 决策人 · 获授权渠道）',
        assignee: 'Sarah Weber',
        assigneeAvatar: 'S',
        status: 'completed',
        priority: 'medium',
        dueDate: '2026-06-19',
        tags: ['Content', 'LinkedIn'],
        description: '邮件无回复后的补充触达，遵循 D-019 授权渠道边界。',
      },
    ],
  },
  {
    id: 's3',
    name: '审批与执行授权',
    order: 3,
    status: 'completed',
    progress: 100,
    tasks: [
      {
        id: 't8',
        title: '三步序列（邮件×2 + LinkedIn DM）送审',
        assignee: 'David Müller',
        assigneeAvatar: 'D',
        status: 'completed',
        priority: 'high',
        dueDate: '2026-06-19',
        tags: ['Sequence', '审批'],
        description: '序列状态 APPROVED，退出条件含 REPLIED/UNSUBSCRIBED/BOUNCED/COMPLAINT。',
      },
      {
        id: 't9',
        title: '执行授权签发（ExecutionAuthorization · 上限 900 动作）',
        assignee: 'Leo Chen',
        assigneeAvatar: 'L',
        status: 'completed',
        priority: 'high',
        dueDate: '2026-06-20',
        tags: ['Authorization'],
        description: '模板内容哈希固化；频率上限每联系人每周 ≤2 次；预算上限 $8,000。',
      },
      {
        id: 't10',
        title: '停止条件配置：退信率 ≥5% 自动暂停 / 成本 $6,000 预警',
        assignee: 'Leo Chen',
        assigneeAvatar: 'L',
        status: 'completed',
        priority: 'high',
        dueDate: '2026-06-18',
        tags: ['StopCondition'],
        description: '24 小时窗口退信率阈值触发 PAUSE_CAMPAIGN；成本达预警线通知 Owner。',
      },
    ],
  },
  {
    id: 's4',
    name: '序列执行与互动处理',
    order: 4,
    status: 'in_progress',
    progress: 55,
    tasks: [
      {
        id: 't11',
        title: '第 1 步邮件批次发送监控（当地时间工作日 9:00-17:00）',
        assignee: 'Sarah Weber',
        assigneeAvatar: 'S',
        status: 'completed',
        priority: 'high',
        dueDate: '2026-06-24',
        tags: ['Email', 'Run'],
      },
      {
        id: 't12',
        title: '回复意图分类与 Qualified Lead 确认（ENG-004）',
        assignee: 'David Müller',
        assigneeAvatar: 'D',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-07-04',
        tags: ['Engagement', 'Qualified Lead'],
        description: '高置信度询价/样品类回复经人工确认为 Qualified Lead 后进入机会链路。',
      },
      {
        id: 't13',
        title: '无回复 72h 后第 2 步跟进邮件（NO_REPLY 进入条件）',
        assignee: 'Sarah Weber',
        assigneeAvatar: 'S',
        status: 'in_progress',
        priority: 'medium',
        dueDate: '2026-07-06',
        tags: ['Email', 'Sequence'],
      },
      {
        id: 't14',
        title: '退信/投诉监控（对照停止条件阈值）',
        assignee: 'Anna Kowalski',
        assigneeAvatar: 'A',
        status: 'in_progress',
        priority: 'medium',
        dueDate: '2026-07-10',
        tags: ['StopCondition', '合规'],
      },
    ],
  },
  {
    id: 's5',
    name: '机会与结果链复盘',
    order: 5,
    status: 'pending',
    progress: 10,
    tasks: [
      {
        id: 't15',
        title: 'SAO 跟进：Lagos BuildMart 经销协议草案与首柜报价（7-08 前）',
        assignee: 'David Müller',
        assigneeAvatar: 'D',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-07-08',
        tags: ['Opportunity', 'SAO'],
      },
      {
        id: 't16',
        title: 'CommercialOutcome 验证：Nairobi Hardware 样品到货检验回访',
        assignee: 'David Müller',
        assigneeAvatar: 'D',
        status: 'pending',
        priority: 'high',
        dueDate: '2026-07-10',
        tags: ['Verified Outcome'],
      },
      {
        id: 't17',
        title: 'Campaign 复盘（LEARNED）：主题行变体假设与 Tier 分层经验回写',
        assignee: 'Leo Chen',
        assigneeAvatar: 'L',
        status: 'pending',
        priority: 'low',
        dueDate: '2026-09-25',
        tags: ['复盘'],
      },
    ],
  },
];

export const mockActivities: ActivityItem[] = [
  {
    id: 'a1',
    user: 'David Müller',
    userAvatar: 'D',
    action: '确认了',
    target: 'Lagos BuildMart 为 SAO（销售接受机会）',
    time: '30分钟前',
    type: 'update',
  },
  {
    id: 'a2',
    user: 'AI 助手',
    userAvatar: 'AI',
    action: '生成了',
    target: '第 2 封跟进邮件调整建议（需审批）',
    time: '1小时前',
    type: 'create',
  },
  {
    id: 'a3',
    user: '系统',
    userAvatar: 'S',
    action: '记录了',
    target: 'Nairobi Hardware 视频会议触点（已验证结果）',
    time: '2小时前',
    type: 'update',
  },
  {
    id: 'a4',
    user: 'Leo Chen',
    userAvatar: 'L',
    action: '审批通过并签发了',
    target: '非洲经销商招募 Campaign 执行授权（900 动作上限）',
    time: '昨天',
    type: 'approve',
  },
  {
    id: 'a5',
    user: '系统',
    userAvatar: 'S',
    action: '执行了',
    target: '第 1 步邮件批次：52 封送达 / 2 封退信（授权范围内）',
    time: '昨天',
    type: 'publish',
  },
  {
    id: 'a6',
    user: '系统',
    userAvatar: 'S',
    action: '提示',
    target: '预算已消耗 $1,240.50 / 预警线 $6,000（硬上限 $8,000）',
    time: '昨天',
    type: 'alert',
  },
  {
    id: 'a7',
    user: 'Sarah Weber',
    userAvatar: 'S',
    action: '创建了',
    target: '东南亚光伏进口商主动获客 Campaign 草稿（越南首发）',
    time: '5天前',
    type: 'create',
  },
  {
    id: 'a8',
    user: 'Anna Kowalski',
    userAvatar: 'A',
    action: '评论了',
    target: 'SONCAP 认证背书模板的 Claim 引用核对结果',
    time: '6天前',
    type: 'comment',
  },
];

export const mockAIInsights: AIInsight[] = [
  {
    id: 'ai1',
    type: 'suggestion',
    title: '发送时段调整建议',
    content:
      '按拉各斯/内罗毕当地时间统计，上午 9-11 点发送的第 1 步邮件回复率高于下午时段。当前排期有 2 个批次安排在当地 15:00 后，可生成排期调整建议供 Owner 审批。',
    confidence: 82,
    relatedTo: '第 1 步邮件批次',
    actionable: true,
    actionText: '生成调整建议（需审批）',
  },
  {
    id: 'ai2',
    type: 'evidence',
    title: 'Lagos BuildMart 高意向证据',
    content:
      '该经销商对第 2 封跟进邮件回复，主动询问区域独家政策与首柜条件（来源：会话 cnv_ng_dealer_0011，2026-06-26）。机会已被销售接受（SAO），下一步为经销协议草案与首柜报价。',
    confidence: 94,
    relatedTo: 'Lagos BuildMart · 拉各斯经销权机会',
    actionable: true,
    actionText: '查看证据来源',
  },
  {
    id: 'ai3',
    type: 'warning',
    title: '预算消耗提示',
    content:
      '当前已消耗 $1,240.50（总预算 $6,000，硬上限 $8,000，日上限 $150）。按当前执行节奏预计 9 月上旬触达预警线；达到硬上限时系统将自动停止新任务（COST_OVERRUN 停止条件）。',
    confidence: 85,
    relatedTo: 'Campaign 预算（consumed / hard_cap）',
    actionable: true,
    actionText: '查看预算与停止条件',
  },
  {
    id: 'ai4',
    type: 'suggestion',
    title: '主题行变体假设初步成立',
    content:
      '策略快照中的变体假设「主题行 A（SONCAP 认证背书）回复率优于主题行 B（首单价格让利）」在首批 52 封样本中初步成立（A 组回复 4/27，B 组 1/25，样本量不足）。可生成实验调整建议，扩大 A 组比例。',
    confidence: 68,
    relatedTo: '三步邮件+领英序列（英文）',
    actionable: true,
    actionText: '生成实验调整建议（需审批）',
  },
  {
    id: 'ai5',
    type: 'risk',
    title: '退信率接近停止条件阈值',
    content:
      '尼日利亚名单 24 小时窗口退信率 3.8%，接近 5% 自动暂停阈值（BOUNCE_RATE 停止条件，最小样本量 50）。建议在下一批次前复核 2 个高风险邮箱的验证状态。',
    confidence: 90,
    relatedTo: '停止条件 stp_…001',
    actionable: true,
    actionText: '查看停止条件明细',
  },
];
