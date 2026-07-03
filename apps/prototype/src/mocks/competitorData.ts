export interface Competitor {
  id: string;
  name: string;
  logo: string;
  industry: string;
  hq: string;
  employees: string;
  revenue: string;
  marketShare: number;
  growthRate: number;
  threatLevel: 'high' | 'medium' | 'low';
  sentiment: number;
  recentMentions: number;
  lastActivity: string;
  positioning: string;
  strengths: string[];
  weaknesses: string[];
}

export interface MarketTrend {
  id: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  trend: 'up' | 'down' | 'stable';
  category: string;
  description: string;
  date: string;
}

export interface FeatureComparison {
  feature: string;
  us: 'yes' | 'partial' | 'no';
  competitorA: 'yes' | 'partial' | 'no';
  competitorB: 'yes' | 'partial' | 'no';
  competitorC: 'yes' | 'partial' | 'no';
}

export interface CompetitorAlert {
  id: string;
  competitor: string;
  type: 'product' | 'pricing' | 'campaign' | 'hiring' | 'funding';
  title: string;
  date: string;
  severity: 'critical' | 'warning' | 'info';
}

export const competitors: Competitor[] = [
  {
    id: '1',
    name: 'Demandbase',
    logo: 'D',
    industry: 'B2B 营销技术',
    hq: '旧金山, 美国',
    employees: '500-1000',
    revenue: '$180M+',
    marketShare: 18.5,
    growthRate: 12.3,
    threatLevel: 'high',
    sentiment: 72,
    recentMentions: 342,
    lastActivity: '2 小时前',
    positioning: '企业级 ABM 平台，专注大型跨国企业',
    strengths: ['强大的广告网络整合', '企业级客户基础稳固', 'AI 预测能力突出'],
    weaknesses: ['价格门槛高', '中小企业适配差', '实施周期长'],
  },
  {
    id: '2',
    name: '6sense',
    logo: '6',
    industry: 'B2B 意图数据',
    hq: '旧金山, 美国',
    employees: '1000+',
    revenue: '$250M+',
    marketShare: 22.1,
    growthRate: 28.7,
    threatLevel: 'high',
    sentiment: 78,
    recentMentions: 518,
    lastActivity: '45 分钟前',
    positioning: '意图驱动营销领导者，重投放场景',
    strengths: ['意图数据覆盖广', '广告投放 ROI 高', '北美市场渗透深'],
    weaknesses: ['海外市场弱', '内容营销功能欠缺', '定价不透明'],
  },
  {
    id: '3',
    name: 'Apollo.io',
    logo: 'A',
    industry: '销售智能平台',
    hq: '旧金山, 美国',
    employees: '500+',
    revenue: '$80M+',
    marketShare: 8.3,
    growthRate: 45.2,
    threatLevel: 'medium',
    sentiment: 65,
    recentMentions: 189,
    lastActivity: '3 小时前',
    positioning: '中小型企业友好的销售触达工具',
    strengths: ['数据库规模大', '定价灵活', '上手简单'],
    weaknesses: ['数据质量参差', '合规风险高', '缺乏深度分析'],
  },
  {
    id: '4',
    name: 'ZoomInfo',
    logo: 'Z',
    industry: 'B2B 数据平台',
    hq: '温哥华, 加拿大',
    employees: '3000+',
    revenue: '$1.2B+',
    marketShare: 35.2,
    growthRate: 8.1,
    threatLevel: 'medium',
    sentiment: 58,
    recentMentions: 623,
    lastActivity: '1 小时前',
    positioning: '企业级 B2B 联系人数据库领导者',
    strengths: ['数据覆盖最全', '企业级服务成熟', '多渠道整合'],
    weaknesses: ['价格极贵', '数据更新慢', '客户满意度下滑'],
  },
  {
    id: '5',
    name: 'Cognism',
    logo: 'C',
    industry: '销售智能平台',
    hq: '伦敦, 英国',
    employees: '200-500',
    revenue: '$30M+',
    marketShare: 4.7,
    growthRate: 62.1,
    threatLevel: 'low',
    sentiment: 71,
    recentMentions: 134,
    lastActivity: '6 小时前',
    positioning: '欧洲市场合规数据提供商',
    strengths: ['GDPR 合规领先', '欧洲数据准确', '移动端体验好'],
    weaknesses: ['北美数据弱', '功能相对单一', '品牌知名度低'],
  },
];

export const marketTrends: MarketTrend[] = [
  {
    id: '1',
    title: 'AI 驱动的个性化触达成为 B2B 营销标配',
    impact: 'high',
    trend: 'up',
    category: '技术趋势',
    description:
      '超过 73% 的 B2B 企业计划在 2026 年前部署 AI 个性化触达工具，市场渗透率将提升 40%。',
    date: '2025-06-30',
  },
  {
    id: '2',
    title: 'GDPR 3.0 草案加强跨境数据流转限制',
    impact: 'high',
    trend: 'down',
    category: '监管变化',
    description: '欧盟新草案要求 B2B 数据平台在跨境传输时必须获得双重同意，合规成本预计上升 25%。',
    date: '2025-06-28',
  },
  {
    id: '3',
    title: '东南亚市场成为 B2B SaaS 增长新引擎',
    impact: 'medium',
    trend: 'up',
    category: '市场机会',
    description: '新加坡、印尼和越南的 B2B SaaS 支出年增长率达 34%，远超全球平均的 18%。',
    date: '2025-06-25',
  },
  {
    id: '4',
    title: 'LinkedIn 广告 CPM 上涨 23%，ROI 承压',
    impact: 'medium',
    trend: 'down',
    category: '渠道变化',
    description: 'LinkedIn 广告 CPM 在 Q2 2025 平均上涨 23%，广告主开始转向组合渠道策略。',
    date: '2025-06-22',
  },
  {
    id: '5',
    title: '多触点归因模型采用率突破 50%',
    impact: 'low',
    trend: 'up',
    category: '技术趋势',
    description: '企业级 B2B 营销中多触点归因模型的采用率首次超过 50%，末次触点模型份额降至 38%。',
    date: '2025-06-20',
  },
  {
    id: '6',
    title: '冷邮件平均打开率跌至 21.5%',
    impact: 'medium',
    trend: 'down',
    category: '渠道变化',
    description: '全球冷邮件平均打开率连续三个季度下滑，超个性化和多媒体内容成为破局关键。',
    date: '2025-06-18',
  },
];

export const featureComparisons: FeatureComparison[] = [
  {
    feature: '跨平台统一 Inbox',
    us: 'yes',
    competitorA: 'yes',
    competitorB: 'partial',
    competitorC: 'no',
  },
  {
    feature: 'AI 跟进话术生成',
    us: 'yes',
    competitorA: 'no',
    competitorB: 'no',
    competitorC: 'no',
  },
  {
    feature: '多语言内容合规检查',
    us: 'yes',
    competitorA: 'no',
    competitorB: 'no',
    competitorC: 'partial',
  },
  {
    feature: '动态 ICP 画像构建',
    us: 'yes',
    competitorA: 'yes',
    competitorB: 'partial',
    competitorC: 'no',
  },
  {
    feature: '战役归因模型可视化',
    us: 'yes',
    competitorA: 'partial',
    competitorB: 'no',
    competitorC: 'no',
  },
  { feature: '周报自动生成', us: 'yes', competitorA: 'no', competitorB: 'no', competitorC: 'no' },
  {
    feature: 'LinkedIn 自动化序列',
    us: 'yes',
    competitorA: 'yes',
    competitorB: 'yes',
    competitorC: 'yes',
  },
  {
    feature: '邮件 A/B 测试',
    us: 'yes',
    competitorA: 'yes',
    competitorB: 'yes',
    competitorC: 'yes',
  },
  {
    feature: 'CRM 双向同步',
    us: 'yes',
    competitorA: 'yes',
    competitorB: 'yes',
    competitorC: 'yes',
  },
  { feature: '竞品监控与告警', us: 'yes', competitorA: 'no', competitorB: 'no', competitorC: 'no' },
  {
    feature: '意图数据集成',
    us: 'partial',
    competitorA: 'yes',
    competitorB: 'yes',
    competitorC: 'no',
  },
  {
    feature: '广告投放管理',
    us: 'partial',
    competitorA: 'yes',
    competitorB: 'yes',
    competitorC: 'partial',
  },
];

export const competitorAlerts: CompetitorAlert[] = [
  {
    id: '1',
    competitor: '6sense',
    type: 'funding',
    title: '完成 E 轮 $200M 融资，估值突破 $5B',
    date: '2025-06-29',
    severity: 'critical',
  },
  {
    id: '2',
    competitor: 'Demandbase',
    type: 'product',
    title: '发布 AI Copilot 功能，支持自然语言查询',
    date: '2025-06-28',
    severity: 'warning',
  },
  {
    id: '3',
    competitor: 'Apollo.io',
    type: 'pricing',
    title: 'Pro 套餐降价 30%，入门版免费化',
    date: '2025-06-27',
    severity: 'critical',
  },
  {
    id: '4',
    competitor: 'Cognism',
    type: 'campaign',
    title: '启动北美市场扩张计划，目标 Q4 上线',
    date: '2025-06-25',
    severity: 'warning',
  },
  {
    id: '5',
    competitor: 'ZoomInfo',
    type: 'hiring',
    title: '在新加坡组建亚太数据团队（50+ 岗位）',
    date: '2025-06-24',
    severity: 'info',
  },
  {
    id: '6',
    competitor: '6sense',
    type: 'product',
    title: '收购欧洲意图数据提供商 LeadSift',
    date: '2025-06-22',
    severity: 'warning',
  },
  {
    id: '7',
    competitor: 'Demandbase',
    type: 'pricing',
    title: '推出中小企业套餐，月费降至 $499',
    date: '2025-06-20',
    severity: 'warning',
  },
];
