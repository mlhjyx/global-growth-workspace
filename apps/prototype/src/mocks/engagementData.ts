// M0 原型 Batch 1（数据与术语层）：互动域 mock 对齐母本 ENG-004 意图分类与三级结果链
// （Demo Gap Analysis F 组结论：0-100 intentScore 废弃，改「意图类别 + 置信度」；
//   「转为线索」改「确认为 Qualified Lead / 创建机会（SAO 候选）」；CRM 是可选同步目标，不是主库 ENG-011）。
// 叙事对齐 PDR-001：光伏（东南亚）与建材（非洲）买家询盘，公司/机会与 contracts/fixtures 一致。

// ---- 意图分类（母本 ENG-004 九类枚举）----

export type IntentCategory =
  | 'INQUIRY' // 询价
  | 'SAMPLE_REQUEST' // 样品
  | 'DEMO_REQUEST' // Demo
  | 'PARTNERSHIP' // 合作
  | 'TECHNICAL_QUESTION' // 技术问题
  | 'REFERRAL' // 转介
  | 'NOT_NOW' // 暂不考虑
  | 'COMPLAINT' // 投诉
  | 'UNSUBSCRIBE'; // 退订

export const INTENT_CATEGORY_LABELS: Record<IntentCategory, string> = {
  INQUIRY: '询价',
  SAMPLE_REQUEST: '样品',
  DEMO_REQUEST: 'Demo',
  PARTNERSHIP: '合作',
  TECHNICAL_QUESTION: '技术问题',
  REFERRAL: '转介',
  NOT_NOW: '暂不考虑',
  COMPLAINT: '投诉',
  UNSUBSCRIBE: '退订',
};

/** 高意向类别（用于队列排序与顶栏计数；低置信度仍需人工确认，ENG-004） */
export const HIGH_INTENT_CATEGORIES: IntentCategory[] = [
  'INQUIRY',
  'SAMPLE_REQUEST',
  'DEMO_REQUEST',
  'PARTNERSHIP',
];

/** AI 意图判定：类别 + 置信度（%），替代旧 0-100 黑盒 intentScore */
export interface IntentAssessment {
  category: IntentCategory;
  confidence: number;
}

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
  /** 意图类别 + 置信度（ENG-004），替代旧 intentScore */
  intent: IntentAssessment;
  intentSignals: string[];
  /** converted = 已确认 Qualified Lead 并创建机会（SAO 候选） */
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

// ---- 消息样本：建材（尼日利亚/肯尼亚）× 光伏（越南/泰国/马来西亚/印尼）----
// msg1/msg2 对应 fixtures/opportunities.json 的两个机会（Lagos BuildMart / Nairobi Hardware）。

export const mockEngagementMessages: EngagementMessage[] = [
  {
    id: 'msg1',
    platform: 'email',
    type: 'private_message',
    sender: {
      name: 'Chinedu Okafor',
      avatar: 'CO',
      company: 'Lagos BuildMart Distribution Ltd.',
      title: 'Procurement Director',
      location: 'Lagos, Nigeria',
    },
    subject: 'Re: Water-resistant gypsum board dealership - Lagos region',
    preview: 'Thank you for the follow-up. We are interested in the regional exclusivity terms...',
    body: 'Thank you for the follow-up. We are interested in the regional exclusivity terms you mentioned for Lagos.\n\nBefore we proceed, please clarify:\n1. What are the conditions and minimum volume for regional exclusivity?\n2. First container terms - pricing, payment terms, and lead time to Apapa port?\n3. Do you handle SONCAP certification and customs clearance support, or is that on our side?\n\nWe currently distribute ceiling boards and partition systems to 40+ project contractors in Lagos and Abuja. If terms are workable we would like to move quickly.\n\nBest regards,\nChinedu Okafor',
    timestamp: '2026-06-26T09:41:00',
    isRead: true,
    intent: { category: 'INQUIRY', confidence: 92 },
    intentSignals: [
      '主动询问区域独家政策',
      '首柜价格与账期条件',
      'SONCAP 清关分工',
      '40+ 下游承包商网络',
    ],
    status: 'converted',
    assignedTo: 'David Müller',
    tags: ['建材', '尼日利亚', 'SAO'],
    priority: 'high',
  },
  {
    id: 'msg2',
    platform: 'email',
    type: 'private_message',
    sender: {
      name: 'Grace Wanjiru',
      avatar: 'GW',
      company: 'Nairobi Hardware & Ceilings Ltd.',
      title: 'Managing Director',
      location: 'Nairobi, Kenya',
    },
    subject: 'Re: Introduction - moisture-resistant gypsum board for Kenyan market',
    preview: 'The video call was helpful. Please send sample boards for our quality inspection...',
    body: 'The video call was helpful, thank you.\n\nPlease send sample boards (both 9mm and 12mm moisture-resistant) for our quality inspection. Our warehouse address is on file. Once samples pass inspection we will discuss the first trial container and an annual dealership framework.\n\nAlso please share KEBS certification documents in advance so our compliance team can review in parallel.\n\nRegards,\nGrace Wanjiru',
    timestamp: '2026-06-29T12:30:00',
    isRead: true,
    intent: { category: 'SAMPLE_REQUEST', confidence: 88 },
    intentSignals: [
      '明确样品规格需求',
      '首柜试销 + 年度框架意向',
      'KEBS 认证文件请求',
      '会议后正向推进',
    ],
    status: 'converted',
    assignedTo: 'David Müller',
    tags: ['建材', '肯尼亚', '已验证结果'],
    priority: 'high',
  },
  {
    id: 'msg3',
    platform: 'email',
    type: 'private_message',
    sender: {
      name: 'Nguyen Van Thanh',
      avatar: 'NT',
      company: 'Mekong Solar Trading Co., Ltd.',
      title: 'Purchasing Manager',
      location: 'Ho Chi Minh City, Vietnam',
    },
    subject: 'Inquiry: TOPCon 545W+ modules - CIF Ho Chi Minh pricing',
    preview: 'We are an importer and distributor of PV modules in southern Vietnam...',
    body: 'Dear Sales Team,\n\nWe are an importer and distributor of PV modules in southern Vietnam, supplying EPC contractors for C&I rooftop projects.\n\nPlease quote:\n- TOPCon bifacial modules, 545W and above\n- Quantity: 1 container (approx. 620 pcs) for first order, 5+ containers annually if quality is stable\n- CIF Ho Chi Minh City, payment by L/C at sight\n\nPlease also confirm CE / IEC 61215 certificates and local warranty handling.\n\nBest regards,\nNguyen Van Thanh',
    timestamp: '2026-07-02T08:15:00',
    isRead: false,
    intent: { category: 'INQUIRY', confidence: 90 },
    intentSignals: [
      '明确规格与数量',
      'CIF 报价与 L/C 付款条件',
      '年度 5+ 柜潜在量',
      '认证文件核验需求',
    ],
    status: 'new',
    tags: ['光伏', '越南', '进口商'],
    priority: 'high',
  },
  {
    id: 'msg4',
    platform: 'linkedin',
    type: 'private_message',
    sender: {
      name: 'Somchai Rattanakorn',
      avatar: 'SR',
      company: 'Siam Sunrise Power Co., Ltd.',
      title: 'EPC Project Director',
      location: 'Bangkok, Thailand',
    },
    subject: 'Technical presentation for upcoming 8MW rooftop portfolio',
    preview: 'Saw your post about anti-PID performance in tropical climates. We have an 8MW...',
    body: 'Hello, saw your post about anti-PID performance in tropical climates.\n\nWe have an 8MW C&I rooftop portfolio (4 sites) starting Q4 and are shortlisting module suppliers. Could your team do an online technical presentation covering:\n- Degradation data in high-humidity environments\n- Bankability / insurance coverage\n- Delivery schedule from your factory to Laem Chabang\n\nWeek of July 13 works for us.',
    timestamp: '2026-07-01T16:20:00',
    isRead: false,
    intent: { category: 'DEMO_REQUEST', confidence: 76 },
    intentSignals: ['8MW 项目组合明确', 'Q4 启动时间表', '主动约定演示时间窗口'],
    status: 'new',
    tags: ['光伏', '泰国', 'EPC'],
    priority: 'high',
  },
  {
    id: 'msg5',
    platform: 'email',
    type: 'private_message',
    sender: {
      name: 'Ibrahim Musa',
      avatar: 'IM',
      company: 'Abuja Construction Supplies Ltd.',
      title: 'General Manager',
      location: 'Abuja, Nigeria',
    },
    subject: 'Dealership interest - Abuja and northern region',
    preview:
      'We received your introduction letter. We are interested in becoming your dealer for Abuja...',
    body: 'Dear Sir/Madam,\n\nWe received your introduction letter regarding water-resistant gypsum board dealership.\n\nWe are interested in becoming your dealer for Abuja and the northern region. We operate 3 warehouses and supply building materials to government and private projects.\n\nCan you share your dealership policy, especially territory protection and marketing support? We would also like to know if Lagos region is already taken.\n\nThank you,\nIbrahim Musa',
    timestamp: '2026-07-01T11:05:00',
    isRead: true,
    intent: { category: 'PARTNERSHIP', confidence: 81 },
    intentSignals: ['明确经销合作意向', '3 个仓库与项目渠道', '询问区域保护政策'],
    status: 'read',
    tags: ['建材', '尼日利亚', '经销商'],
    priority: 'medium',
  },
  {
    id: 'msg6',
    platform: 'email',
    type: 'private_message',
    sender: {
      name: 'Lim Wei Jian',
      avatar: 'LW',
      company: 'Penang SolarTech Sdn. Bhd.',
      title: 'Technical Director',
      location: 'Penang, Malaysia',
    },
    subject: 'Question: PID degradation data and warranty terms in tropical climate',
    preview: 'Before we evaluate commercial terms, our engineering team needs clarification on...',
    body: 'Hello,\n\nBefore we evaluate commercial terms, our engineering team needs clarification:\n\n1. Do you have third-party PID test reports under 85C/85% RH conditions?\n2. What is the annual degradation warranty for the first year and years 2-30?\n3. How are warranty claims handled locally in Malaysia - do you have a service partner here?\n\nWe ask because a previous supplier failed on warranty execution.\n\nThanks,\nLim Wei Jian',
    timestamp: '2026-06-30T14:40:00',
    isRead: true,
    intent: { category: 'TECHNICAL_QUESTION', confidence: 84 },
    intentSignals: ['第三方测试报告请求', '质保条款核验', '本地履约能力关注'],
    status: 'read',
    tags: ['光伏', '马来西亚', '技术评估'],
    priority: 'medium',
  },
  {
    id: 'msg7',
    platform: 'email',
    type: 'private_message',
    sender: {
      name: 'Budi Santoso',
      avatar: 'BS',
      company: 'PT Surya Nusantara Jakarta',
      title: 'Procurement Lead',
      location: 'Jakarta, Indonesia',
    },
    subject: 'Referral: our sister company in Surabaya needs rooftop modules',
    preview: 'Your offer does not fit our current project, but our sister company in Surabaya...',
    body: 'Hello,\n\nYour offer does not fit our current utility-scale project (we need 600W+), but our sister company in Surabaya is sourcing modules for commercial rooftop distribution.\n\nI have copied their procurement contact, Ms. Dewi Lestari. Please reach out to her directly - mention my referral.\n\nBest,\nBudi Santoso',
    timestamp: '2026-06-28T10:20:00',
    isRead: true,
    intent: { category: 'REFERRAL', confidence: 71 },
    intentSignals: ['明确转介对象与联系人', '姐妹公司采购需求', '本体需求不匹配'],
    status: 'read',
    tags: ['光伏', '印尼', '转介'],
    priority: 'low',
  },
  {
    id: 'msg8',
    platform: 'email',
    type: 'private_message',
    sender: {
      name: 'Samuel Adeyemi',
      avatar: 'SA',
      company: 'Delta Coast Trading Ltd.',
      title: 'Managing Director',
      location: 'Port Harcourt, Nigeria',
    },
    subject: 'Re: Dealership opportunity - not this year',
    preview:
      'Thank you for the proposal. However we have decided not to add new brands this year...',
    body: 'Thank you for the proposal and the case studies.\n\nHowever, we have decided not to add new brand agencies this year due to budget constraints. Please keep our contact - we plan to review new suppliers again in Q1 2027.\n\nRegards,\nSamuel Adeyemi',
    timestamp: '2026-07-02T08:00:00',
    isRead: true,
    intent: { category: 'NOT_NOW', confidence: 87 },
    intentSignals: ['预算受限明确拒绝', '保留 2027 Q1 回访窗口'],
    status: 'read',
    tags: ['建材', '尼日利亚', '机会已撤回'],
    priority: 'low',
  },
  {
    id: 'msg9',
    platform: 'email',
    type: 'private_message',
    sender: {
      name: 'Kanya Phromsurin',
      avatar: 'KP',
      company: 'Bangkok Solar Import Co., Ltd.',
      title: 'Import Manager',
      location: 'Bangkok, Thailand',
    },
    subject: 'Complaint: duplicate emails received',
    preview: 'We have received the same introduction email three times this month. Please check...',
    body: 'To whom it may concern,\n\nWe have received the same introduction email three times this month, addressed to two different colleagues. This is excessive.\n\nPlease check your mailing practices. We do not mind hearing from suppliers, but not duplicated outreach like this.\n\nKanya Phromsurin',
    timestamp: '2026-07-01T09:10:00',
    isRead: false,
    intent: { category: 'COMPLAINT', confidence: 78 },
    intentSignals: ['重复触达投诉', '同企业多联系人去重缺失', '需人工升级处理'],
    status: 'new',
    tags: ['光伏', '泰国', '投诉升级'],
    priority: 'high',
  },
  {
    id: 'msg10',
    platform: 'email',
    type: 'private_message',
    sender: {
      name: 'Joseph Kamau',
      avatar: 'JK',
      company: 'Mombasa Building Depot',
      title: 'Owner',
      location: 'Mombasa, Kenya',
    },
    subject: 'Unsubscribe',
    preview: 'Please remove this address from your mailing list. We are not interested...',
    body: 'Please remove this address from your mailing list. We are not interested in new suppliers.\n\nJoseph Kamau',
    timestamp: '2026-06-30T07:45:00',
    isRead: true,
    intent: { category: 'UNSUBSCRIBE', confidence: 96 },
    intentSignals: ['明确退订请求', '需写入 Suppression（不可解除类型）'],
    status: 'archived',
    tags: ['建材', '肯尼亚', 'Suppression'],
    priority: 'high',
  },
];

export const mockConversations: Record<string, ConversationReply[]> = {
  msg1: [
    {
      id: 'r1-1',
      messageId: 'msg1',
      from: 'user',
      senderName: 'Sarah Weber',
      body: 'Dear Mr. Okafor, following up on our introduction - beyond the SONCAP-certified product line, we offer regional exclusivity for qualified dealers in Lagos. Happy to share the dealership policy if of interest.',
      timestamp: '2026-06-25T10:00:00',
    },
    {
      id: 'r1-2',
      messageId: 'msg1',
      from: 'sender',
      senderName: 'Chinedu Okafor',
      body: 'Thank you for the follow-up. We are interested in the regional exclusivity terms you mentioned for Lagos. Please clarify exclusivity conditions, first container terms, and SONCAP clearance support.',
      timestamp: '2026-06-26T09:41:00',
    },
    {
      id: 'r1-3',
      messageId: 'msg1',
      from: 'user',
      senderName: 'David Müller',
      body: 'Mr. Okafor, thank you for the detailed questions. We handle SONCAP certification on our side; clearance is coordinated jointly. I have booked the video call for June 30 as agreed - we will walk through exclusivity volume thresholds and first container pricing there.',
      timestamp: '2026-06-27T08:30:00',
    },
  ],
  msg2: [
    {
      id: 'r2-1',
      messageId: 'msg2',
      from: 'sender',
      senderName: 'Grace Wanjiru',
      body: 'We reviewed your first email and the project case for the Mombasa mall ceiling. Happy to take a 30-minute video call this week.',
      timestamp: '2026-06-27T10:30:00',
    },
    {
      id: 'r2-2',
      messageId: 'msg2',
      from: 'user',
      senderName: 'David Müller',
      body: 'Thank you Ms. Wanjiru - call confirmed for June 29, 13:00 EAT. We will cover product specs, KEBS certification status and trial container terms.',
      timestamp: '2026-06-27T14:00:00',
    },
    {
      id: 'r2-3',
      messageId: 'msg2',
      from: 'sender',
      senderName: 'Grace Wanjiru',
      body: 'The video call was helpful, thank you. Please send sample boards (9mm and 12mm moisture-resistant) for our quality inspection, and KEBS documents in advance.',
      timestamp: '2026-06-29T12:30:00',
    },
  ],
  msg3: [
    {
      id: 'r3-1',
      messageId: 'msg3',
      from: 'sender',
      senderName: 'Nguyen Van Thanh',
      body: 'We are an importer and distributor of PV modules in southern Vietnam. Please quote TOPCon bifacial 545W+, 1 container first order, CIF Ho Chi Minh City, L/C at sight.',
      timestamp: '2026-07-02T08:15:00',
    },
  ],
  msg9: [
    {
      id: 'r9-1',
      messageId: 'msg9',
      from: 'sender',
      senderName: 'Kanya Phromsurin',
      body: 'We have received the same introduction email three times this month, addressed to two different colleagues. Please check your mailing practices.',
      timestamp: '2026-07-01T09:10:00',
    },
  ],
};

export const mockEngagementAIInsights: EngagementAIInsight[] = [
  {
    id: 'eai1',
    messageId: 'msg1',
    type: 'summary',
    title: '对话摘要与背景',
    content:
      'Chinedu Okafor 是 Lagos BuildMart（拉各斯建材经销商，40+ 下游承包商）的采购总监。对第 2 封跟进邮件回复，主动询问区域独家政策、首柜条件与 SONCAP 清关分工。会议已完成，机会已被销售接受（SAO），下一步：7-08 前发出经销协议草案与首柜报价。',
    confidence: 95,
    actionable: false,
  },
  {
    id: 'eai2',
    messageId: 'msg1',
    type: 'follow_up',
    title: '跟进话术草稿（需人工确认后发送）',
    content:
      '基于对方关注点（独家条件、首柜账期、SONCAP 分工），建议在协议草案邮件中给出量化的独家门槛与首柜 L/C 条款，并附 SONCAP 办理流程说明。',
    suggestedReply:
      'Dear Mr. Okafor, as promised, attached is the draft dealership agreement for the Lagos region, including exclusivity volume thresholds, first container pricing (CIF Apapa) and payment terms. We handle SONCAP certification; clearance documents will be prepared jointly. Happy to review together this week.',
    confidence: 89,
    actionable: true,
    actionText: '复制草稿（发送需审批）',
  },
  {
    id: 'eai3',
    messageId: 'msg1',
    type: 'opportunity',
    title: '结果链状态',
    content:
      '该会话已确认为 Qualified Lead 并创建机会「Lagos BuildMart · 耐水石膏板区域经销权（拉各斯）」：阶段 MEETING，资格状态 SALES_ACCEPTED（SAO），预估价值 $25,000-$60,000。机会来源与会话上下文已保留（ENG-007）。',
    confidence: 92,
    actionable: true,
    actionText: '查看机会详情',
  },
  {
    id: 'eai4',
    messageId: 'msg3',
    type: 'summary',
    title: '对话摘要与背景',
    content:
      'Nguyen Van Thanh 是 Mekong Solar（越南南部光伏进口分销商）采购经理。首封询盘即给出明确规格（TOPCon 545W+）、数量（首单 1 柜、年度 5+ 柜）与付款条件（L/C at sight），并要求 CE/IEC 认证文件。意图判定：询价，置信度 90%。',
    confidence: 93,
    actionable: false,
  },
  {
    id: 'eai5',
    messageId: 'msg3',
    type: 'follow_up',
    title: '跟进话术草稿（需人工确认后发送）',
    content:
      '建议回复中先确认认证文件与质保安排（对方核验意图明显），再给出 CIF 胡志明报价区间与交期；报价类结论需经人工确认后发出，不由 AI 直接给出最终价格（D-018）。',
    suggestedReply:
      'Dear Mr. Thanh, thank you for the detailed inquiry. Attached are our CE and IEC 61215/61730 certificates. Our sales team will confirm the CIF Ho Chi Minh quotation for 620 pcs TOPCon 545W bifacial within 2 business days, together with lead time and local warranty handling.',
    confidence: 86,
    actionable: true,
    actionText: '复制草稿（发送需审批）',
  },
  {
    id: 'eai6',
    messageId: 'msg3',
    type: 'opportunity',
    title: '转化建议',
    content:
      '询价类别、高置信度（90%）、明确数量与付款条件，符合 Qualified Lead 确认标准。建议人工复核后「确认为 Qualified Lead」，并在报价沟通推进后「创建机会（SAO 候选）」交由销售接受。',
    confidence: 88,
    actionable: true,
    actionText: '确认为 Qualified Lead',
  },
  {
    id: 'eai7',
    messageId: 'msg9',
    type: 'risk',
    title: '投诉处理提示（需人工升级）',
    content:
      '重复触达投诉：同一企业两位联系人在一个月内收到 3 封相同邮件，指向名单去重与频率上限失效。建议：人工致歉回复；将该企业加入频率豁免复核；核查授权频率上限（每联系人每周 ≤2 次）为何未拦截。投诉属独立处理策略，不进入常规回复队列（ENG-013）。',
    confidence: 90,
    actionable: true,
    actionText: '升级人工处理',
  },
];

export const mockEngagementActivities: EngagementActivity[] = [
  {
    id: 'ea1',
    user: 'David Müller',
    userAvatar: 'D',
    action: '确认为 Qualified Lead',
    target: 'Chinedu Okafor（Lagos BuildMart）',
    platform: 'email',
    time: '6天前',
    type: 'convert',
  },
  {
    id: 'ea2',
    user: 'David Müller',
    userAvatar: 'D',
    action: '创建机会（SAO 候选）',
    target: 'Lagos BuildMart · 拉各斯区域经销权',
    platform: 'email',
    time: '6天前',
    type: 'convert',
  },
  {
    id: 'ea3',
    user: '系统',
    userAvatar: 'S',
    action: '记录了',
    target: 'Nairobi Hardware 视频会议结果（人工验证通过）',
    platform: 'email',
    time: '4天前',
    type: 'alert',
  },
  {
    id: 'ea4',
    user: 'AI 助手',
    userAvatar: 'AI',
    action: '生成了',
    target: 'Mekong Solar 询盘跟进话术草稿（发送需审批）',
    platform: 'email',
    time: '1小时前',
    type: 'ai_suggest',
  },
  {
    id: 'ea5',
    user: 'Anna Kowalski',
    userAvatar: 'A',
    action: '升级处理',
    target: 'Bangkok Solar Import 重复触达投诉',
    platform: 'email',
    time: '昨天',
    type: 'escalate',
  },
  {
    id: 'ea6',
    user: '系统',
    userAvatar: 'S',
    action: '写入 Suppression',
    target: 'Mombasa Building Depot 退订请求（不可解除）',
    platform: 'email',
    time: '3天前',
    type: 'alert',
  },
  {
    id: 'ea7',
    user: 'Sarah Weber',
    userAvatar: 'S',
    action: '分派了',
    target: 'Siam Sunrise Power 技术演示请求 → David Müller',
    platform: 'linkedin',
    time: '昨天',
    type: 'assign',
  },
  {
    id: 'ea8',
    user: 'David Müller',
    userAvatar: 'D',
    action: '回复了',
    target: 'Grace Wanjiru 的样品请求（样品板已安排发出）',
    platform: 'email',
    time: '2天前',
    type: 'respond',
  },
];
