export interface ContentItem {
  id: string;
  title: string;
  type: 'blog' | 'social' | 'email' | 'whitepaper' | 'video' | 'landing' | 'case-study';
  status: 'draft' | 'review' | 'approved' | 'published' | 'archived';
  language: string;
  targetMarket: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  complianceScore: number;
  tags: string[];
}

export interface LocalizationRecord {
  id: string;
  contentId: string;
  mode: 'translation' | 'transcreation' | 'cultural_adaptation' | 'compliance_rewrite';
  sourceText: string;
  adaptedText: string;
  aiExplanation: string;
  targetLanguage: string;
  targetMarket: string;
  confidence: number;
}

export interface ComplianceIssue {
  id: string;
  contentId: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  suggestion: string;
  field: string;
  checkedAt: string;
}

export interface ContentAIInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'evidence' | 'risk';
  title: string;
  content: string;
  confidence: number;
  actionable: boolean;
  actionText?: string;
}

export interface ContentActivity {
  id: string;
  user: string;
  userAvatar: string;
  action: string;
  target: string;
  time: string;
  type: 'create' | 'update' | 'approve' | 'publish' | 'comment' | 'alert' | 'compliance';
}

export const mockContentItems: ContentItem[] = [
  {
    id: 'ct1',
    title: '北美 SaaS 市场增长白皮书',
    type: 'whitepaper',
    status: 'published',
    language: 'en',
    targetMarket: 'North America',
    author: 'Mia Wang',
    authorAvatar: 'M',
    createdAt: '2026-06-15',
    updatedAt: '2026-07-01',
    wordCount: 4500,
    complianceScore: 98,
    tags: ['Whitepaper', 'SaaS', 'Lead-Magnet'],
  },
  {
    id: 'ct2',
    title: 'LinkedIn: 3 Ways AI Boosts Manufacturing',
    type: 'social',
    status: 'published',
    language: 'en',
    targetMarket: 'North America',
    author: 'David Liu',
    authorAvatar: 'D',
    createdAt: '2026-06-28',
    updatedAt: '2026-06-30',
    wordCount: 180,
    complianceScore: 95,
    tags: ['LinkedIn', 'AI', 'Manufacturing'],
  },
  {
    id: 'ct3',
    title: '邮件序列: DACH 市场暖场 5 封',
    type: 'email',
    status: 'review',
    language: 'de',
    targetMarket: 'DACH',
    author: 'Mia Wang',
    authorAvatar: 'M',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-02',
    wordCount: 1200,
    complianceScore: 72,
    tags: ['Email', 'Sequence', 'DACH'],
  },
  {
    id: 'ct4',
    title: '官网英文首页文案 (v3)',
    type: 'landing',
    status: 'approved',
    language: 'en',
    targetMarket: 'Global',
    author: 'Mia Wang',
    authorAvatar: 'M',
    createdAt: '2026-06-20',
    updatedAt: '2026-06-29',
    wordCount: 850,
    complianceScore: 100,
    tags: ['Website', 'Localization'],
  },
  {
    id: 'ct5',
    title: 'Twitter/X: GDPR Compliance for SaaS',
    type: 'social',
    status: 'draft',
    language: 'en',
    targetMarket: 'Europe',
    author: 'Sarah Zhang',
    authorAvatar: 'S',
    createdAt: '2026-07-02',
    updatedAt: '2026-07-02',
    wordCount: 240,
    complianceScore: 60,
    tags: ['Twitter', 'GDPR', 'Compliance'],
  },
  {
    id: 'ct6',
    title: '东南亚制造业 AI 案例视频脚本',
    type: 'video',
    status: 'draft',
    language: 'en',
    targetMarket: 'Southeast Asia',
    author: 'David Liu',
    authorAvatar: 'D',
    createdAt: '2026-06-25',
    updatedAt: '2026-07-01',
    wordCount: 650,
    complianceScore: 88,
    tags: ['Video', 'Case-Study'],
  },
  {
    id: 'ct7',
    title: '博客: How Chinese SaaS Wins in Europe',
    type: 'blog',
    status: 'review',
    language: 'en',
    targetMarket: 'Europe',
    author: 'Leo Chen',
    authorAvatar: 'L',
    createdAt: '2026-06-28',
    updatedAt: '2026-07-01',
    wordCount: 2200,
    complianceScore: 85,
    tags: ['Blog', 'Thought-Leadership'],
  },
  {
    id: 'ct8',
    title: '德国产品介绍落地页',
    type: 'landing',
    status: 'draft',
    language: 'de',
    targetMarket: 'DACH',
    author: 'Mia Wang',
    authorAvatar: 'M',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-02',
    wordCount: 720,
    complianceScore: 55,
    tags: ['Landing', 'German', 'Localization'],
  },
];

export const mockLocalizations: LocalizationRecord[] = [
  {
    id: 'loc1',
    contentId: 'ct4',
    mode: 'cultural_adaptation',
    sourceText: '我们为企业提供一站式 AI 驱动的增长解决方案，帮助您在全球市场中脱颖而出。',
    adaptedText:
      'We empower enterprises with an all-in-one, AI-driven growth platform — built to help you lead, not just compete, in global markets.',
    aiExplanation:
      '英文受众对 "一站式" 的直译 "one-stop" 已有审美疲劳。改用 "all-in-one" 更自然。"脱颖而出" 按文化适配转为 "lead, not just compete"，更符合北美自信表达风格。',
    targetLanguage: 'en',
    targetMarket: 'North America',
    confidence: 92,
  },
  {
    id: 'loc2',
    contentId: 'ct4',
    mode: 'compliance_rewrite',
    sourceText: '我们的 AI 引擎基于深度学习技术，能够预测客户行为模式并自动优化营销策略。',
    adaptedText:
      'Our AI engine leverages machine learning to identify engagement patterns and refine outreach strategies — all while maintaining full compliance with GDPR and CCPA data protection standards.',
    aiExplanation:
      '原文 "深度学习" 在欧洲需避免夸大技术声明。"预测客户行为" 在 DACH 市场可能引发数据隐私顾虑。加入 GDPR/CCPA 合规声明可降低法务风险。',
    targetLanguage: 'en',
    targetMarket: 'Europe',
    confidence: 88,
  },
  {
    id: 'loc3',
    contentId: 'ct8',
    mode: 'translation',
    sourceText: '领先的智能制造质量管理平台',
    adaptedText: 'Führende Qualitätsmanagement-Plattform für intelligente Fertigung',
    aiExplanation:
      '直译保留了原文结构。"智能制造" → "intelligente Fertigung" 是 DACH 工业领域标准术语，符合目标受众专业语境。',
    targetLanguage: 'de',
    targetMarket: 'DACH',
    confidence: 95,
  },
  {
    id: 'loc4',
    contentId: 'ct8',
    mode: 'cultural_adaptation',
    sourceText: '服务超过 500 家企业客户，覆盖 30+ 行业',
    adaptedText:
      'Vertrauen von über 500 Unternehmen aus mehr als 30 Branchen — zertifiziert nach ISO 9001 und TÜV-geprüft.',
    aiExplanation:
      'DACH 市场的 B2B 买家对认证和第三方验证高度敏感。添加 ISO 9001 和 TÜV 认证提及可显著提升可信度。"企业客户" 改为 "Unternehmen" 更符合德语商务习惯。',
    targetLanguage: 'de',
    targetMarket: 'DACH',
    confidence: 91,
  },
  {
    id: 'loc5',
    contentId: 'ct3',
    mode: 'transcreation',
    sourceText: '您好，我们是 XXX 公司，很高兴为您介绍我们的产品...',
    adaptedText:
      'Hallo [Vorname], ich habe Ihre Arbeit bei [Unternehmen] verfolgt — insbesondere [spezifische Erwähnung]. Darf ich Ihnen eine kurze Analyse zusenden, wie wir ähnlichen Teams zu 34% mehr qualifizierten Leads verholfen haben?',
    aiExplanation:
      '原文为中式商务邮件开场，过于正式。DACH 市场偏好个性化 + 数据驱动的开场，直接引用具体成果数字可提升 3x 回复率。"转写"模式在保留核心意图的同时重构了表达方式。',
    targetLanguage: 'de',
    targetMarket: 'DACH',
    confidence: 86,
  },
];

export const mockComplianceIssues: ComplianceIssue[] = [
  {
    id: 'comp1',
    contentId: 'ct8',
    severity: 'critical',
    title: '缺少 Impressum 声明',
    description:
      '德国法律规定，所有商业网站必须包含完整的 Impressum（版本说明）页面，包括公司注册信息、法定代表人、联系方式等。',
    suggestion:
      '在落地页底部添加 Impressum 链接，包含: 公司全称、注册地址、注册号、法定代表人、联系方式、增值税号。',
    field: 'footer',
    checkedAt: '2026-07-02',
  },
  {
    id: 'comp2',
    contentId: 'ct8',
    severity: 'critical',
    title: '缺少 GDPR Cookie 同意机制',
    description:
      '欧盟 GDPR 要求网站在设置任何非必要 Cookie 前，必须获得用户明确同意。当前页面未检测到 Cookie Consent Banner。',
    suggestion:
      '集成符合 GDPR 标准的 Cookie Consent 弹窗，区分必要/统计/营销 Cookie 类别，并提供拒绝选项。',
    field: 'privacy',
    checkedAt: '2026-07-02',
  },
  {
    id: 'comp3',
    contentId: 'ct3',
    severity: 'warning',
    title: '邮件退订链接格式不符合德国标准',
    description:
      '德国反不正当竞争法 (UWG) 要求营销邮件中的退订链接必须清晰可见，不能隐藏或使用微小字体。',
    suggestion:
      '将退订链接移至邮件底部显眼位置，使用至少 12px 字体，文案改为 "Newsletter abbestellen" 并在 24 小时内处理退订请求。',
    field: 'email_footer',
    checkedAt: '2026-07-02',
  },
  {
    id: 'comp4',
    contentId: 'ct5',
    severity: 'warning',
    title: 'GDPR 术语版本过期',
    description:
      '内容中引用的 GDPR 条款基于 2024 年版本。2026 年 5 月修订版已更新 "legitimate interest" 的解释范围和跨境数据传输要求。',
    suggestion:
      '更新所有 GDPR 引用至 2026 年 5 月修订版，特别关注 Article 6(1)(f) legitimate interest 和 Article 46 跨境数据传输的最新解释。',
    field: 'content_body',
    checkedAt: '2026-07-02',
  },
  {
    id: 'comp5',
    contentId: 'ct5',
    severity: 'info',
    title: '行业术语使用建议',
    description:
      '"AI-powered" 在欧洲市场可能引发过度炒作 (hype) 的负面联想。建议使用更具体的技术能力描述。',
    suggestion:
      '将 "AI-powered" 替换为 "machine learning-driven" 或具体说明算法类型，如 "Transformer-based language processing"。',
    field: 'headline',
    checkedAt: '2026-07-02',
  },
  {
    id: 'comp6',
    contentId: 'ct2',
    severity: 'info',
    title: 'LinkedIn 内容长度接近上限',
    description:
      '当前帖子 180 字，LinkedIn 推荐的最佳阅读长度为 120-150 字。超过该长度可能导致移动端显示截断。',
    suggestion: '精简至 140 字以内，将详细内容移至评论区或链接至博客文章。',
    field: 'content_body',
    checkedAt: '2026-06-30',
  },
];

export const mockContentAIInsights: ContentAIInsight[] = [
  {
    id: 'cai1',
    type: 'suggestion',
    title: 'DACH 市场内容本地化优先级',
    content:
      '基于竞品分析和市场数据，建议优先完成（1）德国产品落地页文化适配、（2）DACH 邮件序列合规改写、（3）德语白皮书翻译。这三个内容将在未来 30 天内产生最高 ROI。',
    confidence: 87,
    actionable: true,
    actionText: '创建本地化任务',
  },
  {
    id: 'cai2',
    type: 'evidence',
    title: '北美 SaaS 白皮书 SEO 表现优异',
    content:
      '已发布的《北美 SaaS 市场增长白皮书》在 Google 搜索 "SaaS growth guide 2026" 排名第 3，过去 7 天产生了 1,247 次自然下载。建议增加相关的博客文章来捕捉更多长尾搜索流量。',
    confidence: 94,
    actionable: true,
    actionText: '生成关联博客',
  },
  {
    id: 'cai3',
    type: 'warning',
    title: '德国落地页合规风险较高',
    content:
      '德国产品落地页检测到 2 项严重合规问题（缺少 Impressum、无 Cookie 同意机制），2 项警告级别问题。在问题解决前不建议发布，否则可能面临最高 €50,000 的罚款。',
    confidence: 96,
    actionable: true,
    actionText: '查看合规详情',
  },
  {
    id: 'cai4',
    type: 'suggestion',
    title: '内容复用机会',
    content:
      '《北美 SaaS 市场增长白皮书》的核心观点可拆分为 5 条 LinkedIn 帖子 + 1 篇博客文章 + 1 个 60 秒视频脚本。AI 已备好全部初稿，点击即可查看。',
    confidence: 83,
    actionable: true,
    actionText: '查看复用内容',
  },
  {
    id: 'cai5',
    type: 'risk',
    title: '品牌术语一致性风险',
    content:
      '检测到 "AI-driven growth platform" 在 3 篇内容中存在 2 种不同表述（另一个为 "AI-powered growth solution"）。品牌术语不统一可能导致受众混淆，建议锁定术语库。',
    confidence: 79,
    actionable: true,
    actionText: '统一品牌术语',
  },
];

export const mockContentActivities: ContentActivity[] = [
  {
    id: 'ca1',
    user: 'Mia Wang',
    userAvatar: 'M',
    action: '提交了',
    target: '德国产品介绍落地页 等待审批',
    time: '5分钟前',
    type: 'create',
  },
  {
    id: 'ca2',
    user: '合规引擎',
    userAvatar: 'CE',
    action: '检测到',
    target: '德国落地页 2 项严重合规问题',
    time: '5分钟前',
    type: 'compliance',
  },
  {
    id: 'ca3',
    user: 'AI 助手',
    userAvatar: 'AI',
    action: '完成了',
    target: '官网英文首页 文化适配分析',
    time: '15分钟前',
    type: 'update',
  },
  {
    id: 'ca4',
    user: 'Leo Chen',
    userAvatar: 'L',
    action: '审批通过了',
    target: '官网英文首页文案 (v3)',
    time: '30分钟前',
    type: 'approve',
  },
  {
    id: 'ca5',
    user: 'David Liu',
    userAvatar: 'D',
    action: '发布了',
    target: 'LinkedIn: AI Boosts Manufacturing',
    time: '1小时前',
    type: 'publish',
  },
  {
    id: 'ca6',
    user: 'Sarah Zhang',
    userAvatar: 'S',
    action: '评论了',
    target: '邮件序列: DACH 市场暖场第 3 封',
    time: '2小时前',
    type: 'comment',
  },
  {
    id: 'ca7',
    user: 'AI 助手',
    userAvatar: 'AI',
    action: '生成了',
    target: '5 条白皮书关联 LinkedIn 帖子',
    time: '3小时前',
    type: 'create',
  },
  {
    id: 'ca8',
    user: 'David Liu',
    userAvatar: 'D',
    action: '更新了',
    target: '东南亚制造业案例视频脚本',
    time: '4小时前',
    type: 'update',
  },
];
