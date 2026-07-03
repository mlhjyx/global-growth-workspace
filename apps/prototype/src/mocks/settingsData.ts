export interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface NotificationChannel {
  channel: string;
  email: boolean;
  inApp: boolean;
  slack: boolean;
}

export interface SecuritySession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export const settingSections: SettingSection[] = [
  {
    id: 'profile',
    title: '个人资料',
    description: '管理姓名、头像、时区和联系方式',
    icon: 'ri-user-line',
  },
  {
    id: 'notifications',
    title: '通知偏好',
    description: '配置邮件、应用内和 Slack 通知规则',
    icon: 'ri-notification-3-line',
  },
  {
    id: 'security',
    title: '安全与认证',
    description: '密码、双因素认证和登录会话管理',
    icon: 'ri-shield-check-line',
  },
  {
    id: 'workspace',
    title: '工作区设置',
    description: '企业信息、品牌配置和默认偏好',
    icon: 'ri-building-line',
  },
  {
    id: 'billing',
    title: '计费与套餐',
    description: '查看当前套餐、用量和发票历史',
    icon: 'ri-bank-card-line',
  },
];

export const notificationSettings: NotificationChannel[] = [
  { channel: '战役里程碑达成', email: true, inApp: true, slack: true },
  { channel: '新线索分配', email: true, inApp: true, slack: false },
  { channel: '内容审批请求', email: true, inApp: true, slack: true },
  { channel: '预算告警（80%）', email: true, inApp: true, slack: true },
  { channel: '竞品重大动态', email: true, inApp: false, slack: false },
  { channel: '系统维护通知', email: true, inApp: true, slack: false },
  { channel: 'AI 洞察发现', email: false, inApp: true, slack: true },
  { channel: '周报生成完成', email: false, inApp: true, slack: false },
];

export const securitySessions: SecuritySession[] = [
  {
    id: '1',
    device: 'MacBook Pro',
    browser: 'Chrome 126',
    location: '上海, 中国',
    ip: '223.104.12.45',
    lastActive: '当前会话',
    isCurrent: true,
  },
  {
    id: '2',
    device: 'iPhone 15 Pro',
    browser: 'Safari',
    location: '上海, 中国',
    ip: '223.104.12.67',
    lastActive: '2 小时前',
    isCurrent: false,
  },
  {
    id: '3',
    device: 'Windows PC',
    browser: 'Edge 125',
    location: '新加坡',
    ip: '203.145.67.12',
    lastActive: '3 天前',
    isCurrent: false,
  },
];

export const usageStats = {
  contactsUsed: 28473,
  contactsLimit: 50000,
  campaignsUsed: 12,
  campaignsLimit: 20,
  storageUsed: 4.2,
  storageLimit: 10,
  teamMembers: 8,
  teamLimit: 15,
};
