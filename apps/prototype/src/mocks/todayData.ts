export interface StatItem {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface NextAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'review' | 'approve' | 'publish' | 'respond' | 'analyze';
  time: string;
  campaign?: string;
}

export interface PendingApproval {
  id: string;
  title: string;
  submittedBy: string;
  submittedTime: string;
  type: 'content' | 'campaign' | 'budget' | 'account';
  urgency: 'urgent' | 'normal' | 'low';
}

export interface Anomaly {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
  time: string;
  status: 'new' | 'acknowledged' | 'in_progress';
}

export interface Opportunity {
  id: string;
  company: string;
  signal: string;
  signalDetail: string;
  score: number;
  country: string;
  industry: string;
  time: string;
}

export const mockStats: StatItem[] = [
  { label: '活跃战役', value: '12', change: '+2', trend: 'up', icon: 'ri-flag-2-line' },
  { label: '本周新线索', value: '47', change: '+18%', trend: 'up', icon: 'ri-user-add-line' },
  { label: '内容待发布', value: '8', change: '-3', trend: 'down', icon: 'ri-file-text-line' },
  { label: '互动消息', value: '156', change: '+32%', trend: 'up', icon: 'ri-chat-3-line' },
];

export const mockNextActions: NextAction[] = [
  {
    id: '1',
    title: '审核 Q3 北美市场增长战役计划',
    description: 'AI 已生成完整的战役框架，包含预算分配和时间线，需要您确认后激活。',
    priority: 'high',
    type: 'review',
    time: '2小时前',
    campaign: 'Q3 北美 B2B 增长战役',
  },
  {
    id: '2',
    title: '回复 TechVista 高意向评论',
    description: 'TechVista 在 LinkedIn 帖子下询问产品定价，AI 已准备回复草稿。',
    priority: 'high',
    type: 'respond',
    time: '4小时前',
  },
  {
    id: '3',
    title: '审批 3 条本地化内容',
    description: '德国市场的产品介绍文案已完成文化适配，等待您的最终审批。',
    priority: 'medium',
    type: 'approve',
    time: '6小时前',
    campaign: 'DACH 市场内容计划',
  },
  {
    id: '4',
    title: '发布本周社交媒体内容',
    description: '5 条 LinkedIn 帖子和 3 条 Twitter 内容已排期，确认后即可自动发布。',
    priority: 'medium',
    type: 'publish',
    time: '1天前',
  },
];

export const mockPendingApprovals: PendingApproval[] = [
  {
    id: '1',
    title: '东南亚 SaaS 行业白皮书终稿',
    submittedBy: 'Mia Wang',
    submittedTime: '今天 14:30',
    type: 'content',
    urgency: 'urgent',
  },
  {
    id: '2',
    title: '新增 50 家 DACH 区域潜客导入',
    submittedBy: 'David Liu',
    submittedTime: '今天 11:20',
    type: 'account',
    urgency: 'normal',
  },
  {
    id: '3',
    title: 'Q4 品牌视频制作预算申请',
    submittedBy: 'Sarah Zhang',
    submittedTime: '昨天 16:45',
    type: 'budget',
    urgency: 'low',
  },
];

export const mockAnomalies: Anomaly[] = [
  {
    id: '1',
    title: 'LinkedIn 账号授权即将过期',
    description: '企业主页的 OAuth 授权将在 3 天后过期，届时将无法自动发布内容。',
    severity: 'warning',
    source: '集成中心',
    time: '今天 09:15',
    status: 'new',
  },
  {
    id: '2',
    title: '3 条内容发布失败',
    description: 'Twitter API 限流导致部分内容未能按时发布，已自动加入重试队列。',
    severity: 'critical',
    source: '发布引擎',
    time: '今天 08:00',
    status: 'acknowledged',
  },
  {
    id: '3',
    title: '公司资料完整度仅 65%',
    description: '缺少目标市场合规文件，部分 AI 功能受限。建议补充 GDPR 合规声明。',
    severity: 'info',
    source: '企业知识库',
    time: '昨天 22:10',
    status: 'new',
  },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    company: 'TechNova Solutions',
    signal: '近期融资',
    signalDetail: '完成 B 轮 $45M 融资，正在扩招销售团队',
    score: 92,
    country: '美国',
    industry: '企业软件',
    time: '2天前',
  },
  {
    id: '2',
    company: 'GreenBuild GmbH',
    signal: '技术栈变更',
    signalDetail: '从竞品迁移至兼容技术栈，官网新增 API 集成需求页面',
    score: 87,
    country: '德国',
    industry: '智能制造',
    time: '3天前',
  },
  {
    id: '3',
    company: 'DataVista Analytics',
    signal: '高管变动',
    signalDetail: '新任 CTO 背景为大数据平台，LinkedIn 发布技术选型帖',
    score: 84,
    country: '英国',
    industry: '数据分析',
    time: '4天前',
  },
  {
    id: '4',
    company: 'PacificTrade Corp',
    signal: '社交媒体互动',
    signalDetail: '多位采购经理在 LinkedIn 频繁互动行业内容',
    score: 78,
    country: '新加坡',
    industry: '跨境贸易',
    time: '5天前',
  },
];