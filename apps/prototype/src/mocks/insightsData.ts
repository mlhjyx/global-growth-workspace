// M0 原型 Batch 1（数据与术语层）：洞察域 mock 对齐北极星口径与契约
// （Demo Gap Analysis G 组结论：KPI 换北极星（本月新增 SAO / 单位 SAO 成本）+ 三级结果链计数；
//   归因模型集合换 ANA-003 MVP 四模型并常显「规则归因」声明；成本从 ROAS/CPM 广告口径换五类成本 ANA-005；
//   事件流类型对齐 touchpoint 契约枚举）。数据从 fixtures.opportunities / commercialOutcomes / campaigns 派生。
import {
  campaigns as fixtureCampaigns,
  opportunities,
  commercialOutcomes,
  QUALIFICATION_LABELS,
} from '@/data/fixtures';

// ---- 北极星与三级结果链派生（ENG-016 / ANA-013）----

const saoOpportunities = opportunities.filter((o) =>
  ['SALES_ACCEPTED', 'VERIFIED'].includes(o.qualification_status),
);
const verifiedOutcomeCount = commercialOutcomes.filter(
  (o) => o.verification_status === 'VERIFIED',
).length;
const pendingOutcomeCount = commercialOutcomes.filter(
  (o) => o.verification_status === 'PENDING',
).length;
/** 结果链第一级：全部机会均由人工确认 Qualified Lead 后创建（含 1 个已撤回） */
const qualifiedLeadCount = opportunities.length;
const saoCount = saoOpportunities.length;

const runningCampaign = fixtureCampaigns.find((c) => c.status === 'RUNNING');
/** 本月成本 = 运行中 Campaign 已消耗预算（五类成本合计，见 mockCostBreakdown） */
const monthCost = runningCampaign?.budget?.consumed?.amount ?? 0;
const unitSAOCost = saoCount > 0 ? monthCost / saoCount : 0;

export const DATA_AS_OF = '2026-07-02';

export interface KPIItem {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  description?: string;
}

/** 结果链趋势点（旧 impressions/clicks 广告口径已废弃） */
export interface TrendDataPoint {
  week: string;
  label: string;
  /** 授权范围内的对外触达（邮件送达等） */
  sends: number;
  replies: number;
  qualifiedLeads: number;
  sao: number;
}

/** 归因通道：ANA-003 MVP 四模型计数（多触点归因为后续版本，不提供） */
export interface AttributionChannel {
  id: string;
  name: string;
  icon: string;
  firstTouch: number;
  lastMeaningfulTouch: number;
  campaignInfluence: number;
  manualPrimary: number;
  /** 五类成本向该渠道的分摊（USD） */
  cost: number;
  /** 该渠道触点参与的 SAO 数 */
  saoContribution: number;
  color: string;
}

/** 五类成本条目（ANA-005：数据/模型/媒体/邮件/专家，替代 ROAS/CPA 广告口径） */
export interface CostCategoryItem {
  id: string;
  name: string;
  icon: string;
  /** 本月成本（USD） */
  cost: number;
  /** 占本月总成本比例（%） */
  share: number;
  /** 单位 SAO 分摊（USD） */
  perSAO: number;
  /** 口径说明 */
  note: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface WeeklyReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  sections: string[];
  lastGenerated?: string;
}

export interface AIInsightItem {
  id: string;
  type: 'discovery' | 'warning' | 'opportunity' | 'anomaly';
  title: string;
  content: string;
  confidence: number;
  relatedMetric?: string;
  actionable: boolean;
  actionText?: string;
}

// ---- Touchpoint 事件流（类型对齐 contracts/opportunity/touchpoint.schema.json 枚举）----

export type TouchpointType =
  | 'IMPRESSION'
  | 'CLICK'
  | 'REPLY'
  | 'COMMENT'
  | 'FORM_SUBMIT'
  | 'MEETING'
  | 'SAMPLE'
  | 'QUOTE'
  | 'STAGE_CHANGE';

export const TOUCHPOINT_TYPE_LABELS: Record<TouchpointType, string> = {
  IMPRESSION: '曝光',
  CLICK: '点击',
  REPLY: '回复',
  COMMENT: '评论',
  FORM_SUBMIT: '表单',
  MEETING: '会议',
  SAMPLE: '样品',
  QUOTE: '报价',
  STAGE_CHANGE: '阶段变化',
};

export interface EventStreamItem {
  id: string;
  type: TouchpointType;
  title: string;
  source: string;
  channel?: string;
  value?: string;
  time: string;
  isNew: boolean;
}

// ---- KPI：北极星 + 三级结果链（1.5 / ANA-013）----

const fmtUSD = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

export const mockKPIs: KPIItem[] = [
  {
    id: 'kpi-1',
    label: '本月新增 SAO（北极星）',
    value: String(saoCount),
    change: `+${saoCount}`,
    trend: 'up',
    icon: 'ri-award-line',
    description: `销售接受机会 · 数据截至 ${DATA_AS_OF}`,
  },
  {
    id: 'kpi-2',
    label: '单位 SAO 成本（北极星）',
    value: fmtUSD(unitSAOCost),
    change: '首月基线',
    trend: 'neutral',
    icon: 'ri-money-dollar-circle-line',
    description: `本月成本 ${fmtUSD(monthCost)} / ${saoCount} 个 SAO（五类成本合计）`,
  },
  {
    id: 'kpi-3',
    label: QUALIFICATION_LABELS.QUALIFIED_LEAD,
    value: String(qualifiedLeadCount),
    change: `+${qualifiedLeadCount}`,
    trend: 'up',
    icon: 'ri-user-follow-line',
    description: '结果链第一级 · 含 1 个后续撤回的机会来源',
  },
  {
    id: 'kpi-4',
    label: QUALIFICATION_LABELS.SALES_ACCEPTED,
    value: String(saoCount),
    change: `+${saoCount}`,
    trend: 'up',
    icon: 'ri-shake-hands-line',
    description: '结果链第二级 · 销售人工接受并回写原因',
  },
  {
    id: 'kpi-5',
    label: QUALIFICATION_LABELS.VERIFIED,
    value: String(verifiedOutcomeCount),
    change: `另 ${pendingOutcomeCount} 待验证`,
    trend: 'up',
    icon: 'ri-shield-check-line',
    description: '结果链第三级 · 已验证会议结果（verified_by 人工验证）',
  },
  {
    id: 'kpi-6',
    label: '本月成本合计',
    value: fmtUSD(monthCost),
    change: '预警线 $6,000',
    trend: 'neutral',
    icon: 'ri-wallet-3-line',
    description: '数据/模型/媒体/邮件/专家 五类口径（非广告投放）',
  },
];

// ---- 结果链趋势（Campaign 2026-06-23 启动，此前为研究/准备期，数据为 0 属真实缺口）----

export const mockTrendData: TrendDataPoint[] = [
  { week: 'W23', label: '5月 W1', sends: 0, replies: 0, qualifiedLeads: 0, sao: 0 },
  { week: 'W24', label: '5月 W2', sends: 0, replies: 0, qualifiedLeads: 0, sao: 0 },
  { week: 'W25', label: '5月 W3', sends: 0, replies: 0, qualifiedLeads: 0, sao: 0 },
  { week: 'W26', label: '5月 W4', sends: 0, replies: 0, qualifiedLeads: 0, sao: 0 },
  { week: 'W27', label: '6月 W1', sends: 0, replies: 0, qualifiedLeads: 0, sao: 0 },
  { week: 'W28', label: '6月 W2', sends: 0, replies: 0, qualifiedLeads: 0, sao: 0 },
  { week: 'W29', label: '6月 W3', sends: 0, replies: 0, qualifiedLeads: 0, sao: 0 },
  { week: 'W30', label: '6月 W4', sends: 96, replies: 3, qualifiedLeads: 2, sao: 1 },
  { week: 'W31', label: '7月 W1', sends: 140, replies: 5, qualifiedLeads: 1, sao: 1 },
  { week: 'W32', label: '7月 W2', sends: 58, replies: 2, qualifiedLeads: 0, sao: 0 },
];

// ---- 归因（ANA-003 MVP 四模型：First Touch / Last Meaningful Touch / Campaign Influence / 人工 Primary Source）----
// 常显声明由 AttributionModel 组件渲染：「规则归因，不代表确定因果」。

export const mockAttributionChannels: AttributionChannel[] = [
  {
    id: 'ch-email',
    name: '邮件外联（授权序列）',
    icon: 'ri-mail-send-line',
    firstTouch: 4,
    lastMeaningfulTouch: 3,
    campaignInfluence: 4,
    manualPrimary: 3,
    cost: 460,
    saoContribution: 2,
    color: '#EA4335',
  },
  {
    id: 'ch-meeting',
    name: '会议（视频/线下）',
    icon: 'ri-video-chat-line',
    firstTouch: 0,
    lastMeaningfulTouch: 2,
    campaignInfluence: 2,
    manualPrimary: 1,
    cost: 120,
    saoContribution: 2,
    color: '#00D4AA',
  },
  {
    id: 'ch-linkedin',
    name: 'LinkedIn（获授权 DM）',
    icon: 'ri-linkedin-fill',
    firstTouch: 1,
    lastMeaningfulTouch: 1,
    campaignInfluence: 2,
    manualPrimary: 0,
    cost: 180,
    saoContribution: 0,
    color: '#0A66C2',
  },
  {
    id: 'ch-form',
    name: '官网经销商表单',
    icon: 'ri-file-list-3-line',
    firstTouch: 1,
    lastMeaningfulTouch: 1,
    campaignInfluence: 1,
    manualPrimary: 1,
    cost: 90,
    saoContribution: 0,
    color: '#FBBF24',
  },
];

// ---- 五类成本（ANA-005；合计对齐 Campaign budget.consumed = $1,240.50）----

export const mockCostBreakdown: CostCategoryItem[] = [
  {
    id: 'cost-data',
    name: '数据',
    icon: 'ri-database-2-line',
    cost: 420,
    share: 33.9,
    perSAO: 210,
    note: 'Provider 查询/补全（贸易记录、联系人验证）',
    trend: 'neutral',
  },
  {
    id: 'cost-model',
    name: '模型',
    icon: 'ri-cpu-line',
    cost: 310,
    share: 25.0,
    perSAO: 155,
    note: 'Model Gateway 调用（研究、生成、意图分类）',
    trend: 'up',
  },
  {
    id: 'cost-media',
    name: '媒体',
    icon: 'ri-image-line',
    cost: 180,
    share: 14.5,
    perSAO: 90,
    note: '内容与素材制作（案例图文、模板资产）',
    trend: 'neutral',
  },
  {
    id: 'cost-email',
    name: '邮件',
    icon: 'ri-mail-line',
    cost: 150,
    share: 12.1,
    perSAO: 75,
    note: '发送与域名基础设施（送达、验证）',
    trend: 'down',
  },
  {
    id: 'cost-expert',
    name: '专家',
    icon: 'ri-user-star-line',
    cost: 180.5,
    share: 14.5,
    perSAO: 90.25,
    note: '专家评审与本地化确认（认证/合规类内容）',
    trend: 'neutral',
  },
];

export const totalMonthCost = monthCost;
export const unitSAOCostValue = unitSAOCost;

// ---- 报告模板（ANA-011；统一指标口径，去 ROAS/CPA 广告词）----

export const mockReportTemplates: WeeklyReportTemplate[] = [
  {
    id: 'rt-1',
    name: '增长周报（标准版）',
    description: '北极星 KPI、三级结果链、五类成本与规则归因',
    icon: 'ri-file-chart-line',
    sections: ['北极星 KPI', '三级结果链', '成本五类', '归因（规则）', '下周建议'],
    lastGenerated: '2026-06-28',
  },
  {
    id: 'rt-2',
    name: '高管摘要',
    description: '精简版报告，聚焦本月新增 SAO 与单位成本',
    icon: 'ri-vip-crown-line',
    sections: ['北极星指标', '关键发现', '风险与待决策项'],
    lastGenerated: '2026-06-25',
  },
  {
    id: 'rt-3',
    name: '成本与效率报告',
    description: '五类成本走势、单位 SAO 成本与预算/硬上限对照',
    icon: 'ri-bar-chart-grouped-line',
    sections: ['成本五类', '单位 SAO 成本', '预算与硬上限', '优化建议'],
  },
  {
    id: 'rt-4',
    name: 'Campaign 复盘报告',
    description: '针对已完成 Campaign 的结果链复盘与经验回写（LEARNED）',
    icon: 'ri-flag-2-line',
    sections: ['Campaign 目标', '执行与授权记录', '结果链数据', '经验回写'],
  },
];

// ---- AI 数据洞察（叙事对齐 PDR-001 两个 Campaign；动作一律为建议，需审批）----

export const mockAIInsights: AIInsightItem[] = [
  {
    id: 'ins-1',
    type: 'discovery',
    title: 'Tier1 名单回复率显著高于 Tier2 假设成立',
    content:
      '有石膏制品进口记录（HS 6809）的 Tier1 经销商回复率约为 Tier2 关联品类经销商的 2.4 倍（样本量小，需持续观察）。可生成受众分层调整建议，优先扩充 Tier1 名单。',
    confidence: 74,
    relatedMetric: '回复率',
    actionable: true,
    actionText: '生成受众调整建议（需审批）',
  },
  {
    id: 'ins-2',
    type: 'warning',
    title: '尼日利亚名单退信率接近停止条件阈值',
    content:
      '24 小时窗口退信率 3.8%，接近 5% 自动暂停阈值（BOUNCE_RATE 停止条件）。建议下一批次发送前复核未验证邮箱，避免触发 Campaign 自动暂停。',
    confidence: 90,
    relatedMetric: '邮件成本/送达',
    actionable: true,
    actionText: '查看停止条件明细',
  },
  {
    id: 'ins-3',
    type: 'opportunity',
    title: '肯尼亚样品流程转化节奏快',
    content:
      'Nairobi Hardware 从首封邮件到销售接受（SAO）仅 4 天，且会议结果已人工验证（结果链第三级）。样品先行的推进方式可作为肯尼亚市场的默认跟进路径建议。',
    confidence: 81,
    relatedMetric: '本月新增 SAO',
    actionable: true,
    actionText: '查看机会时间线',
  },
  {
    id: 'ins-4',
    type: 'anomaly',
    title: '归因缺口：存在未关联机会的触点',
    content:
      '1 个官网表单触点尚未完成身份解析，暂无法关联到 Account/Campaign（ANA-010 身份未解析队列）。当前报表按已解析触点计算，存在数据缺口。',
    confidence: 88,
    relatedMetric: '归因（规则）',
    actionable: true,
    actionText: '查看归因待修复队列',
  },
  {
    id: 'ins-5',
    type: 'discovery',
    title: '单位 SAO 成本首月基线形成',
    content: `本月单位 SAO 成本 ${fmtUSD(unitSAOCost)}（成本 ${fmtUSD(monthCost)} / ${saoCount} SAO），其中数据类成本占比最高（33.9%）。样本量小，尚不足以支撑成本结构调整结论。`,
    confidence: 70,
    relatedMetric: '单位 SAO 成本（北极星）',
    actionable: true,
    actionText: '查看成本五类明细',
  },
];

// ---- Touchpoint 事件流（对齐 fixtures/opportunities.json 触点叙事）----

export const mockEventStream: EventStreamItem[] = [
  {
    id: 'ev-1',
    type: 'STAGE_CHANGE',
    title: 'Lagos BuildMart 机会阶段变更 → 会议（MEETING）',
    source: '非洲经销商招募 Campaign',
    channel: 'system',
    value: 'SAO · 阶段推进',
    time: '2天前',
    isNew: true,
  },
  {
    id: 'ev-2',
    type: 'QUOTE',
    title: 'Lagos BuildMart 首柜报价准备中（7-08 前发出）',
    source: '机会下一步（next_step）',
    channel: 'email',
    value: '$25K-$60K 预估区间',
    time: '2天前',
    isNew: true,
  },
  {
    id: 'ev-3',
    type: 'SAMPLE',
    title: 'Nairobi Hardware 样品板（9mm/12mm）已发出，待到货检验',
    source: '非洲经销商招募 Campaign',
    channel: 'email',
    value: '样品/演示阶段',
    time: '3天前',
    isNew: true,
  },
  {
    id: 'ev-4',
    type: 'MEETING',
    title: 'Nairobi Hardware 视频会议完成（结果已人工验证）',
    source: '日历 Provider',
    channel: 'meeting',
    value: 'Verified Outcome',
    time: '4天前',
    isNew: false,
  },
  {
    id: 'ev-5',
    type: 'REPLY',
    title: 'Chinedu Okafor（Lagos BuildMart）回复第 2 封跟进邮件',
    source: '邮件序列 · 第 2 步',
    channel: 'email',
    value: '询价 · 置信度 92%',
    time: '7天前',
    isNew: false,
  },
  {
    id: 'ev-6',
    type: 'CLICK',
    title: 'Nairobi Hardware 点击经销商政策页链接',
    source: '邮件序列 · 第 1 步',
    channel: 'email',
    value: '/dealers 页面',
    time: '8天前',
    isNew: false,
  },
  {
    id: 'ev-7',
    type: 'REPLY',
    title: 'Delta Coast 回复：今年预算受限，暂不新增品牌代理',
    source: '邮件序列 · 第 1 步',
    channel: 'email',
    value: '暂不考虑 · 机会已撤回',
    time: '5天前',
    isNew: false,
  },
  {
    id: 'ev-8',
    type: 'FORM_SUBMIT',
    title: '官网经销商申请表单提交（身份解析中）',
    source: '官网表单',
    channel: 'form',
    value: '待关联 Account',
    time: '昨天',
    isNew: false,
  },
  {
    id: 'ev-9',
    type: 'COMMENT',
    title: 'LinkedIn 案例帖收到尼日利亚承包商评论',
    source: 'LinkedIn（获授权）',
    channel: 'social_comment',
    value: '待意图分类',
    time: '昨天',
    isNew: false,
  },
  {
    id: 'ev-10',
    type: 'IMPRESSION',
    title: '第 1 步邮件批次送达 52 封（2 封退信）',
    source: '邮件序列 · 授权批次',
    channel: 'email',
    value: '授权上限内',
    time: '9天前',
    isNew: false,
  },
];
