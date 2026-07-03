export interface KPIItem {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  description?: string;
}

export interface TrendDataPoint {
  week: string;
  label: string;
  impressions: number;
  clicks: number;
  conversions: number;
  leads: number;
}

export interface AttributionChannel {
  id: string;
  name: string;
  icon: string;
  firstTouch: number;
  lastTouch: number;
  multiTouch: number;
  cost: number;
  revenue: number;
  conversions: number;
  color: string;
}

export interface ChannelPerformance {
  id: string;
  name: string;
  icon: string;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  conversionRate: number;
  cost: number;
  cpc: number;
  cpa: number;
  revenue: number;
  roas: number;
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

export interface EventStreamItem {
  id: string;
  type: 'conversion' | 'click' | 'impression' | 'lead' | 'alert' | 'system';
  title: string;
  source: string;
  channel?: string;
  value?: string;
  time: string;
  isNew: boolean;
}

export const mockKPIs: KPIItem[] = [
  {
    id: 'kpi-1',
    label: '总转化数',
    value: '1,247',
    change: '+18.3%',
    trend: 'up',
    icon: 'ri-exchange-dollar-line',
    description: '较上周增加 193',
  },
  {
    id: 'kpi-2',
    label: '获客成本 (CAC)',
    value: '$38.50',
    change: '-12.7%',
    trend: 'up',
    icon: 'ri-money-dollar-circle-line',
    description: '较上周下降 $5.60',
  },
  {
    id: 'kpi-3',
    label: '线索-成交率',
    value: '14.2%',
    change: '+2.1%',
    trend: 'up',
    icon: 'ri-user-follow-line',
    description: '较上周提升 2.1pp',
  },
  {
    id: 'kpi-4',
    label: '广告支出回报 (ROAS)',
    value: '4.8x',
    change: '+0.6x',
    trend: 'up',
    icon: 'ri-funds-line',
    description: '较上周提升 0.6x',
  },
  {
    id: 'kpi-5',
    label: '总曝光量',
    value: '842K',
    change: '+24.5%',
    trend: 'up',
    icon: 'ri-eye-line',
    description: '较上周增加 166K',
  },
  {
    id: 'kpi-6',
    label: '内容互动率',
    value: '5.8%',
    change: '-0.3%',
    trend: 'down',
    icon: 'ri-heart-line',
    description: '较上周下降 0.3pp',
  },
];

export const mockTrendData: TrendDataPoint[] = [
  { week: 'W23', label: '5月 W1', impressions: 62000, clicks: 4200, conversions: 180, leads: 45 },
  { week: 'W24', label: '5月 W2', impressions: 68000, clicks: 4500, conversions: 195, leads: 52 },
  { week: 'W25', label: '5月 W3', impressions: 71000, clicks: 5100, conversions: 210, leads: 58 },
  { week: 'W26', label: '5月 W4', impressions: 73000, clicks: 4800, conversions: 205, leads: 50 },
  { week: 'W27', label: '6月 W1', impressions: 78000, clicks: 5600, conversions: 240, leads: 62 },
  { week: 'W28', label: '6月 W2', impressions: 82000, clicks: 5900, conversions: 255, leads: 68 },
  { week: 'W29', label: '6月 W3', impressions: 85000, clicks: 6200, conversions: 270, leads: 72 },
  { week: 'W30', label: '6月 W4', impressions: 88000, clicks: 6500, conversions: 285, leads: 78 },
  { week: 'W31', label: '7月 W1', impressions: 91000, clicks: 6800, conversions: 300, leads: 82 },
  { week: 'W32', label: '7月 W2', impressions: 95000, clicks: 7200, conversions: 320, leads: 88 },
  { week: 'W33', label: '7月 W3', impressions: 98000, clicks: 7500, conversions: 335, leads: 92 },
  { week: 'W34', label: '7月 W4', impressions: 102000, clicks: 7800, conversions: 350, leads: 96 },
];

export const mockAttributionChannels: AttributionChannel[] = [
  {
    id: 'ch-linkedin',
    name: 'LinkedIn',
    icon: 'ri-linkedin-fill',
    firstTouch: 32,
    lastTouch: 28,
    multiTouch: 35,
    cost: 18500,
    revenue: 72000,
    conversions: 342,
    color: '#0A66C2',
  },
  {
    id: 'ch-email',
    name: '邮件营销',
    icon: 'ri-mail-line',
    firstTouch: 18,
    lastTouch: 25,
    multiTouch: 22,
    cost: 8500,
    revenue: 48000,
    conversions: 285,
    color: '#EA4335',
  },
  {
    id: 'ch-content',
    name: '内容营销',
    icon: 'ri-article-line',
    firstTouch: 25,
    lastTouch: 15,
    multiTouch: 20,
    cost: 12000,
    revenue: 38000,
    conversions: 210,
    color: '#34A853',
  },
  {
    id: 'ch-twitter',
    name: 'Twitter/X',
    icon: 'ri-twitter-x-fill',
    firstTouch: 10,
    lastTouch: 12,
    multiTouch: 10,
    cost: 5500,
    revenue: 18600,
    conversions: 128,
    color: '#1DA1F2',
  },
  {
    id: 'ch-webinar',
    name: 'Webinar',
    icon: 'ri-live-line',
    firstTouch: 8,
    lastTouch: 12,
    multiTouch: 8,
    cost: 15000,
    revenue: 42000,
    conversions: 95,
    color: '#FF6D00',
  },
  {
    id: 'ch-referral',
    name: '推荐流量',
    icon: 'ri-share-forward-line',
    firstTouch: 7,
    lastTouch: 8,
    multiTouch: 5,
    cost: 2000,
    revenue: 15400,
    conversions: 87,
    color: '#9C27B0',
  },
];

export const mockChannelPerformance: ChannelPerformance[] = [
  {
    id: 'cp-linkedin',
    name: 'LinkedIn 广告',
    icon: 'ri-linkedin-fill',
    impressions: 320000,
    clicks: 18500,
    ctr: 5.78,
    conversions: 342,
    conversionRate: 1.85,
    cost: 18500,
    cpc: 1.0,
    cpa: 54.09,
    revenue: 72000,
    roas: 3.89,
    trend: 'up',
  },
  {
    id: 'cp-email',
    name: '邮件序列',
    icon: 'ri-mail-line',
    impressions: 85000,
    clicks: 12400,
    ctr: 14.59,
    conversions: 285,
    conversionRate: 2.3,
    cost: 8500,
    cpc: 0.69,
    cpa: 29.82,
    revenue: 48000,
    roas: 5.65,
    trend: 'up',
  },
  {
    id: 'cp-content',
    name: '内容营销',
    icon: 'ri-article-line',
    impressions: 280000,
    clicks: 9600,
    ctr: 3.43,
    conversions: 210,
    conversionRate: 2.19,
    cost: 12000,
    cpc: 1.25,
    cpa: 57.14,
    revenue: 38000,
    roas: 3.17,
    trend: 'neutral',
  },
  {
    id: 'cp-twitter',
    name: 'Twitter/X',
    icon: 'ri-twitter-x-fill',
    impressions: 195000,
    clicks: 8200,
    ctr: 4.21,
    conversions: 128,
    conversionRate: 1.56,
    cost: 5500,
    cpc: 0.67,
    cpa: 42.97,
    revenue: 18600,
    roas: 3.38,
    trend: 'down',
  },
];

export const mockReportTemplates: WeeklyReportTemplate[] = [
  {
    id: 'rt-1',
    name: '增长周报（标准版）',
    description: '包含 KPI 概览、渠道表现、归因分析、下周预测',
    icon: 'ri-file-chart-line',
    sections: ['KPI 总览', '渠道分解', '归因分析', 'AI 洞察', '下周建议'],
    lastGenerated: '2026-06-28',
  },
  {
    id: 'rt-2',
    name: '高管摘要',
    description: '精简版报告，聚焦核心增长指标和战略建议',
    icon: 'ri-vip-crown-line',
    sections: ['核心指标', '关键发现', '战略建议'],
    lastGenerated: '2026-06-25',
  },
  {
    id: 'rt-3',
    name: '渠道效能报告',
    description: '深入分析各渠道 ROI、CPA、转化漏斗',
    icon: 'ri-bar-chart-grouped-line',
    sections: ['渠道对比', 'ROAS 排名', 'CPA 趋势', '优化建议'],
  },
  {
    id: 'rt-4',
    name: '战役复盘报告',
    description: '针对已完成战役的全面复盘与经验总结',
    icon: 'ri-flag-2-line',
    sections: ['战役目标', '执行过程', '数据回顾', '经验总结', '改进建议'],
  },
];

export const mockAIInsights: AIInsightItem[] = [
  {
    id: 'ins-1',
    type: 'discovery',
    title: 'LinkedIn 渠道归因权重上升',
    content: '近 4 周 LinkedIn 在多触点归因模型中的贡献从 30% 上升至 35%，首次触点贡献也从 28% 升至 32%。LinkedIn 正成为最有效的线索引入渠道。',
    confidence: 91,
    relatedMetric: 'LinkedIn 广告',
    actionable: true,
    actionText: '调整 LinkedIn 预算分配',
  },
  {
    id: 'ins-2',
    type: 'opportunity',
    title: '邮件序列转化窗口收窄',
    content: '邮件序列 3-7 天的转化窗口仍在缩小，目前 68% 的转化发生在邮件发送后 48 小时内。建议将序列频率从每周 1 封调整为每 3 天 1 封。',
    confidence: 85,
    relatedMetric: '邮件序列',
    actionable: true,
    actionText: '优化发送频率',
  },
  {
    id: 'ins-3',
    type: 'warning',
    title: 'Twitter/X 渠道 CPA 持续上升',
    content: 'Twitter/X 渠道过去 6 周 CPA 从 $35 上升至 $43，同时转化率从 1.9% 下降至 1.56%。ROAS 已跌破 3.5x 警戒线，建议审查投放策略。',
    confidence: 88,
    relatedMetric: 'Twitter/X',
    actionable: true,
    actionText: '查看 Twitter 投放分析',
  },
  {
    id: 'ins-4',
    type: 'anomaly',
    title: '7月 W2 出现异常转化峰值',
    content: '7月 W2 单周转化达 320，超出预测区间上限 15%。检测到该周 LinkedIn 两条帖子出现病毒式传播，带来额外 42 个非广告转化。建议复盘传播策略。',
    confidence: 79,
    relatedMetric: '总转化数',
    actionable: true,
    actionText: '复盘 7月 W2 数据',
  },
  {
    id: 'ins-5',
    type: 'discovery',
    title: '内容营销长尾效应显现',
    content: '3 个月前发布的白皮书仍在持续产生线索，每周约 4-6 个新线索来自该内容。建议对 Top 3 长尾内容增加二次投放，放大长尾效应。',
    confidence: 82,
    relatedMetric: '内容营销',
    actionable: true,
    actionText: '查看长尾内容列表',
  },
  {
    id: 'ins-6',
    type: 'opportunity',
    title: 'DACH 市场线下来源漏报严重',
    content: 'DACH 区域 18% 的线索来源被标记为"直接访问"，但交叉分析发现其中 62% 来自线下展会和 Webinar。建议建立 UTM 标准化流程并增加线下溯源二维码。',
    confidence: 76,
    relatedMetric: 'DACH 市场',
    actionable: true,
    actionText: '设置 UTM 规范',
  },
];

export const mockEventStream: EventStreamItem[] = [
  {
    id: 'ev-1',
    type: 'conversion',
    title: 'TechNova Solutions 完成 Demo 预约',
    source: 'LinkedIn 广告',
    channel: 'LinkedIn',
    value: '高意向 (92分)',
    time: '2分钟前',
    isNew: true,
  },
  {
    id: 'ev-2',
    type: 'lead',
    title: 'QuantumLeap GmbH 白皮书下载转化',
    source: '内容营销',
    channel: '官网',
    value: '中意向 (76分)',
    time: '8分钟前',
    isNew: true,
  },
  {
    id: 'ev-3',
    type: 'alert',
    title: 'Twitter/X 渠道 CPA 突破 $45 警戒线',
    source: '系统监控',
    channel: 'Twitter/X',
    value: '$45.20',
    time: '15分钟前',
    isNew: true,
  },
  {
    id: 'ev-4',
    type: 'conversion',
    title: 'NordicFin AS 完成邮件 CTA 点击',
    source: '邮件序列 #3',
    channel: '邮件',
    value: '高意向 (88分)',
    time: '22分钟前',
    isNew: false,
  },
  {
    id: 'ev-5',
    type: 'click',
    title: 'CloudBridge Inc 点击 LinkedIn 重定向广告',
    source: 'LinkedIn 重定向',
    channel: 'LinkedIn',
    value: '第 4 次触达',
    time: '35分钟前',
    isNew: false,
  },
  {
    id: 'ev-6',
    type: 'impression',
    title: 'DACH 地区 LinkedIn 广告曝光突破 50K',
    source: 'LinkedIn 广告',
    channel: 'LinkedIn',
    value: '52,340 曝光',
    time: '1小时前',
    isNew: false,
  },
  {
    id: 'ev-7',
    type: 'conversion',
    title: 'GreenBuild GmbH 注册 Webinar',
    source: 'Webinar 落地页',
    channel: 'Webinar',
    value: '高意向 (90分)',
    time: '2小时前',
    isNew: false,
  },
  {
    id: 'ev-8',
    type: 'system',
    title: '归因模型完成重算',
    source: '系统自动化',
    channel: '系统',
    value: '12周数据',
    time: '3小时前',
    isNew: false,
  },
  {
    id: 'ev-9',
    type: 'conversion',
    title: 'DataVista Analytics 提交联系表单',
    source: '官网落地页',
    channel: '官网',
    value: '中意向 (74分)',
    time: '4小时前',
    isNew: false,
  },
  {
    id: 'ev-10',
    type: 'lead',
    title: 'PacificTrade Corp 线索自动分配至 Leo',
    source: '线索引擎',
    channel: '系统',
    value: 'SLA: 4小时',
    time: '5小时前',
    isNew: false,
  },
];