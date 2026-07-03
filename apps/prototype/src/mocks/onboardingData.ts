export interface OnboardingData {
  step: number;
  // Step 1: Company Profile
  companyName: string;
  companyWebsite: string;
  industry: string;
  companySize: string;
  companyDescription: string;
  targetCustomers: string;
  // Step 2: Target Markets
  regions: string[];
  targetIndustries: string[];
  languages: string[];
  // Step 3: ICP Preview
  icps: GeneratedICP[];
  // Step 4: First Campaign
  campaignName: string;
  campaignGoal: string;
  campaignBudget: string;
  campaignChannels: string[];
  campaignDuration: string;
}

export interface GeneratedICP {
  id: string;
  name: string;
  description: string;
  criteria: {
    companySize: string;
    industry: string[];
    geography: string[];
    revenue: string;
    techStack: string[];
    painPoints: string[];
  };
  persona: {
    title: string[];
    seniority: string;
  };
  estimatedMatchCount: number;
}

export const defaultOnboardingData: OnboardingData = {
  step: 0,
  companyName: '',
  companyWebsite: '',
  industry: '',
  companySize: '',
  companyDescription: '',
  targetCustomers: '',
  regions: [],
  targetIndustries: [],
  languages: [],
  icps: [],
  campaignName: '',
  campaignGoal: '',
  campaignBudget: '',
  campaignChannels: [],
  campaignDuration: '',
};

export const industryOptions = [
  'SaaS / 企业软件',
  '制造业 / 工业自动化',
  '金融科技',
  '电商 / DTC 品牌',
  '医疗健康',
  '教育科技',
  '跨境贸易',
  '专业服务（咨询/法律）',
  '云计算 / 基础设施',
  '人工智能 / 机器学习',
  '游戏 / 娱乐',
  '其他',
];

export const companySizeOptions = [
  '1-10 人（初创）',
  '11-50 人（小型）',
  '51-200 人（中型）',
  '201-500 人（成长型）',
  '501-2000 人（大型）',
  '2000+ 人（企业级）',
];

export const regionOptions = [
  { id: 'na', name: '北美（美国/加拿大）', icon: 'ri-earth-line' },
  { id: 'eu-west', name: '西欧（英国/德国/法国/荷兰）', icon: 'ri-earth-line' },
  { id: 'eu-north', name: '北欧（瑞典/挪威/丹麦/芬兰）', icon: 'ri-earth-line' },
  { id: 'apac-se', name: '东南亚（新加坡/印尼/马来西亚/泰国）', icon: 'ri-earth-line' },
  { id: 'apac-east', name: '东亚（日本/韩国）', icon: 'ri-earth-line' },
  { id: 'oceania', name: '大洋洲（澳大利亚/新西兰）', icon: 'ri-earth-line' },
  { id: 'latam', name: '拉丁美洲（巴西/墨西哥）', icon: 'ri-earth-line' },
  { id: 'mena', name: '中东/北非', icon: 'ri-earth-line' },
];

export const targetIndustryOptions = [
  'SaaS / 企业软件',
  '制造业 / 工业自动化',
  '金融科技 / 金融服务',
  '电商 / 零售',
  '医疗健康',
  '教育科技',
  '物流 / 供应链',
  '能源 / 清洁技术',
  '媒体 / 娱乐',
  '政府 / 公共部门',
];

export const languageOptions = [
  { id: 'en', name: 'English（英语）', nativeName: 'English' },
  { id: 'zh', name: '中文（简体）', nativeName: '中文' },
  { id: 'de', name: 'Deutsch（德语）', nativeName: 'Deutsch' },
  { id: 'fr', name: 'Français（法语）', nativeName: 'Français' },
  { id: 'es', name: 'Español（西班牙语）', nativeName: 'Español' },
  { id: 'ja', name: '日本語（日语）', nativeName: '日本語' },
  { id: 'ko', name: '한국어（韩语）', nativeName: '한국어' },
  { id: 'pt', name: 'Português（葡萄牙语）', nativeName: 'Português' },
];

export const channelOptions = [
  { id: 'linkedin', name: 'LinkedIn', icon: 'ri-linkedin-fill', desc: 'B2B 专业社交平台' },
  { id: 'email', name: '邮件营销', icon: 'ri-mail-line', desc: '个性化邮件序列' },
  { id: 'twitter', name: 'Twitter/X', icon: 'ri-twitter-x-fill', desc: '实时互动与内容分发' },
  { id: 'content', name: '内容营销', icon: 'ri-article-line', desc: '白皮书/博客/SEO' },
  { id: 'webinar', name: 'Webinar', icon: 'ri-live-line', desc: '线上直播获客' },
  { id: 'ads', name: '付费广告', icon: 'ri-advertisement-line', desc: 'SEM/社交广告' },
];

export const budgetOptions = [
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000+',
];

export const durationOptions = [
  '1 个月（快速测试）',
  '2 个月（短期战役）',
  '3 个月（标准季度战役）',
  '6 个月（中长期战役）',
];

export const aiGeneratedICPs: GeneratedICP[] = [
  {
    id: 'gen-icp-1',
    name: '北美技术决策者',
    description: '北美地区快速成长的 SaaS/科技企业，技术 VP 及以上决策者，关注增长效率和自动化',
    criteria: {
      companySize: '50-500 人',
      industry: ['SaaS', '企业软件', '云计算'],
      geography: ['美国', '加拿大'],
      revenue: '$10M - $500M',
      techStack: ['Salesforce', 'HubSpot', 'AWS', 'Snowflake'],
      painPoints: ['获客成本上升', '跨团队数据协作', '增长效率瓶颈'],
    },
    persona: {
      title: ['CTO', 'VP Engineering', 'Head of Growth'],
      seniority: 'VP 及以上',
    },
    estimatedMatchCount: 127,
  },
  {
    id: 'gen-icp-2',
    name: '欧洲制造业数字化转型',
    description: '欧洲地区正在推进工业 4.0 的制造企业，关注供应链数字化的运营决策者',
    criteria: {
      companySize: '200-2000 人',
      industry: ['智能制造', '工业自动化', '汽车零部件'],
      geography: ['德国', '法国', '意大利', '荷兰'],
      revenue: '€50M - €500M',
      techStack: ['SAP', 'Siemens', 'Microsoft Dynamics'],
      painPoints: ['供应链透明度', '生产效率低下', '数字化转型缓慢'],
    },
    persona: {
      title: ['COO', 'Digital Transformation Director', 'Plant Manager'],
      seniority: '总监及以上',
    },
    estimatedMatchCount: 83,
  },
  {
    id: 'gen-icp-3',
    name: '亚太高增长 DTC 品牌',
    description: '东南亚/大洋洲地区的 DTC 消费品牌，关注获客效率和品牌增长的创始人/CMO',
    criteria: {
      companySize: '10-100 人',
      industry: ['DTC', '电商', '消费品牌'],
      geography: ['新加坡', '澳大利亚', '印尼', '马来西亚'],
      revenue: '$1M - $20M',
      techStack: ['Shopify', 'Klaviyo', 'Meta Ads', 'Google Analytics'],
      painPoints: ['流量成本快速上升', '复购率不足', '跨市场本地化困难'],
    },
    persona: {
      title: ['CEO/Founder', 'CMO', 'Head of E-commerce'],
      seniority: '创始人/高管',
    },
    estimatedMatchCount: 56,
  },
];
