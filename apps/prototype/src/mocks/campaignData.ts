export interface Campaign {
  id: string;
  name: string;
  goal: string;
  status: 'active' | 'draft' | 'completed' | 'paused';
  progress: number;
  startDate: string;
  endDate: string;
  owner: string;
  budget: string;
  channels: string[];
  leads: number;
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

export const mockCampaigns: Campaign[] = [
  {
    id: 'c1',
    name: 'Q3 北美 B2B 增长战役',
    goal: '获取 200 条高质量销售线索，覆盖北美 SaaS 和智能制造行业',
    status: 'active',
    progress: 62,
    startDate: '2026-07-01',
    endDate: '2026-09-30',
    owner: 'Leo Chen',
    budget: '$45,000',
    channels: ['LinkedIn', 'Twitter', 'Email', 'Content'],
    leads: 127,
    content: 24,
  },
  {
    id: 'c2',
    name: 'DACH 市场本地化内容战役',
    goal: '建立德语区品牌认知，覆盖德奥瑞三国 B2B 决策者',
    status: 'active',
    progress: 35,
    startDate: '2026-07-15',
    endDate: '2026-10-15',
    owner: 'Mia Wang',
    budget: '€30,000',
    channels: ['LinkedIn', 'Email', 'Webinar'],
    leads: 43,
    content: 18,
  },
  {
    id: 'c3',
    name: '东南亚 SaaS 获客战役',
    goal: '在新加坡和印尼获取 100 家 SaaS 企业客户',
    status: 'draft',
    progress: 15,
    startDate: '2026-08-01',
    endDate: '2026-09-30',
    owner: 'David Liu',
    budget: '$25,000',
    channels: ['LinkedIn', 'WhatsApp', 'Email'],
    leads: 0,
    content: 8,
  },
  {
    id: 'c4',
    name: 'Q2 英国金融科技获客',
    goal: '触达英国 Top 50 金融科技公司技术决策者',
    status: 'completed',
    progress: 100,
    startDate: '2026-04-01',
    endDate: '2026-06-30',
    owner: 'Sarah Zhang',
    budget: '£20,000',
    channels: ['LinkedIn', 'Email', 'Events'],
    leads: 218,
    content: 31,
  },
];

export const mockStages: CampaignStage[] = [
  {
    id: 's1',
    name: '市场研究与 ICP 定义',
    order: 1,
    status: 'completed',
    progress: 100,
    tasks: [
      { id: 't1', title: '北美 SaaS 市场 TAM/SAM/SOM 分析', assignee: 'Leo Chen', assigneeAvatar: 'L', status: 'completed', priority: 'high', dueDate: '2026-07-05', tags: ['Research', 'ICP'], description: '完成北美市场总量分析，确认可触达市场规模。' },
      { id: 't2', title: '竞品定位与差异化分析', assignee: 'Mia Wang', assigneeAvatar: 'M', status: 'completed', priority: 'high', dueDate: '2026-07-08', tags: ['Competitor'], description: '分析 5 家直接竞品在北美市场的定位策略。' },
      { id: 't3', title: '生成 3 个 ICP 草案', assignee: 'Leo Chen', assigneeAvatar: 'L', status: 'completed', priority: 'medium', dueDate: '2026-07-10', tags: ['ICP', 'AI'], description: 'AI 自动生成 3 个理想客户画像，等待确认。' },
    ],
  },
  {
    id: 's2',
    name: '内容策划与生产',
    order: 2,
    status: 'in_progress',
    progress: 70,
    tasks: [
      { id: 't4', title: '英文官网首页文案本地化', assignee: 'Mia Wang', assigneeAvatar: 'M', status: 'completed', priority: 'high', dueDate: '2026-07-12', tags: ['Content', 'Localization'] },
      { id: 't5', title: 'LinkedIn 内容日历排期', assignee: 'David Liu', assigneeAvatar: 'D', status: 'completed', priority: 'high', dueDate: '2026-07-15', tags: ['Content', 'Calendar'] },
      { id: 't6', title: '行业白皮书《北美 SaaS 增长指南》', assignee: 'Mia Wang', assigneeAvatar: 'M', status: 'in_progress', priority: 'high', dueDate: '2026-07-20', tags: ['Content', 'Lead-Magnet'] },
      { id: 't7', title: '邮件序列 1-5 封设计与审批', assignee: 'Sarah Zhang', assigneeAvatar: 'S', status: 'in_progress', priority: 'medium', dueDate: '2026-07-22', tags: ['Email', 'Sequence'] },
      { id: 't8', title: '客户案例视频脚本（3 支）', assignee: 'David Liu', assigneeAvatar: 'D', status: 'pending', priority: 'medium', dueDate: '2026-07-25', tags: ['Video', 'Case-Study'] },
    ],
  },
  {
    id: 's3',
    name: '渠道触达与分发',
    order: 3,
    status: 'in_progress',
    progress: 40,
    tasks: [
      { id: 't9', title: 'LinkedIn 企业页内容发布', assignee: 'Leo Chen', assigneeAvatar: 'L', status: 'in_progress', priority: 'high', dueDate: '2026-07-18', tags: ['LinkedIn', 'Publish'] },
      { id: 't10', title: 'Twitter/X 内容同步分发', assignee: 'David Liu', assigneeAvatar: 'D', status: 'pending', priority: 'medium', dueDate: '2026-07-20', tags: ['Twitter', 'Publish'] },
      { id: 't11', title: '邮件序列自动化部署', assignee: 'Sarah Zhang', assigneeAvatar: 'S', status: 'pending', priority: 'high', dueDate: '2026-07-22', tags: ['Email', 'Automation'] },
    ],
  },
  {
    id: 's4',
    name: '互动管理与线索培育',
    order: 4,
    status: 'pending',
    progress: 0,
    tasks: [
      { id: 't12', title: '评论与私信响应 SLA 设定', assignee: 'Leo Chen', assigneeAvatar: 'L', status: 'pending', priority: 'high', dueDate: '2026-07-25', tags: ['Engagement', 'SLA'] },
      { id: 't13', title: '高意向互动自动转线索', assignee: 'David Liu', assigneeAvatar: 'D', status: 'pending', priority: 'high', dueDate: '2026-07-28', tags: ['Lead', 'Automation'] },
      { id: 't14', title: '线索评分模型配置', assignee: 'Sarah Zhang', assigneeAvatar: 'S', status: 'pending', priority: 'medium', dueDate: '2026-07-30', tags: ['Lead', 'Scoring'] },
    ],
  },
  {
    id: 's5',
    name: '效果归因与优化',
    order: 5,
    status: 'pending',
    progress: 0,
    tasks: [
      { id: 't15', title: '统一事件追踪部署', assignee: 'Leo Chen', assigneeAvatar: 'L', status: 'pending', priority: 'medium', dueDate: '2026-08-05', tags: ['Analytics', 'Tracking'] },
      { id: 't16', title: '归因模型配置与测试', assignee: 'Mia Wang', assigneeAvatar: 'M', status: 'pending', priority: 'medium', dueDate: '2026-08-10', tags: ['Analytics', 'Attribution'] },
      { id: 't17', title: '第一周数据复盘报告', assignee: 'Leo Chen', assigneeAvatar: 'L', status: 'pending', priority: 'low', dueDate: '2026-08-15', tags: ['Report', 'Review'] },
    ],
  },
];

export const mockActivities: ActivityItem[] = [
  { id: 'a1', user: 'Mia Wang', userAvatar: 'M', action: '完成了任务', target: '英文官网首页文案本地化', time: '10分钟前', type: 'update' },
  { id: 'a2', user: 'AI 助手', userAvatar: 'AI', action: '自动生成了', target: '3 条 LinkedIn 帖子内容', time: '25分钟前', type: 'create' },
  { id: 'a3', user: 'Leo Chen', userAvatar: 'L', action: '审批通过了', target: 'Q3 北美 B2B 增长战役计划', time: '1小时前', type: 'approve' },
  { id: 'a4', user: 'David Liu', userAvatar: 'D', action: '发布了', target: 'LinkedIn 企业页内容', time: '2小时前', type: 'publish' },
  { id: 'a5', user: 'Sarah Zhang', userAvatar: 'S', action: '评论了', target: '行业白皮书草案', time: '3小时前', type: 'comment' },
  { id: 'a6', user: '系统', userAvatar: 'S', action: '检测到', target: '3 条内容发布失败，API 限流', time: '4小时前', type: 'alert' },
  { id: 'a7', user: 'Leo Chen', userAvatar: 'L', action: '创建了', target: '客户 TechNova Solutions 跟进任务', time: '5小时前', type: 'create' },
  { id: 'a8', user: 'AI 助手', userAvatar: 'AI', action: '推荐了', target: '10 家新的高匹配潜客', time: '6小时前', type: 'create' },
];

export const mockAIInsights: AIInsight[] = [
  {
    id: 'ai1',
    type: 'suggestion',
    title: '内容发布时机建议',
    content: '根据北美时区 LinkedIn 活跃数据分析，建议在周二至周四上午 9-11 点（EST）发布内容，可获得最高互动率。当前排期中有 3 条帖子安排在周一发布，建议调整。',
    confidence: 89,
    relatedTo: 'LinkedIn 内容日历排期',
    actionable: true,
    actionText: '一键调整排期',
  },
  {
    id: 'ai2',
    type: 'evidence',
    title: 'TechNova Solutions 信号更新',
    content: '检测到 TechNova Solutions 今日在 LinkedIn 发布了 CTO 职位招聘，技术栈要求中明确提到了与您产品兼容的数据分析平台。这是高意向转化信号。',
    confidence: 94,
    relatedTo: '客户 TechNova Solutions',
    actionable: true,
    actionText: '生成跟进话术',
  },
  {
    id: 'ai3',
    type: 'warning',
    title: '预算使用预警',
    content: '当前战役已使用预算的 68%，但仅完成了 62% 的进度。按此节奏，预算可能在第 8 周耗尽。建议审查高成本渠道（Events 占比 40%）的投入产出比。',
    confidence: 85,
    relatedTo: '战役预算',
    actionable: true,
    actionText: '查看预算明细',
  },
  {
    id: 'ai4',
    type: 'suggestion',
    title: '邮件序列优化建议',
    content: '基于历史 A/B 测试数据，第 3 封邮件的 CTA 按钮文案 "立即预约演示" 比 "了解更多" 的点击率高出 34%。建议统一使用行动导向的 CTA 文案。',
    confidence: 78,
    relatedTo: '邮件序列 1-5 封',
    actionable: true,
    actionText: '应用优化建议',
  },
  {
    id: 'ai5',
    type: 'risk',
    title: '合规风险提示',
    content: '行业白皮书中的 GDPR 引用段落需要更新至最新版本（2026 年 5 月修订版）。当前版本可能因引用过期法规而产生合规风险。',
    confidence: 92,
    relatedTo: '行业白皮书',
    actionable: true,
    actionText: '查看合规详情',
  },
];