export interface ConnectedPlatform {
  id: string;
  name: string;
  icon: string;
  category: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string;
  dataSynced: string;
  accountName: string;
}

export interface AvailableIntegration {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  popularity: number;
  isEnterprise: boolean;
}

export interface APIToken {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed: string;
  scopes: string[];
  isActive: boolean;
}

export const connectedPlatforms: ConnectedPlatform[] = [
  {
    id: '1',
    name: 'Salesforce',
    icon: 'ri-cloud-line',
    category: 'CRM',
    status: 'connected',
    lastSync: '2 分钟前',
    dataSynced: '12,847 条联系人',
    accountName: 'GrowthOS Main Org',
  },
  {
    id: '2',
    name: 'HubSpot',
    icon: 'ri-bubble-chart-line',
    category: 'CRM',
    status: 'connected',
    lastSync: '5 分钟前',
    dataSynced: '8,234 条联系人',
    accountName: 'APAC Marketing Hub',
  },
  {
    id: '3',
    name: 'LinkedIn',
    icon: 'ri-linkedin-box-line',
    category: 'Social',
    status: 'connected',
    lastSync: '1 分钟前',
    dataSynced: '3 个广告账号',
    accountName: 'GrowthOS Official',
  },
  {
    id: '4',
    name: 'Twitter/X',
    icon: 'ri-twitter-x-line',
    category: 'Social',
    status: 'connected',
    lastSync: '8 分钟前',
    dataSynced: '2 个企业账号',
    accountName: '@growthos_ai',
  },
  {
    id: '5',
    name: 'Slack',
    icon: 'ri-slack-line',
    category: '协作',
    status: 'connected',
    lastSync: '实时',
    dataSynced: '5 个频道',
    accountName: 'GrowthOS Workspace',
  },
  {
    id: '6',
    name: 'Google Analytics 4',
    icon: 'ri-bar-chart-grouped-line',
    category: 'Analytics',
    status: 'error',
    lastSync: '3 小时前',
    dataSynced: '权限失效',
    accountName: 'GrowthOS Property',
  },
  {
    id: '7',
    name: 'Mailchimp',
    icon: 'ri-mail-send-line',
    category: 'Email',
    status: 'syncing',
    lastSync: '同步中',
    dataSynced: '同步 12,401 条记录',
    accountName: 'Newsletter List',
  },
];

export const availableIntegrations: AvailableIntegration[] = [
  {
    id: '1',
    name: 'Pipedrive',
    icon: 'ri-flow-chart',
    category: 'CRM',
    description: '轻量级 CRM，适合销售导向型中小企业',
    popularity: 892,
    isEnterprise: false,
  },
  {
    id: '2',
    name: 'Microsoft Dynamics 365',
    icon: 'ri-microsoft-line',
    category: 'CRM',
    description: '微软企业级 CRM，深度集成 Office 365',
    popularity: 1245,
    isEnterprise: true,
  },
  {
    id: '3',
    name: 'Meta Business Suite',
    icon: 'ri-facebook-box-line',
    category: 'Social',
    description: 'Facebook 和 Instagram 广告管理与分析',
    popularity: 2103,
    isEnterprise: false,
  },
  {
    id: '4',
    name: 'TikTok for Business',
    icon: 'ri-tiktok-line',
    category: 'Social',
    description: 'TikTok 广告投放与达人合作平台',
    popularity: 1567,
    isEnterprise: false,
  },
  {
    id: '5',
    name: 'Segment',
    icon: 'ri-shapes-line',
    category: 'Analytics',
    description: '客户数据平台，统一数据收集与分发',
    popularity: 678,
    isEnterprise: true,
  },
  {
    id: '6',
    name: 'SendGrid',
    icon: 'ri-mail-open-line',
    category: 'Email',
    description: '企业级邮件发送与送达率优化平台',
    popularity: 934,
    isEnterprise: false,
  },
  {
    id: '7',
    name: 'Calendly',
    icon: 'ri-calendar-check-line',
    category: 'Productivity',
    description: '智能会议排程，消除往返邮件确认',
    popularity: 1456,
    isEnterprise: false,
  },
  {
    id: '8',
    name: 'Zapier',
    icon: 'ri-flashlight-line',
    category: 'Automation',
    description: '无代码自动化工作流平台，连接 5000+ 应用',
    popularity: 3421,
    isEnterprise: false,
  },
];

export const apiTokens: APIToken[] = [
  {
    id: '1',
    name: '生产环境 Webhook',
    prefix: 'gos_live_',
    createdAt: '2025-05-15',
    lastUsed: '2 分钟前',
    scopes: ['campaigns:read', 'contacts:write', 'webhooks:manage'],
    isActive: true,
  },
  {
    id: '2',
    name: 'Salesforce 同步',
    prefix: 'gos_sf_',
    createdAt: '2025-04-20',
    lastUsed: '5 分钟前',
    scopes: ['contacts:read', 'contacts:write', 'deals:sync'],
    isActive: true,
  },
  {
    id: '3',
    name: '数据分析只读',
    prefix: 'gos_ro_',
    createdAt: '2025-06-01',
    lastUsed: '3 小时前',
    scopes: ['analytics:read', 'reports:read'],
    isActive: true,
  },
  {
    id: '4',
    name: '测试环境',
    prefix: 'gos_test_',
    createdAt: '2025-03-10',
    lastUsed: '14 天前',
    scopes: ['all'],
    isActive: false,
  },
];