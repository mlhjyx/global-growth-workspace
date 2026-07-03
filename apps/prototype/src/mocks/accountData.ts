export interface ICPProfile {
  id: string;
  name: string;
  description: string;
  active: boolean;
  criteria: {
    companySize: string;
    industry: string[];
    geography: string[];
    revenue: string;
    techStack: string[];
    painPoints: string[];
    buyingSignals: string[];
  };
  persona: {
    title: string[];
    department: string[];
    seniority: string;
  };
  createdBy: string;
  createdAt: string;
  matchCount: number;
  aiGenerated: boolean;
}

export interface Account {
  id: string;
  company: string;
  domain: string;
  industry: string;
  country: string;
  city: string;
  revenue: string;
  employees: string;
  founded: string;
  score: number;
  status: 'new' | 'contacted' | 'engaged' | 'qualified' | 'disqualified';
  signals: AccountSignal[];
  contacts: Contact[];
  techStack: string[];
  lastActivity: string;
  notes: string;
  dataQuality: number; // 0-100
}

export interface AccountSignal {
  id: string;
  type: 'funding' | 'hiring' | 'expansion' | 'tech_change' | 'executive_change' | 'social_activity' | 'partnership' | 'event';
  title: string;
  description: string;
  date: string;
  source: string;
  confidence: number;
  isHot: boolean;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  linkedIn: string;
  phone: string;
  isPrimary: boolean;
  lastInteraction: string;
}

export interface SignalEvent {
  id: string;
  accountId: string;
  accountName: string;
  signalType: string;
  signalTitle: string;
  time: string;
  read: boolean;
}

export interface DataQualityReport {
  totalAccounts: number;
  enrichedAccounts: number;
  duplicateCount: number;
  missingEmail: number;
  missingPhone: number;
  missingLinkedIn: number;
  verifiedCount: number;
  enrichmentRate: number;
  dedupRate: number;
  lastUpdate: string;
}

export const mockICPs: ICPProfile[] = [
  {
    id: 'icp1',
    name: '北美 SaaS 决策者',
    description: '北美地区年收入 $10M+ 的 SaaS 企业，技术决策者关注数据分析和 AI 自动化',
    active: true,
    criteria: {
      companySize: '50-500人',
      industry: ['SaaS', '企业软件', '云计算'],
      geography: ['美国', '加拿大'],
      revenue: '$10M - $500M',
      techStack: ['Salesforce', 'HubSpot', 'AWS', 'Snowflake'],
      painPoints: ['获客成本上升', '跨团队协作低效', '数据孤岛'],
      buyingSignals: ['近期融资', '技术栈扩展', '高管招聘'],
    },
    persona: {
      title: ['CTO', 'VP Engineering', 'Head of Growth', 'CPO'],
      department: ['技术', '产品', '增长'],
      seniority: 'VP 及以上',
    },
    createdBy: 'AI 助手',
    createdAt: '2026-07-01',
    matchCount: 127,
    aiGenerated: true,
  },
  {
    id: 'icp2',
    name: '欧洲智能制造采购方',
    description: 'DACH 区域制造业企业，关注供应链数字化和智能生产',
    active: false,
    criteria: {
      companySize: '200-5000人',
      industry: ['智能制造', '工业自动化', '精密仪器'],
      geography: ['德国', '奥地利', '瑞士'],
      revenue: '€20M - €200M',
      techStack: ['SAP', 'Siemens', 'ABB'],
      painPoints: ['供应链透明度', '生产效率', '质量控制'],
      buyingSignals: ['工厂扩建', '数字化转型项目', 'ERP 升级'],
    },
    persona: {
      title: ['COO', 'Plant Manager', 'Supply Chain Director'],
      department: ['运营', '供应链', 'IT'],
      seniority: '总监及以上',
    },
    createdBy: 'Leo Chen',
    createdAt: '2026-06-15',
    matchCount: 83,
    aiGenerated: false,
  },
  {
    id: 'icp3',
    name: '东南亚 DTC 品牌创始人',
    description: '新加坡/印尼地区年营收 $1M+ 的 DTC 品牌，关注增长和获客效率',
    active: false,
    criteria: {
      companySize: '10-100人',
      industry: ['DTC', '电商', '消费品牌'],
      geography: ['新加坡', '印尼', '马来西亚'],
      revenue: '$1M - $20M',
      techStack: ['Shopify', 'Meta Ads', 'TikTok', 'Klaviyo'],
      painPoints: ['流量成本上升', '复购率低', '本地化运营'],
      buyingSignals: ['新市场扩张', 'A轮融资', '团队扩招'],
    },
    persona: {
      title: ['CEO', 'Founder', 'CMO'],
      department: ['营销', '运营'],
      seniority: '创始人/高管',
    },
    createdBy: 'Mia Wang',
    createdAt: '2026-06-20',
    matchCount: 56,
    aiGenerated: false,
  },
];

export const mockAccounts: Account[] = [
  {
    id: 'acc1',
    company: 'TechNova Solutions',
    domain: 'technova.io',
    industry: '企业软件',
    country: '美国',
    city: 'San Francisco',
    revenue: '$120M',
    employees: '320',
    founded: '2018',
    score: 92,
    status: 'engaged',
    signals: [
      { id: 's1', type: 'funding', title: 'B 轮 $45M 融资', description: '2026 年 6 月完成 B 轮融资，资金将用于北美市场扩张和产品研发', date: '2026-06-15', source: 'Crunchbase', confidence: 98, isHot: true },
      { id: 's2', type: 'hiring', title: '招聘销售 VP', description: '在 LinkedIn 发布 Enterprise Sales VP 职位，要求 SaaS 行业经验', date: '2026-07-01', source: 'LinkedIn', confidence: 95, isHot: true },
      { id: 's3', type: 'tech_change', title: '技术栈变更信号', description: 'CTO 在 Twitter 提到正在评估新的数据分析平台', date: '2026-06-28', source: 'Twitter', confidence: 82, isHot: false },
    ],
    contacts: [
      { id: 'c1', name: 'Sarah Mitchell', title: 'CTO', department: '技术', email: 'sarah@technova.io', linkedIn: 'linkedin.com/in/smitchell', phone: '+1-415-555-0101', isPrimary: true, lastInteraction: '2026-07-01' },
      { id: 'c2', name: 'James Park', title: 'VP Engineering', department: '技术', email: 'james@technova.io', linkedIn: 'linkedin.com/in/jpark', phone: '', isPrimary: false, lastInteraction: '2026-06-20' },
    ],
    techStack: ['AWS', 'Snowflake', 'Salesforce'],
    lastActivity: '2026-07-01',
    notes: '高意向客户，近期完成融资，正在扩招销售团队。CTO 对数据分析平台表现出兴趣。',
    dataQuality: 94,
  },
  {
    id: 'acc2',
    company: 'GreenBuild GmbH',
    domain: 'greenbuild.de',
    industry: '智能制造',
    country: '德国',
    city: 'Munich',
    revenue: '€85M',
    employees: '450',
    founded: '2012',
    score: 87,
    status: 'new',
    signals: [
      { id: 's4', type: 'tech_change', title: 'ERP 升级项目启动', description: '官网招聘 SAP S/4HANA 顾问，推测正在进行 ERP 升级', date: '2026-06-25', source: '公司官网', confidence: 88, isHot: true },
      { id: 's5', type: 'expansion', title: '波兰工厂扩建', description: '计划在波兰开设第二家工厂，预计投资 €15M', date: '2026-06-18', source: '行业新闻', confidence: 90, isHot: false },
      { id: 's6', type: 'social_activity', title: 'LinkedIn 互动激增', description: '采购团队近两周在 LinkedIn 活跃，频繁互动制造业内容', date: '2026-06-30', source: 'LinkedIn', confidence: 78, isHot: false },
    ],
    contacts: [
      { id: 'c3', name: 'Klaus Weber', title: 'COO', department: '运营', email: 'k.weber@greenbuild.de', linkedIn: 'linkedin.com/in/kweber', phone: '+49-89-555-0202', isPrimary: true, lastInteraction: '' },
    ],
    techStack: ['SAP', 'Siemens', 'Microsoft Azure'],
    lastActivity: '2026-06-30',
    notes: '德国智能制造企业，正在进行 ERP 升级，有数字化转型需求。需要德语内容支持。',
    dataQuality: 78,
  },
  {
    id: 'acc3',
    company: 'DataVista Analytics',
    domain: 'datavista.ai',
    industry: '数据分析',
    country: '英国',
    city: 'London',
    revenue: '£42M',
    employees: '180',
    founded: '2019',
    score: 84,
    status: 'contacted',
    signals: [
      { id: 's7', type: 'executive_change', title: '新任 CTO 上任', description: '新任 CTO 背景为大数据平台架构，LinkedIn 发布技术选型帖', date: '2026-06-22', source: 'LinkedIn', confidence: 92, isHot: true },
      { id: 's8', type: 'partnership', title: '与 AWS 建立合作关系', description: '成为 AWS Advanced Technology Partner，计划扩展云服务', date: '2026-06-10', source: 'AWS 官网', confidence: 85, isHot: false },
    ],
    contacts: [
      { id: 'c4', name: 'Emma Thompson', title: 'CTO', department: '技术', email: 'emma@datavista.ai', linkedIn: 'linkedin.com/in/ethompson', phone: '+44-20-555-0303', isPrimary: true, lastInteraction: '2026-06-25' },
      { id: 'c5', name: 'Oliver Brown', title: 'Head of Data', department: '数据', email: 'oliver@datavista.ai', linkedIn: '', phone: '', isPrimary: false, lastInteraction: '' },
    ],
    techStack: ['AWS', 'Databricks', 'Python'],
    lastActivity: '2026-06-25',
    notes: '英国数据分析公司，新任 CTO 对技术选型持开放态度。已发送产品介绍邮件，等待回复。',
    dataQuality: 86,
  },
  {
    id: 'acc4',
    company: 'PacificTrade Corp',
    domain: 'pacifictrade.sg',
    industry: '跨境贸易',
    country: '新加坡',
    city: 'Singapore',
    revenue: 'SGD 200M',
    employees: '120',
    founded: '2015',
    score: 78,
    status: 'new',
    signals: [
      { id: 's9', type: 'social_activity', title: 'LinkedIn 采购团队活跃', description: '多位采购经理在 LinkedIn 频繁互动行业内容，讨论供应商管理', date: '2026-06-29', source: 'LinkedIn', confidence: 80, isHot: false },
      { id: 's10', type: 'hiring', title: '招聘供应链分析师', description: '发布 3 个供应链分析师职位，要求熟悉数字化工具', date: '2026-06-20', source: 'LinkedIn', confidence: 75, isHot: false },
    ],
    contacts: [
      { id: 'c6', name: 'Li Wei Tan', title: 'Supply Chain Director', department: '供应链', email: 'lwtan@pacifictrade.sg', linkedIn: 'linkedin.com/in/lwtan', phone: '+65-9123-4567', isPrimary: true, lastInteraction: '' },
    ],
    techStack: ['Oracle', 'SAP'],
    lastActivity: '2026-06-29',
    notes: '新加坡贸易公司，正在数字化转型中。供应链团队有数字化工具需求。',
    dataQuality: 72,
  },
  {
    id: 'acc5',
    company: 'QuantumLeap AI',
    domain: 'quantumleap.ai',
    industry: '人工智能',
    country: '美国',
    city: 'New York',
    revenue: '$65M',
    employees: '95',
    founded: '2020',
    score: 95,
    status: 'qualified',
    signals: [
      { id: 's11', type: 'funding', title: 'A 轮 $30M 融资', description: '2026 年 5 月完成 A 轮融资，投资方包括红杉资本', date: '2026-05-20', source: 'TechCrunch', confidence: 99, isHot: true },
      { id: 's12', type: 'hiring', title: '扩招增长团队', description: '近 30 天内发布 8 个增长相关职位，包括增长分析师和渠道经理', date: '2026-06-15', source: 'LinkedIn', confidence: 94, isHot: true },
      { id: 's13', type: 'event', title: '参加 SaaStr 2026', description: 'CEO 将在 SaaStr Annual 2026 演讲，主题为 AI 驱动的增长策略', date: '2026-07-10', source: 'SaaStr', confidence: 91, isHot: true },
      { id: 's14', type: 'tech_change', title: '评估营销自动化平台', description: '工程团队在技术博客中提到正在评估营销自动化和数据归因工具', date: '2026-06-05', source: '技术博客', confidence: 88, isHot: true },
    ],
    contacts: [
      { id: 'c7', name: 'Alex Chen', title: 'CEO & Founder', department: '执行', email: 'alex@quantumleap.ai', linkedIn: 'linkedin.com/in/alexchen', phone: '+1-212-555-0404', isPrimary: true, lastInteraction: '2026-07-01' },
      { id: 'c8', name: 'Rachel Kim', title: 'Head of Growth', department: '增长', email: 'rachel@quantumleap.ai', linkedIn: 'linkedin.com/in/rkim', phone: '+1-212-555-0405', isPrimary: false, lastInteraction: '2026-06-28' },
    ],
    techStack: ['AWS', 'Kubernetes', 'LangChain'],
    lastActivity: '2026-07-01',
    notes: '极高意向客户！AI 初创公司，近期融资，正在大规模扩招增长团队。CEO 和技术团队对我们的产品方向表现出浓厚兴趣。已安排产品演示。',
    dataQuality: 98,
  },
  {
    id: 'acc6',
    company: 'NordicFin Tech',
    domain: 'nordicfin.no',
    industry: '金融科技',
    country: '挪威',
    city: 'Oslo',
    revenue: 'NOK 450M',
    employees: '210',
    founded: '2014',
    score: 71,
    status: 'new',
    signals: [
      { id: 's15', type: 'expansion', title: '进军英国市场', description: '计划在伦敦设立分部，拓展英国金融科技市场', date: '2026-06-12', source: '行业新闻', confidence: 85, isHot: false },
      { id: 's16', type: 'tech_change', title: '核心系统升级', description: 'CTO 在公开演讲中提到正在进行核心系统现代化改造', date: '2026-06-08', source: '会议演讲', confidence: 72, isHot: false },
    ],
    contacts: [
      { id: 'c9', name: 'Erik Johansson', title: 'CTO', department: '技术', email: 'erik@nordicfin.no', linkedIn: '', phone: '', isPrimary: true, lastInteraction: '' },
    ],
    techStack: ['Microsoft Azure', '.NET'],
    lastActivity: '2026-06-12',
    notes: '挪威金融科技公司，正在扩张到英国市场。数据有限，需要进一步调研。',
    dataQuality: 65,
  },
  {
    id: 'acc7',
    company: 'CloudBridge Systems',
    domain: 'cloudbridge.io',
    industry: '云计算',
    country: '加拿大',
    city: 'Toronto',
    revenue: 'CAD 180M',
    employees: '520',
    founded: '2016',
    score: 89,
    status: 'engaged',
    signals: [
      { id: 's17', type: 'funding', title: 'C 轮 $80M 融资', description: '2026 年 4 月完成 C 轮融资，估值达到 $600M', date: '2026-04-15', source: 'VentureBeat', confidence: 97, isHot: true },
      { id: 's18', type: 'hiring', title: '全球扩张招聘', description: '在伦敦、新加坡和悉尼开设办事处，招聘当地增长团队', date: '2026-06-01', source: 'LinkedIn', confidence: 93, isHot: true },
      { id: 's19', type: 'partnership', title: '与 Google Cloud 战略合作', description: '宣布与 Google Cloud 建立多年战略合作伙伴关系', date: '2026-05-25', source: 'Google Cloud Blog', confidence: 96, isHot: false },
    ],
    contacts: [
      { id: 'c10', name: 'Maria Santos', title: 'VP Growth', department: '增长', email: 'maria@cloudbridge.io', linkedIn: 'linkedin.com/in/msantos', phone: '+1-416-555-0505', isPrimary: true, lastInteraction: '2026-06-30' },
      { id: 'c11', name: 'David Patel', title: 'Head of Partnerships', department: '合作', email: 'david@cloudbridge.io', linkedIn: 'linkedin.com/in/dpatel', phone: '', isPrimary: false, lastInteraction: '2026-06-25' },
    ],
    techStack: ['GCP', 'Kubernetes', 'Terraform'],
    lastActivity: '2026-06-30',
    notes: '加拿大云计算公司，快速扩张中。VP Growth 是我们的主要联系人，对产品功能匹配度评价很高。',
    dataQuality: 91,
  },
  {
    id: 'acc8',
    company: 'MediCare Plus',
    domain: 'medicareplus.com.au',
    industry: '医疗健康',
    country: '澳大利亚',
    city: 'Sydney',
    revenue: 'AUD 320M',
    employees: '1200',
    founded: '2008',
    score: 68,
    status: 'new',
    signals: [
      { id: 's20', type: 'executive_change', title: '新任 CMO 上任', description: '新任 CMO 来自制药行业，有丰富的数字化营销经验', date: '2026-05-30', source: 'LinkedIn', confidence: 87, isHot: false },
      { id: 's21', type: 'event', title: '参加 HIMSS 2026', description: '将在 HIMSS 展示新的患者管理平台', date: '2026-08-15', source: 'HIMSS', confidence: 80, isHot: false },
    ],
    contacts: [
      { id: 'c12', name: 'Lisa Wong', title: 'CMO', department: '营销', email: 'lisa@medicareplus.com.au', linkedIn: 'linkedin.com/in/lwong', phone: '', isPrimary: true, lastInteraction: '' },
    ],
    techStack: ['Salesforce Health Cloud', 'AWS'],
    lastActivity: '2026-05-30',
    notes: '澳大利亚医疗公司，新任 CMO 对数字化营销持开放态度。评分较低是因为行业匹配度一般，但可尝试建立关系。',
    dataQuality: 70,
  },
];

export const mockSignalEvents: SignalEvent[] = [
  { id: 'se1', accountId: 'acc1', accountName: 'TechNova Solutions', signalType: 'funding', signalTitle: '完成 B 轮 $45M 融资', time: '15分钟前', read: false },
  { id: 'se2', accountId: 'acc5', accountName: 'QuantumLeap AI', signalType: 'hiring', signalTitle: '扩招增长团队（8 个职位）', time: '35分钟前', read: false },
  { id: 'se3', accountId: 'acc2', accountName: 'GreenBuild GmbH', signalType: 'tech_change', signalTitle: '启动 ERP 升级项目', time: '1小时前', read: false },
  { id: 'se4', accountId: 'acc7', accountName: 'CloudBridge Systems', signalType: 'hiring', signalTitle: '在伦敦/新加坡/悉尼开设办事处', time: '2小时前', read: true },
  { id: 'se5', accountId: 'acc3', accountName: 'DataVista Analytics', signalType: 'executive_change', signalTitle: '新任 CTO 上任，发布技术选型帖', time: '3小时前', read: true },
  { id: 'se6', accountId: 'acc1', accountName: 'TechNova Solutions', signalType: 'hiring', signalTitle: '发布 Enterprise Sales VP 职位', time: '4小时前', read: true },
  { id: 'se7', accountId: 'acc4', accountName: 'PacificTrade Corp', signalType: 'social_activity', signalTitle: '采购团队在 LinkedIn 活跃', time: '5小时前', read: true },
  { id: 'se8', accountId: 'acc6', accountName: 'NordicFin Tech', signalType: 'expansion', signalTitle: '计划在伦敦设立分部', time: '6小时前', read: true },
];

export const mockDataQuality: DataQualityReport = {
  totalAccounts: 127,
  enrichedAccounts: 108,
  duplicateCount: 3,
  missingEmail: 12,
  missingPhone: 45,
  missingLinkedIn: 18,
  verifiedCount: 89,
  enrichmentRate: 85,
  dedupRate: 97,
  lastUpdate: '2026-07-02 08:30',
};

export interface ProspectAIInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'evidence' | 'risk';
  title: string;
  content: string;
  confidence: number;
  relatedTo?: string;
  actionable: boolean;
  actionText?: string;
}

export const mockAIInsights: ProspectAIInsight[] = [
  {
    id: 'pai1',
    type: 'evidence',
    title: 'TechNova 招聘信号匹配度极高',
    content: 'TechNova Solutions 近期发布的 Enterprise Sales VP 职位要求中，明确提到了需要"熟悉数据分析和营销自动化平台"，这与我们的产品功能高度匹配。同时，该公司 B 轮融资资金充裕，正处于快速扩张期。',
    confidence: 94,
    relatedTo: 'TechNova Solutions',
    actionable: true,
    actionText: '生成个性化 outreach',
  },
  {
    id: 'pai2',
    type: 'suggestion',
    title: '优先触达 QuantumLeap AI',
    content: 'QuantumLeap AI 是当前评分最高（95分）的潜客。他们有 4 个强信号（融资、扩招、活动、技术评估），且 CEO 和 Head of Growth 都已建立了联系。建议在本周内安排产品演示。',
    confidence: 92,
    relatedTo: 'QuantumLeap AI',
    actionable: true,
    actionText: '创建演示任务',
  },
  {
    id: 'pai3',
    type: 'warning',
    title: 'NordicFin Tech 数据不足',
    content: 'NordicFin Tech 的数据完整度仅 65%，缺失 LinkedIn 和电话信息。虽然该公司有扩张信号，但低质量数据可能导致 outreach 失败。建议先进行数据补全再发起联系。',
    confidence: 88,
    relatedTo: 'NordicFin Tech',
    actionable: true,
    actionText: '启动数据补全',
  },
  {
    id: 'pai4',
    type: 'risk',
    title: 'GreenBuild 竞品合同即将到期',
    content: 'GreenBuild 当前使用的竞品合同将在 3 个月后到期。这是绝佳的切换窗口期。但需注意，德国企业对供应商切换通常需要 6-12 个月的评估周期，建议现在就开始建立关系。',
    confidence: 79,
    relatedTo: 'GreenBuild GmbH',
    actionable: true,
    actionText: '查看竞品情报',
  },
  {
    id: 'pai5',
    type: 'suggestion',
    title: 'CloudBridge 多触点策略',
    content: 'CloudBridge Systems 同时在伦敦、新加坡和悉尼扩张，这意味着他们可能需要多区域增长策略支持。建议同时联系 VP Growth 和 Head of Partnerships，分别从不同角度切入。',
    confidence: 86,
    relatedTo: 'CloudBridge Systems',
    actionable: true,
    actionText: '创建多触点任务',
  },
];

export const signalTypeConfig: Record<string, { icon: string; label: string; color: string }> = {
  funding: { icon: 'ri-money-cny-circle-line', label: '融资', color: 'text-success' },
  hiring: { icon: 'ri-user-add-line', label: '招聘', color: 'text-primary-400' },
  expansion: { icon: 'ri-global-line', label: '扩张', color: 'text-info' },
  tech_change: { icon: 'ri-code-box-line', label: '技术变更', color: 'text-warning' },
  executive_change: { icon: 'ri-user-star-line', label: '高管变动', color: 'text-data-highlight' },
  social_activity: { icon: 'ri-share-circle-line', label: '社交活跃', color: 'text-foreground-500' },
  partnership: { icon: 'ri-briefcase-line', label: '合作', color: 'text-primary-400' },
  event: { icon: 'ri-calendar-event-line', label: '活动', color: 'text-foreground-500' },
};

export const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: '新潜客', color: 'text-foreground-500', bg: 'bg-foreground-500/10' },
  contacted: { label: '已联系', color: 'text-info', bg: 'bg-info/10' },
  engaged: { label: '互动中', color: 'text-primary-400', bg: 'bg-primary-500/10' },
  qualified: { label: '已认证', color: 'text-success', bg: 'bg-success/10' },
  disqualified: { label: '已排除', color: 'text-error', bg: 'bg-error/10' },
};