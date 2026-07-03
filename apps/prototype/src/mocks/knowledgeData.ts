export interface KnowledgeDoc {
  id: string;
  title: string;
  type: 'article' | 'guide' | 'playbook' | 'template' | 'faq';
  category: string;
  tags: string[];
  author: string;
  authorAvatar: string;
  updatedAt: string;
  readTime: string;
  views: number;
  bookmarks: number;
  isBookmarked: boolean;
  summary: string;
}

export interface KnowledgeCategory {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export const knowledgeCategories: KnowledgeCategory[] = [
  { id: 'playbook', name: '战役剧本', count: 14, icon: 'ri-book-open-line' },
  { id: 'icp', name: 'ICP 指南', count: 8, icon: 'ri-crosshair-line' },
  { id: 'content', name: '内容模板', count: 22, icon: 'ri-article-line' },
  { id: 'faq', name: '常见问题', count: 36, icon: 'ri-questionnaire-line' },
  { id: 'integration', name: '集成手册', count: 12, icon: 'ri-plug-line' },
  { id: 'analytics', name: '数据洞察', count: 9, icon: 'ri-bar-chart-box-line' },
];

export const knowledgeDocs: KnowledgeDoc[] = [
  {
    id: '1',
    title: 'DACH 地区技术决策者触达最佳实践',
    type: 'playbook',
    category: 'playbook',
    tags: ['DACH', 'LinkedIn', '技术决策者', '德语内容'],
    author: 'Sarah Weber',
    authorAvatar: 'S',
    updatedAt: '2025-06-28',
    readTime: '12 分钟',
    views: 2847,
    bookmarks: 156,
    isBookmarked: true,
    summary:
      '针对德国、奥地利和瑞士地区的技术决策者的完整触达策略，包含本地化内容框架、合规注意事项和渠道优先级排序。',
  },
  {
    id: '2',
    title: '北美 SaaS 企业 ICP 构建手册 v3.0',
    type: 'guide',
    category: 'icp',
    tags: ['北美', 'SaaS', 'ICP', '画像构建'],
    author: 'Leo Chen',
    authorAvatar: 'L',
    updatedAt: '2025-06-25',
    readTime: '18 分钟',
    views: 4120,
    bookmarks: 312,
    isBookmarked: true,
    summary:
      '基于 500+ 北美 SaaS 企业数据的 ICP 构建方法论，包含信号权重模型、评分算法和动态调整策略。',
  },
  {
    id: '3',
    title: '内容合规检查清单（金融与医疗版）',
    type: 'template',
    category: 'content',
    tags: ['合规', '金融', '医疗', 'GDPR', '检查清单'],
    author: 'Anna Kowalski',
    authorAvatar: 'A',
    updatedAt: '2025-06-20',
    readTime: '8 分钟',
    views: 1893,
    bookmarks: 89,
    isBookmarked: false,
    summary:
      '针对金融服务和医疗健康行业的出海内容合规检查清单，覆盖 FDA、SEC、GDPR 和行业特定监管要求。',
  },
  {
    id: '4',
    title: 'LinkedIn 自动化战役：从入门到精通',
    type: 'playbook',
    category: 'playbook',
    tags: ['LinkedIn', '自动化', '战役管理', 'ABM'],
    author: 'David Müller',
    authorAvatar: 'D',
    updatedAt: '2025-06-15',
    readTime: '24 分钟',
    views: 5634,
    bookmarks: 478,
    isBookmarked: true,
    summary:
      '从基础设置到高级 ABM 策略的完整 LinkedIn 自动化战役指南，包含受众细分、消息序列设计和 A/B 测试框架。',
  },
  {
    id: '5',
    title: '多语言邮件序列模板库（EN/DE/FR/JP）',
    type: 'template',
    category: 'content',
    tags: ['邮件', '模板', '多语言', '序列'],
    author: 'Elena Rossi',
    authorAvatar: 'E',
    updatedAt: '2025-06-10',
    readTime: '15 分钟',
    views: 3201,
    bookmarks: 267,
    isBookmarked: false,
    summary:
      '覆盖英语、德语、法语和日语的冷邮件序列模板，包含开场白、跟进节奏和转化触发器，已根据各地文化习惯优化。',
  },
  {
    id: '6',
    title: '如何将 Global Growth Workspace 数据同步到 Salesforce',
    type: 'guide',
    category: 'integration',
    tags: ['Salesforce', 'API', '同步', 'CRM'],
    author: 'James Watanabe',
    authorAvatar: 'J',
    updatedAt: '2025-06-08',
    readTime: '10 分钟',
    views: 1456,
    bookmarks: 98,
    isBookmarked: false,
    summary:
      '逐步指南：配置 Global Growth Workspace 与 Salesforce 的双向同步，包含字段映射、冲突解决和实时 Webhook 设置。',
  },
  {
    id: '7',
    title: '东南亚 DTC 品牌线索评分模型',
    type: 'guide',
    category: 'analytics',
    tags: ['东南亚', 'DTC', '线索评分', '模型'],
    author: 'Lisa Park',
    authorAvatar: 'L',
    updatedAt: '2025-06-05',
    readTime: '14 分钟',
    views: 2134,
    bookmarks: 134,
    isBookmarked: false,
    summary:
      '针对新加坡、马来西亚和印尼市场的 DTC 品牌线索评分模型，结合社交媒体信号和购买意图指标。',
  },
  {
    id: '8',
    title: '内容审批流程与角色权限配置',
    type: 'playbook',
    category: 'playbook',
    tags: ['审批', '权限', '流程', '合规'],
    author: 'Robert Chen',
    authorAvatar: 'R',
    updatedAt: '2025-06-01',
    readTime: '9 分钟',
    views: 1782,
    bookmarks: 112,
    isBookmarked: false,
    summary:
      '标准内容审批流程模板，包含多级审批节点、角色权限矩阵和 SLA 时间要求，适用于中型出海团队。',
  },
  {
    id: '9',
    title: '竞品监控：HubSpot vs Salesforce 定位差异分析',
    type: 'article',
    category: 'analytics',
    tags: ['竞品', 'HubSpot', 'Salesforce', '定位'],
    author: 'Thomas Weber',
    authorAvatar: 'T',
    updatedAt: '2025-05-28',
    readTime: '11 分钟',
    views: 3678,
    bookmarks: 245,
    isBookmarked: true,
    summary: '深度对比 HubSpot 和 Salesforce 的市场定位策略差异，提炼可借鉴的差异化定位方法论。',
  },
  {
    id: '10',
    title: 'Twitter/X 在欧洲合规发帖指南',
    type: 'faq',
    category: 'faq',
    tags: ['Twitter', '合规', '欧洲', '发帖指南'],
    author: 'Carlos Mendez',
    authorAvatar: 'C',
    updatedAt: '2025-05-25',
    readTime: '6 分钟',
    views: 2345,
    bookmarks: 189,
    isBookmarked: false,
    summary: '欧洲 DSA 法案下的社交媒体发帖合规指南，包含标签要求、广告披露和仇恨言论边界界定。',
  },
  {
    id: '11',
    title: 'API 速率限制与错误码速查表',
    type: 'guide',
    category: 'integration',
    tags: ['API', '开发', '速查表', '错误处理'],
    author: 'Michael Anderson',
    authorAvatar: 'M',
    updatedAt: '2025-05-20',
    readTime: '5 分钟',
    views: 892,
    bookmarks: 67,
    isBookmarked: false,
    summary:
      'Global Growth Workspace API 的所有端点速率限制和错误码速查表，包含重试策略和最佳实践建议。',
  },
  {
    id: '12',
    title: '归因模型选择决策树',
    type: 'guide',
    category: 'analytics',
    tags: ['归因', '分析', '决策树', '模型选择'],
    author: 'Leo Chen',
    authorAvatar: 'L',
    updatedAt: '2025-05-18',
    readTime: '16 分钟',
    views: 1567,
    bookmarks: 198,
    isBookmarked: true,
    summary:
      '根据企业规模、渠道组合和销售周期的归因模型选择决策树，包含首次触点、末次触点和多触点模型对比。',
  },
];

export const recentSearches = ['LinkedIn 自动化', 'ICP 画像', '内容合规', '邮件序列', 'API 同步'];
