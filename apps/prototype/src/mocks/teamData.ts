export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  status: 'active' | 'away' | 'offline';
  lastActive: string;
  campaignsManaged: number;
  leadsConverted: number;
}

export interface PendingApproval {
  id: string;
  type: 'content' | 'campaign' | 'budget' | 'access';
  title: string;
  requester: string;
  requesterAvatar: string;
  department: string;
  submittedAt: string;
  priority: 'urgent' | 'normal' | 'low';
  description: string;
  budget?: string;
  deadline?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  userAvatar: string;
  target: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'login' | 'export';
  ip?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Leo Chen',
    email: 'leo.chen@growthos.ai',
    role: '管理员',
    department: '管理',
    avatar: 'L',
    status: 'active',
    lastActive: '在线',
    campaignsManaged: 12,
    leadsConverted: 2847,
  },
  {
    id: '2',
    name: 'Sarah Weber',
    email: 'sarah.weber@growthos.ai',
    role: '战役主管',
    department: '营销',
    avatar: 'S',
    status: 'active',
    lastActive: '5 分钟前',
    campaignsManaged: 8,
    leadsConverted: 1934,
  },
  {
    id: '3',
    name: 'David Müller',
    email: 'david.m@growthos.ai',
    role: '内容策略师',
    department: '内容',
    avatar: 'D',
    status: 'active',
    lastActive: '12 分钟前',
    campaignsManaged: 6,
    leadsConverted: 1256,
  },
  {
    id: '4',
    name: 'Anna Kowalski',
    email: 'anna.k@growthos.ai',
    role: '合规专员',
    department: '合规',
    avatar: 'A',
    status: 'away',
    lastActive: '2 小时前',
    campaignsManaged: 4,
    leadsConverted: 892,
  },
  {
    id: '5',
    name: 'James Watanabe',
    email: 'james.w@growthos.ai',
    role: '数据分析师',
    department: '分析',
    avatar: 'J',
    status: 'active',
    lastActive: '1 分钟前',
    campaignsManaged: 3,
    leadsConverted: 1567,
  },
  {
    id: '6',
    name: 'Elena Rossi',
    email: 'elena.r@growthos.ai',
    role: '区域经理',
    department: '销售',
    avatar: 'E',
    status: 'offline',
    lastActive: '1 天前',
    campaignsManaged: 5,
    leadsConverted: 2134,
  },
  {
    id: '7',
    name: 'Michael Anderson',
    email: 'michael.a@growthos.ai',
    role: '技术顾问',
    department: '技术',
    avatar: 'M',
    status: 'active',
    lastActive: '8 分钟前',
    campaignsManaged: 2,
    leadsConverted: 678,
  },
  {
    id: '8',
    name: 'Lisa Park',
    email: 'lisa.p@growthos.ai',
    role: '客户成功',
    department: '客户成功',
    avatar: 'L',
    status: 'away',
    lastActive: '4 小时前',
    campaignsManaged: 7,
    leadsConverted: 1567,
  },
];

export const pendingApprovals: PendingApproval[] = [
  {
    id: '1',
    type: 'campaign',
    title: 'Q3 北美 SaaS 技术决策者战役',
    requester: 'Sarah Weber',
    requesterAvatar: 'S',
    department: '营销',
    submittedAt: '2025-06-30 09:30',
    priority: 'urgent',
    description: '针对北美 500+ 技术决策者的 LinkedIn + 邮件组合战役，预算 $45,000，目标获取 200 条 MQL。',
    budget: '$45,000',
    deadline: '2025-07-15',
  },
  {
    id: '2',
    type: 'content',
    title: 'DACH 市场白皮书：工业 4.0 合规指南',
    requester: 'David Müller',
    requesterAvatar: 'D',
    department: '内容',
    submittedAt: '2025-06-29 16:45',
    priority: 'normal',
    description: '德英双语白皮书，涵盖工业 4.0 数据合规要求，预计 40 页，需 Anna 合规审查。',
    deadline: '2025-07-20',
  },
  {
    id: '3',
    type: 'budget',
    title: '东南亚 DTC 品牌 Q3 追加预算申请',
    requester: 'Elena Rossi',
    requesterAvatar: 'E',
    department: '销售',
    submittedAt: '2025-06-28 11:20',
    priority: 'urgent',
    description: 'Q3 东南亚市场转化超预期，申请追加 $20,000 预算扩展 TikTok + 邮件渠道。',
    budget: '$20,000',
    deadline: '2025-07-05',
  },
  {
    id: '4',
    type: 'access',
    title: '为新实习生 Lisa Park 开通 CRM 权限',
    requester: 'Leo Chen',
    requesterAvatar: 'L',
    department: '管理',
    submittedAt: '2025-06-27 14:00',
    priority: 'normal',
    description: '为实习生开通 Salesforce 只读权限和 GrowthOS 完整权限，期限 3 个月。',
  },
  {
    id: '5',
    type: 'content',
    title: '日本市场博客系列（5 篇）发布审批',
    requester: 'James Watanabe',
    requesterAvatar: 'J',
    department: '分析',
    submittedAt: '2025-06-26 10:15',
    priority: 'low',
    description: '面向日本市场的 5 篇技术博客，日语原稿已完成，需内容审查和文化适配确认。',
    deadline: '2025-07-10',
  },
];

export const auditLogs: AuditLog[] = [
  {
    id: '1',
    action: '批准战役',
    user: 'Leo Chen',
    userAvatar: 'L',
    target: '欧洲制造业数字化转型战役',
    timestamp: '2025-06-30 14:32',
    type: 'approve',
  },
  {
    id: '2',
    action: '创建内容',
    user: 'David Müller',
    userAvatar: 'D',
    target: 'DACH 合规白皮书 v2',
    timestamp: '2025-06-30 13:15',
    type: 'create',
  },
  {
    id: '3',
    action: '导出数据',
    user: 'James Watanabe',
    userAvatar: 'J',
    target: 'Q2 归因报告.csv',
    timestamp: '2025-06-30 11:48',
    type: 'export',
    ip: '203.145.67.12',
  },
  {
    id: '4',
    action: '更新 ICP',
    user: 'Sarah Weber',
    userAvatar: 'S',
    target: '北美技术决策者画像',
    timestamp: '2025-06-30 10:22',
    type: 'update',
  },
  {
    id: '5',
    action: '拒绝内容',
    user: 'Anna Kowalski',
    userAvatar: 'A',
    target: 'LATAM 促销邮件（合规风险）',
    timestamp: '2025-06-29 17:05',
    type: 'reject',
  },
  {
    id: '6',
    action: '删除联系人',
    user: 'Michael Anderson',
    userAvatar: 'M',
    target: '3 条重复联系人记录',
    timestamp: '2025-06-29 15:30',
    type: 'delete',
  },
  {
    id: '7',
    action: '登录系统',
    user: 'Elena Rossi',
    userAvatar: 'E',
    target: 'Chrome / macOS',
    timestamp: '2025-06-29 09:00',
    type: 'login',
    ip: '198.51.100.42',
  },
  {
    id: '8',
    action: '批准预算',
    user: 'Leo Chen',
    userAvatar: 'L',
    target: 'Q3 北美追加预算 $25,000',
    timestamp: '2025-06-28 16:00',
    type: 'approve',
  },
  {
    id: '9',
    action: '更新设置',
    user: 'Leo Chen',
    userAvatar: 'L',
    target: '全局通知策略',
    timestamp: '2025-06-28 11:20',
    type: 'update',
  },
  {
    id: '10',
    action: '创建战役',
    user: 'Sarah Weber',
    userAvatar: 'S',
    target: '东南亚 DTC 加速器',
    timestamp: '2025-06-27 14:45',
    type: 'create',
  },
];