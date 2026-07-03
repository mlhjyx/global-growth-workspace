export interface EngagementMessage {
  id: string;
  platform: 'linkedin' | 'twitter' | 'email' | 'facebook';
  type: 'comment' | 'private_message' | 'mention' | 'review';
  sender: {
    name: string;
    avatar: string;
    company: string;
    title: string;
    location: string;
  };
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  intentScore: number;
  intentSignals: string[];
  status: 'new' | 'read' | 'responded' | 'converted' | 'archived';
  assignedTo?: string;
  tags: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface ConversationReply {
  id: string;
  messageId: string;
  from: 'user' | 'sender' | 'ai_suggested';
  senderName?: string;
  body: string;
  timestamp: string;
}

export interface EngagementAIInsight {
  id: string;
  messageId: string;
  type: 'summary' | 'follow_up' | 'risk' | 'opportunity';
  title: string;
  content: string;
  suggestedReply?: string;
  confidence: number;
  actionable: boolean;
  actionText?: string;
}

export interface EngagementActivity {
  id: string;
  user: string;
  userAvatar: string;
  action: string;
  target: string;
  platform: string;
  time: string;
  type: 'respond' | 'convert' | 'assign' | 'escalate' | 'ai_suggest' | 'alert';
}

export const mockEngagementMessages: EngagementMessage[] = [
  {
    id: 'msg1',
    platform: 'linkedin',
    type: 'comment',
    sender: {
      name: 'Michael Anderson',
      avatar: 'MA',
      company: 'TechNova Solutions',
      title: 'VP of Engineering',
      location: 'San Francisco, CA',
    },
    subject: 'Re: 3 Ways AI Boosts Manufacturing',
    preview: 'This is exactly what we have been looking for. Our team evaluated several platforms...',
    body: 'This is exactly what we have been looking for. Our team evaluated several platforms last quarter but none offered the combination of AI-driven insights and multi-channel orchestration you described. Would love to see a demo focused on manufacturing use cases. We are currently scaling our smart factory initiative across 3 plants in Ohio and need a solution that can handle both inbound lead qualification and outbound account-based marketing.',
    timestamp: '2026-07-02T08:15:00',
    isRead: false,
    intentScore: 94,
    intentSignals: ['显性需求表达', '预算周期提及', '多工厂扩张', '已评估竞品'],
    status: 'new',
    tags: ['High-Intent', 'Manufacturing', 'Demo-Request'],
    priority: 'high',
  },
  {
    id: 'msg2',
    platform: 'twitter',
    type: 'mention',
    sender: {
      name: 'Sarah Müller',
      avatar: 'SM',
      company: 'DigitalWerk GmbH',
      title: 'Head of Growth',
      location: 'Berlin, Germany',
    },
    subject: '@YourBrand Interesting take on GDPR-compliant growth',
    preview: '@YourBrand Interesting take on GDPR-compliant growth strategies. Do you have case studies for DACH...',
    body: '@YourBrand Interesting take on GDPR-compliant growth strategies. Do you have case studies for DACH SaaS companies? We are struggling to find tools that balance personalization with the strict German interpretation of GDPR. Would be great to connect.',
    timestamp: '2026-07-02T08:45:00',
    isRead: false,
    intentScore: 78,
    intentSignals: ['痛点明确', 'DACH市场合规需求', '主动邀约连接'],
    status: 'new',
    tags: ['DACH', 'GDPR', 'Twitter'],
    priority: 'high',
  },
  {
    id: 'msg3',
    platform: 'email',
    type: 'private_message',
    sender: {
      name: 'James Watanabe',
      avatar: 'JW',
      company: 'Pacific Trade Partners',
      title: 'Managing Director',
      location: 'Singapore',
    },
    subject: 'Inquiry: Enterprise Plan for Southeast Asia',
    preview: 'Dear team, we represent 12 manufacturing companies across Singapore, Indonesia, and Vietnam...',
    body: 'Dear team,\n\nWe represent 12 manufacturing companies across Singapore, Indonesia, and Vietnam who are actively seeking AI-driven growth solutions for their international expansion.\n\nKey requirements:\n- Multi-language support (EN, ID, VI, ZH)\n- Integration with our existing Salesforce CRM\n- White-label option for our agency partners\n\nCan we schedule a call this week? Our procurement cycle closes in August.\n\nBest regards,\nJames Watanabe',
    timestamp: '2026-07-02T07:30:00',
    isRead: true,
    intentScore: 97,
    intentSignals: ['代表12家客户', '明确采购周期', 'CRM集成需求', '白标需求'],
    status: 'read',
    tags: ['Enterprise', 'SEA', 'Agency', 'Hot-Lead'],
    priority: 'high',
  },
  {
    id: 'msg4',
    platform: 'linkedin',
    type: 'private_message',
    sender: {
      name: 'Elena Rossi',
      avatar: 'ER',
      company: 'Moda Italiana Group',
      title: 'Digital Transformation Director',
      location: 'Milan, Italy',
    },
    subject: 'Following up from your webinar',
    preview: 'Ciao! I attended your webinar on AI localization last week. Very insightful...',
    body: 'Ciao! I attended your webinar on AI localization last week. Very insightful presentation on cultural adaptation for European markets.\n\nWe are an Italian fashion-tech company expanding to China and Japan. While your platform focuses on Chinese companies going global, I wonder if the localization engine works for both directions? Specifically interested in the cultural adaptation mode for our brand storytelling content.\n\nCould we discuss a potential partnership or beta access for the European → Asia direction?',
    timestamp: '2026-07-02T06:20:00',
    isRead: true,
    intentScore: 72,
    intentSignals: ['参与过线上活动', '反向市场需求', '品牌故事本地化'],
    status: 'read',
    tags: ['Partnership', 'Fashion', 'Localization'],
    priority: 'medium',
  },
  {
    id: 'msg5',
    platform: 'linkedin',
    type: 'comment',
    sender: {
      name: 'Robert Chen',
      avatar: 'RC',
      company: 'Horizon Ventures',
      title: 'Investment Director',
      location: 'Shanghai / NYC',
    },
    subject: 'Re: How Chinese SaaS Wins in Europe',
    preview: 'Great article. We have 3 portfolio companies that would benefit from this platform...',
    body: 'Great article. We have 3 portfolio companies in our B2B SaaS fund that would benefit from this platform immediately. They are all post-Series A with established products but struggling with GTM in North America.\n\nWould you be open to a vendor partnership discussion? We can bring 15+ portfolio companies as potential clients.',
    timestamp: '2026-07-01T22:10:00',
    isRead: true,
    intentScore: 88,
    intentSignals: ['投资机构背书', '3家已确认需求', '15+潜在渠道', 'GTM痛点匹配'],
    status: 'read',
    tags: ['Investor', 'Channel', 'Portfolio'],
    priority: 'high',
  },
  {
    id: 'msg6',
    platform: 'email',
    type: 'private_message',
    sender: {
      name: 'Anna Kowalski',
      avatar: 'AK',
      company: 'EcoBuild Industries',
      title: 'Chief Sustainability Officer',
      location: 'Warsaw, Poland',
    },
    subject: 'Your AI content flagged sustainability claims - need clarification',
    preview: 'To whom it may concern, I noticed your whitepaper mentions sustainability metrics...',
    body: 'To whom it may concern,\n\nI noticed your whitepaper mentions sustainability metrics and ESG reporting capabilities. As a CSO at one of Europe\'s largest green building materials companies, I need to verify:\n\n1. Do your sustainability claims comply with EU Green Claims Directive (effective Jan 2026)?\n2. Can your AI-generated content ensure factual accuracy of ESG data?\n\nThis is time-sensitive as we are evaluating platforms for our Q4 sustainability communication campaign across 7 EU markets.\n\nRegards,\nAnna Kowalski',
    timestamp: '2026-07-01T18:45:00',
    isRead: true,
    intentScore: 65,
    intentSignals: ['合规验证需求', 'Q4采购计划', '7国市场覆盖'],
    status: 'read',
    tags: ['ESG', 'Compliance', 'Enterprise'],
    priority: 'medium',
  },
  {
    id: 'msg7',
    platform: 'twitter',
    type: 'mention',
    sender: {
      name: 'Carlos Mendez',
      avatar: 'CM',
      company: 'DataDriven MX',
      title: 'CEO & Founder',
      location: 'Mexico City, Mexico',
    },
    subject: '@YourBrand looks promising for LATAM expansion!',
    preview: '@YourBrand looks promising for LATAM expansion! Quick question - do you support Spanish...',
    body: '@YourBrand looks promising for LATAM expansion! Quick question - do you support Spanish and Portuguese content generation with local cultural nuances? Most platforms just do literal translation and it sounds terrible to native speakers. We are a data analytics agency serving 40+ clients across Mexico, Colombia, and Brazil.',
    timestamp: '2026-07-01T16:30:00',
    isRead: true,
    intentScore: 55,
    intentSignals: ['LATAM市场兴趣', '40+下游客户', '本地化质量关注'],
    status: 'read',
    tags: ['LATAM', 'Agency', 'Localization'],
    priority: 'low',
  },
  {
    id: 'msg8',
    platform: 'linkedin',
    type: 'private_message',
    sender: {
      name: 'Thomas Weber',
      avatar: 'TW',
      company: 'PrecisionTools AG',
      title: 'Head of International Sales',
      location: 'Stuttgart, Germany',
    },
    subject: 'Pricing inquiry for mid-market manufacturing',
    preview: 'Guten Tag, we are a precision tooling manufacturer with 200 employees...',
    body: 'Guten Tag,\n\nWe are a precision tooling manufacturer with 200 employees, exporting to 15 countries. Your platform caught my attention at the Hannover Messe industrial fair.\n\nWe need:\n- German website localization (current site is EN only)\n- LinkedIn content for DACH + Benelux markets\n- Email automation for distributor network (45 partners across Europe)\n\nCan you share mid-market pricing? We have budget approval for Q3.\n\nMit freundlichen Grüßen,\nThomas Weber',
    timestamp: '2026-07-01T14:00:00',
    isRead: true,
    intentScore: 82,
    intentSignals: ['行业展会触达', 'Q3预算已批', '45家分销网络', '多市场需求'],
    status: 'read',
    tags: ['Manufacturing', 'Mid-Market', 'DACH'],
    priority: 'medium',
  },
  {
    id: 'msg9',
    platform: 'facebook',
    type: 'comment',
    sender: {
      name: 'Lisa Park',
      avatar: 'LP',
      company: 'K-Beauty Collective',
      title: 'Global Brand Manager',
      location: 'Seoul, South Korea',
    },
    subject: 'Re: Post about AI content localization',
    preview: 'This is fascinating! We are a Korean beauty brand expanding to US and EU...',
    body: 'This is fascinating! We are a Korean beauty brand expanding to US and EU markets. The cultural adaptation feature sounds perfect for our brand voice - Korean beauty has very specific cultural nuances that don\'t translate literally.\n\nDo you have experience with beauty/lifestyle brands? Would love to see relevant case studies.',
    timestamp: '2026-07-01T12:15:00',
    isRead: true,
    intentScore: 48,
    intentSignals: ['品牌出海需求', '文化适配兴趣', '案例验证需求'],
    status: 'read',
    tags: ['DTC', 'Beauty', 'Korea'],
    priority: 'low',
  },
  {
    id: 'msg10',
    platform: 'email',
    type: 'private_message',
    sender: {
      name: 'David Okonkwo',
      avatar: 'DO',
      company: 'AfriTech Hub',
      title: 'Partnership Director',
      location: 'Lagos, Nigeria / London, UK',
    },
    subject: 'Partnership opportunity: Africa expansion',
    preview: 'Hello, I lead AfriTech Hub, the largest B2B SaaS accelerator in West Africa...',
    body: 'Hello,\n\nI lead AfriTech Hub, the largest B2B SaaS accelerator in West Africa with 60+ portfolio companies expanding globally.\n\nWe are looking for an official growth platform partner for our cohort. Many of our startups need exactly what you offer: AI-driven market intelligence, localization, and multi-channel outreach for European and North American markets.\n\nCould we arrange a partnership call next week? I will be in London from July 7-14 if that works.\n\nCheers,\nDavid',
    timestamp: '2026-07-01T10:00:00',
    isRead: true,
    intentScore: 85,
    intentSignals: ['60+潜在客户', '官方合作意向', '明确会面时间', '加速器背书'],
    status: 'read',
    tags: ['Partnership', 'Africa', 'Accelerator'],
    priority: 'high',
  },
];

export const mockConversations: Record<string, ConversationReply[]> = {
  msg1: [
    { id: 'r1-1', messageId: 'msg1', from: 'sender', senderName: 'Michael Anderson', body: 'This is exactly what we have been looking for. Our team evaluated several platforms last quarter but none offered the combination of AI-driven insights and multi-channel orchestration you described. Would love to see a demo focused on manufacturing use cases.', timestamp: '2026-07-02T08:15:00' },
    { id: 'r1-2', messageId: 'msg1', from: 'user', senderName: 'Leo Chen', body: 'Hi Michael, thanks for reaching out! We would be happy to set up a personalized demo for your manufacturing use cases. Our platform has specific features for smart factory lead qualification and ABM orchestration. Are you available this Thursday or Friday afternoon (EST)?', timestamp: '2026-07-02T09:00:00' },
    { id: 'r1-3', messageId: 'msg1', from: 'sender', senderName: 'Michael Anderson', body: 'Friday 2pm EST works perfectly. Please include how your platform handles multi-plant data segmentation - we have strict data governance requirements across our 3 Ohio plants. Looking forward!', timestamp: '2026-07-02T09:45:00' },
  ],
  msg3: [
    { id: 'r3-1', messageId: 'msg3', from: 'sender', senderName: 'James Watanabe', body: 'Dear team, we represent 12 manufacturing companies across Singapore, Indonesia, and Vietnam who are actively seeking AI-driven growth solutions.', timestamp: '2026-07-02T07:30:00' },
  ],
  msg4: [
    { id: 'r4-1', messageId: 'msg4', from: 'sender', senderName: 'Elena Rossi', body: 'Ciao! I attended your webinar on AI localization last week. Very insightful presentation on cultural adaptation for European markets. Could we discuss a potential partnership?', timestamp: '2026-07-02T06:20:00' },
    { id: 'r4-2', messageId: 'msg4', from: 'user', senderName: 'Mia Wang', body: 'Ciao Elena! Thrilled you enjoyed the webinar. Yes, our localization engine works bidirectionally - we would love to explore the European → Asia direction with you. I have availability next Tuesday or Wednesday. Which works better for you?', timestamp: '2026-07-02T07:00:00' },
  ],
  msg5: [
    { id: 'r5-1', messageId: 'msg5', from: 'sender', senderName: 'Robert Chen', body: 'Great article. We have 3 portfolio companies in our B2B SaaS fund that would benefit from this platform immediately. Would you be open to a vendor partnership discussion?', timestamp: '2026-07-01T22:10:00' },
  ],
  msg8: [
    { id: 'r8-1', messageId: 'msg8', from: 'sender', senderName: 'Thomas Weber', body: 'Guten Tag, we are a precision tooling manufacturer with 200 employees, exporting to 15 countries. Can you share mid-market pricing?', timestamp: '2026-07-01T14:00:00' },
    { id: 'r8-2', messageId: 'msg8', from: 'user', senderName: 'Sarah Zhang', body: 'Guten Tag Herr Weber! Thank you for your interest. I have attached our mid-market pricing sheet. For your specific needs (DE localization + LinkedIn DACH/Benelux + email automation for 45 distributors), our Growth plan at €2,490/month would be the best fit. Would you like me to prepare a tailored proposal?', timestamp: '2026-07-01T15:30:00' },
    { id: 'r8-3', messageId: 'msg8', from: 'sender', senderName: 'Thomas Weber', body: 'Vielen Dank! The Growth plan looks suitable. Yes, please prepare the tailored proposal. We will review it in our weekly meeting next Monday. One additional question: do you offer onboarding support in German?', timestamp: '2026-07-02T09:00:00' },
  ],
};

export const mockEngagementAIInsights: EngagementAIInsight[] = [
  {
    id: 'eai1',
    messageId: 'msg1',
    type: 'summary',
    title: '对话摘要与背景',
    content: 'Michael Anderson 是 TechNova Solutions 的工程 VP，公司在 Ohio 有 3 家智能工厂正在扩张。已评估过多个平台，目前主动请求 Demo，关注制造业场景和多工厂数据治理。',
    confidence: 95,
    actionable: false,
  },
  {
    id: 'eai2',
    messageId: 'msg1',
    type: 'follow_up',
    title: '推荐跟进话术',
    content: '基于 Michael 的技术背景和多工厂治理需求，建议在 Demo 中重点展示: (1) 多租户数据隔离能力, (2) 制造业特定的 ICP 模板, (3) ABM 跨工厂协同功能。',
    suggestedReply: 'Hi Michael, looking forward to Friday. I have prepared a demo tailored to your 3-plant setup - we will walk through multi-plant data segmentation, manufacturing ICP templates, and how our ABM engine handles cross-facility lead routing. See you at 2pm EST!',
    confidence: 91,
    actionable: true,
    actionText: '复制话术',
  },
  {
    id: 'eai3',
    messageId: 'msg1',
    type: 'opportunity',
    title: '转化机会分析',
    content: '意向评分 94/100，属于 Hot Lead。Michael 已主动提出 Demo 请求并确认时间。基于类似制造业客户的转化数据，Demo 后 7 天内跟进合同，预计成交率 72%。建议分配专属客户成功经理。',
    confidence: 88,
    actionable: true,
    actionText: '转为线索并分配',
  },
  {
    id: 'eai4',
    messageId: 'msg3',
    type: 'summary',
    title: '对话摘要与背景',
    content: 'James Watanabe 代表 12 家东南亚制造企业，明确表达企业级需求（多语言、Salesforce 集成、白标）。采购周期截止 8 月，时间紧迫。',
    confidence: 93,
    actionable: false,
  },
  {
    id: 'eai5',
    messageId: 'msg3',
    type: 'follow_up',
    title: '推荐跟进话术',
    content: 'James 代表多个客户，需要展示规模化能力和合作伙伴计划。建议提供批量折扣方案和合作伙伴 onboarding 流程。',
    suggestedReply: 'Hi James, thank you for the detailed requirements. We support all listed needs including Salesforce native integration and white-label options. For 12+ companies, I would like to discuss our Agency Partner Program which includes volume pricing, dedicated partner manager, and priority onboarding. Are you available Thursday 10am SGT for a call?',
    confidence: 89,
    actionable: true,
    actionText: '复制话术',
  },
  {
    id: 'eai6',
    messageId: 'msg3',
    type: 'risk',
    title: '竞品风险提醒',
    content: 'Pacific Trade Partners 的公开信息显示他们上季度与 HubSpot 和 Salesforce Marketing Cloud 有过洽谈。建议在提案中明确对比我们的差异化优势（AI 本地化 + 多平台统一 Inbox）。',
    confidence: 76,
    actionable: true,
    actionText: '查看竞品对比',
  },
];

export const mockEngagementActivities: EngagementActivity[] = [
  { id: 'ea1', user: 'Leo Chen', userAvatar: 'L', action: '回复了', target: 'Michael Anderson 的 Demo 请求', platform: 'linkedin', time: '30分钟前', type: 'respond' },
  { id: 'ea2', user: 'AI 助手', userAvatar: 'AI', action: '为', target: 'James Watanabe 生成了跟进话术', platform: 'email', time: '45分钟前', type: 'ai_suggest' },
  { id: 'ea3', user: 'Sarah Zhang', userAvatar: 'S', action: '将', target: 'Elena Rossi 标记为合作伙伴机会', platform: 'linkedin', time: '1小时前', type: 'assign' },
  { id: 'ea4', user: 'Leo Chen', userAvatar: 'L', action: '转线索', target: 'Michael Anderson → TechNova Solutions', platform: 'linkedin', time: '1.5小时前', type: 'convert' },
  { id: 'ea5', user: '系统', userAvatar: 'S', action: '告警', target: 'David Okonkwo 消息超过 24 小时未回复', platform: 'email', time: '2小时前', type: 'alert' },
  { id: 'ea6', user: 'David Liu', userAvatar: 'D', action: '回复了', target: 'Thomas Weber 的定价咨询', platform: 'linkedin', time: '3小时前', type: 'respond' },
  { id: 'ea7', user: 'AI 助手', userAvatar: 'AI', action: '检测到', target: 'Sarah Müller 为高意向 DACH 潜客', platform: 'twitter', time: '4小时前', type: 'ai_suggest' },
  { id: 'ea8', user: 'Leo Chen', userAvatar: 'L', action: '升级处理', target: 'Anna Kowalski ESG合规验证需求', platform: 'email', time: '5小时前', type: 'escalate' },
];