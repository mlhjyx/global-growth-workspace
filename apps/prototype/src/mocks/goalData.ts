// Goal types for GrowthOS
export interface GoalOption {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string; // Tailwind gradient class
}

export interface GoalQuestion {
  id: string;
  question: string;
  description: string;
  type: 'single' | 'multiple' | 'text' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];
  required: boolean;
}

export interface GoalSession {
  goalId: string;
  goalTitle: string;
  answers: Record<string, string | string[]>;
  plan: PlanSection[];
  createdAt: string;
}

export interface PlanSection {
  id: string;
  title: string;
  content: string;
  editable: boolean;
}

export const goalOptions: GoalOption[] = [
  {
    id: 'find-customers',
    icon: 'ri-user-search-line',
    title: '寻找海外客户',
    subtitle: 'Find Overseas Customers',
    description: '通过 AI 驱动的 ICP 画像和信号引擎，精准定位高价值潜客，自动生成触达策略',
    color: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    id: 'recruit-distributors',
    icon: 'ri-organization-chart',
    title: '招募海外经销商',
    subtitle: 'Recruit Overseas Distributors',
    description: '进入新国家市场，智能匹配优质经销商，输出结构化招募计划和谈判要点',
    color: 'from-amber-500/20 to-orange-500/10',
  },
  {
    id: 'promote-product',
    icon: 'ri-megaphone-line',
    title: '推广某个产品',
    subtitle: 'Promote a Product',
    description: '为新老产品制定海外推广策略，覆盖内容、渠道、预算和 KPI 的全链路方案',
    color: 'from-rose-500/20 to-pink-500/10',
  },
  {
    id: 'reactivate-customers',
    icon: 'ri-restart-line',
    title: '激活历史客户',
    subtitle: 'Reactivate Historical Customers',
    description: '分析沉睡客户画像，制定分层唤醒策略，通过多渠道内容触达提升复购率',
    color: 'from-violet-500/20 to-purple-500/10',
  },
  {
    id: 'operate-content',
    icon: 'ri-global-line',
    title: '运营海外内容',
    subtitle: 'Operate Overseas Content',
    description: '构建多语言内容矩阵，AI 辅助本地化创作，提升海外社交媒体品牌声量',
    color: 'from-sky-500/20 to-cyan-500/10',
  },
  {
    id: 'handle-inquiries',
    icon: 'ri-chat-check-line',
    title: '处理询盘与互动',
    subtitle: 'Handle Inquiries & Engagement',
    description: '统一管理跨平台询盘与互动，AI 智能分拣、生成回复话术，量化营销 ROI',
    color: 'from-indigo-500/20 to-blue-500/10',
  },
];

export const goalQuestionsMap: Record<string, GoalQuestion[]> = {
  'find-customers': [
    {
      id: 'target-region',
      question: '目标市场是哪个地区？',
      description: '选择你最想开拓的海外区域',
      type: 'single',
      options: ['北美', '欧洲', '东南亚', '中东', '拉美', '日韩', '南亚', '非洲'],
      required: true,
    },
    {
      id: 'industry',
      question: '你所处的行业是什么？',
      description: '帮助我们精准匹配行业数据库',
      type: 'select',
      options: ['机械制造', '电子元器件', '新能源', '消费品', '医疗器械', '建材家居', '化工', 'IT与软件', '纺织服装', '食品饮料'],
      required: true,
    },
    {
      id: 'customer-type',
      question: '目标客户类型？',
      description: 'B2B 还是 B2C？这决定了获客策略',
      type: 'single',
      options: ['B2B 企业客户', 'B2C 终端消费者', '两者都有'],
      required: true,
    },
    {
      id: 'monthly-budget',
      question: '每月获客预算范围？',
      description: '用于推荐合适的渠道组合',
      type: 'single',
      options: ['5万以下', '5-15万', '15-30万', '30-50万', '50万以上'],
      required: true,
    },
    {
      id: 'extra-info',
      question: '还有什么补充信息？',
      description: '可以描述现有客户画像、竞争情况等（可选）',
      type: 'textarea',
      placeholder: '例如：我们主要做工业自动化设备，已有欧洲客户...',
      required: false,
    },
  ],
  'recruit-distributors': [
    {
      id: 'target-country',
      question: '目标国家是哪个？',
      description: '选择你想要进入的新市场',
      type: 'single',
      options: ['美国', '德国', '日本', '英国', '法国', '澳大利亚', '巴西', '印度', '泰国', '阿联酋'],
      required: true,
    },
    {
      id: 'industry',
      question: '产品所属行业？',
      description: '帮助匹配合适的经销商画像',
      type: 'select',
      options: ['机械制造', '电子元器件', '新能源', '消费品', '医疗器械', '建材家居', '化工', 'IT与软件', '纺织服装', '食品饮料'],
      required: true,
    },
    {
      id: 'distributor-scale',
      question: '期望的经销商规模？',
      description: '这决定了招募策略和筛选标准',
      type: 'single',
      options: ['中小型（年营收 < 500万美元）', '中型（年营收 500-2000万美元）', '大型（年营收 > 2000万美元）', '不限规模'],
      required: true,
    },
    {
      id: 'existing-presence',
      question: '目前在该国家有业务基础吗？',
      description: '从零开始还是已有部分客户？',
      type: 'single',
      options: ['完全从零开始', '已有少量客户/询盘', '已有一定品牌认知', '已有代理商但需优化'],
      required: true,
    },
    {
      id: 'extra-info',
      question: '还有什么补充信息？',
      description: '例如产品优势、认证资质、竞争格局等（可选）',
      type: 'textarea',
      placeholder: '例如：我们产品已通过CE认证，在德国有少量试用客户...',
      required: false,
    },
  ],
  'promote-product': [
    {
      id: 'product-name',
      question: '产品名称是什么？',
      description: '可以是具体产品名或产品线名称',
      type: 'text',
      placeholder: '输入产品名称...',
      required: true,
    },
    {
      id: 'product-category',
      question: '产品类别？',
      description: '帮助确定推广策略',
      type: 'single',
      options: ['工业设备', '消费电子', '家居用品', '医疗器械', '软件/SaaS', '原材料', '服装配饰', '食品饮料'],
      required: true,
    },
    {
      id: 'target-market',
      question: '目标市场？',
      description: '选择主要推广区域',
      type: 'single',
      options: ['北美', '欧洲', '东南亚', '中东', '拉美', '日韩', '全球'],
      required: true,
    },
    {
      id: 'promotion-budget',
      question: '推广预算范围？',
      description: '月度推广预算（含广告、内容、工具）',
      type: 'single',
      options: ['3万以下', '3-10万', '10-20万', '20-50万', '50万以上'],
      required: true,
    },
    {
      id: 'extra-info',
      question: '还有什么补充信息？',
      description: '例如竞品信息、差异化卖点等（可选）',
      type: 'textarea',
      placeholder: '例如：与竞品相比，我们的产品续航提升30%...',
      required: false,
    },
  ],
  'reactivate-customers': [
    {
      id: 'customer-segment',
      question: '要激活的客户群体是？',
      description: '之前通过什么渠道获取的客户？',
      type: 'single',
      options: ['展会获取的客户', 'B2B 平台（阿里国际站等）', '独立站询盘客户', '老客户推荐', '线下拜访客户', '多种渠道混合'],
      required: true,
    },
    {
      id: 'inactive-period',
      question: '客户沉默时长？',
      description: '大约多久没有互动了？',
      type: 'single',
      options: ['3-6个月', '6-12个月', '1-2年', '2年以上'],
      required: true,
    },
    {
      id: 'customer-count',
      question: '待激活客户数量？',
      description: '大致数量范围',
      type: 'single',
      options: ['50个以下', '50-200个', '200-500个', '500-1000个', '1000个以上'],
      required: true,
    },
    {
      id: 'extra-info',
      question: '还有什么补充信息？',
      description: '例如客户画像、历史成交情况等（可选）',
      type: 'textarea',
      placeholder: '例如：这些客户主要来自欧洲，之前询盘转化率约15%...',
      required: false,
    },
  ],
  'operate-content': [
    {
      id: 'content-type',
      question: '主要想做哪类内容？',
      description: '选择内容方向，可多选',
      type: 'multiple',
      options: ['LinkedIn 专业内容', '产品视频/短视频', '技术白皮书/案例', '行业博客/SEO', '社媒日常运营', '邮件营销内容'],
      required: true,
    },
    {
      id: 'target-audience',
      question: '目标受众是谁？',
      description: '内容的阅读者和潜在客户',
      type: 'single',
      options: ['企业决策者（CEO/VP）', '技术采购经理', '行业工程师', '经销商/代理商', '终端消费者'],
      required: true,
    },
    {
      id: 'target-language',
      question: '内容语言？',
      description: '主要输出的语言',
      type: 'multiple',
      options: ['英语', '西班牙语', '日语', '德语', '法语', '阿拉伯语', '葡萄牙语'],
      required: true,
    },
    {
      id: 'extra-info',
      question: '还有什么补充信息？',
      description: '例如品牌调性、已有内容资产等（可选）',
      type: 'textarea',
      placeholder: '例如：我们已有英文官网和LinkedIn页面，但内容更新频率低...',
      required: false,
    },
  ],
  'handle-inquiries': [
    {
      id: 'inquiry-source',
      question: '询盘主要来源？',
      description: '选择主要的询盘渠道，可多选',
      type: 'multiple',
      options: ['官网表单', 'B2B 平台', 'LinkedIn', '展会收集', '邮件询盘', 'WhatsApp/微信'],
      required: true,
    },
    {
      id: 'monthly-volume',
      question: '月均询盘量？',
      description: '大约每月收到多少询盘？',
      type: 'single',
      options: ['20条以下', '20-50条', '50-100条', '100-200条', '200条以上'],
      required: true,
    },
    {
      id: 'current-pain',
      question: '当前最大的痛点是什么？',
      description: '帮你定位核心问题',
      type: 'single',
      options: ['回复效率低，经常漏单', '不知道哪些询盘质量高', '缺乏统一管理平台', '营销效果难以量化', '团队协作混乱'],
      required: true,
    },
    {
      id: 'extra-info',
      question: '还有什么补充信息？',
      description: '例如团队规模、使用工具等（可选）',
      type: 'textarea',
      placeholder: '例如：目前3人团队，用Excel记录询盘，希望提升跟进效率...',
      required: false,
    },
  ],
};

export const samplePlanMap: Record<string, PlanSection[]> = {
  'find-customers': [
    { id: 's1', title: '第一阶段：ICP 画像构建（第1-3天）', content: '基于你选择的「北美 + 机械制造 + B2B」定位，系统将自动生成 3 个 ICP 画像。你需要审核并微调画像维度（企业规模、技术栈、采购周期等），确认后 AI 将启动信号引擎进行潜客匹配。', editable: true },
    { id: 's2', title: '第二阶段：潜客发现与评分（第4-10天）', content: 'AI 信号引擎将从 LinkedIn、行业数据库、展会名录等渠道抓取匹配潜客，按「意向评分 + 数据完整度」排序输出。预计首批产出 200-500 条潜客，含联系人信息和信号摘要。', editable: true },
    { id: 's3', title: '第三阶段：触达策略执行（第11-30天）', content: '基于潜客列表，AI 生成个性化触达序列（LinkedIn 私信 + 邮件 + 电话脚本）。建议先从评分 Top 50 开始测试，根据回复率迭代优化话术。', editable: true },
    { id: 's4', title: '第四阶段：漏斗追踪与优化（第31-60天）', content: '建立从「触达 → 回复 → 意向确认 → 询盘 → 成交」的完整漏斗追踪。每周生成转化报告，AI 自动识别瓶颈环节并给出优化建议。', editable: true },
  ],
  'recruit-distributors': [
    { id: 's1', title: '第一阶段：市场调研与画像（第1-5天）', content: '针对「美国 + 医疗器械」市场，AI 将输出一份行业经销商生态分析报告，包括：头部经销商画像、渠道结构、准入要求（FDA/CE认证）、典型合作模式。', editable: true },
    { id: 's2', title: '第二阶段：经销商筛选与触达（第6-20天）', content: '从行业数据库和 LinkedIn 中筛选 30-50 家目标经销商，按「行业匹配度 + 渠道覆盖 + 财务健康度」评分。AI 生成标准招募邮件和初次接触话术。', editable: true },
    { id: 's3', title: '第三阶段：谈判支持与签约（第21-45天）', content: '针对有意向的经销商，AI 生成谈判要点清单（独家权、最低采购量、市场支持政策等），辅助你完成商业条款协商。同步生成英文版合作方案。', editable: true },
    { id: 's4', title: '第四阶段：渠道启动与赋能（第46-90天）', content: '协助首批经销商完成产品培训、营销物料本地化、联合推广活动策划。建立渠道健康度评分体系，季度输出经销商绩效报告。', editable: true },
  ],
  'promote-product': [
    { id: 's1', title: '第一阶段：竞品分析与定位（第1-3天）', content: '基于你输入的「工业设备 + 东南亚市场」，AI 输出竞品分析报告：东南亚 TOP5 竞品的定价、渠道、内容策略。提炼你的差异化卖点并制定核心信息屋。', editable: true },
    { id: 's2', title: '第二阶段：内容资产准备（第4-10天）', content: 'AI 生成产品推广所需的核心内容：产品落地页（英文）、技术规格书、3 篇行业应用案例、社交媒体内容日历（LinkedIn + Facebook 为主）。所有内容可英文生成后人工校对。', editable: true },
    { id: 's3', title: '第三阶段：渠道投放与引流（第11-30天）', content: '同步启动 LinkedIn 精准推送 + Google Ads 搜索广告。AI 根据转化数据自动优化投放策略（关键词、受众、出价）。预计日均引入 50-100 精准访客。', editable: true },
    { id: 's4', title: '第四阶段：询盘转化与复盘（第31-60天）', content: '建立从「点击 → 留资 → 询盘 → 跟进 → 成交」的转化漏斗。周报自动统计各渠道 ROI，AI 对比行业基准给出优化建议。', editable: true },
  ],
  'reactivate-customers': [
    { id: 's1', title: '第一阶段：客户分析与分层（第1-3天）', content: '导入历史客户数据（展会 + B2B 平台 + 独立站），AI 自动完成客户分层：高价值（曾成交/大额询盘）、中等（多次互动未成交）、低活跃（仅一次接触）。输出分层名单和画像。', editable: true },
    { id: 's2', title: '第二阶段：激活策略制定（第4-7天）', content: '针对不同层级制定差异化激活策略：高价值客户 → 一对一视频邀约/样品寄送；中等客户 → 新产品/案例邮件序列；低活跃客户 → 行业报告/Webinar 邀请。', editable: true },
    { id: 's3', title: '第三阶段：内容触达执行（第8-21天）', content: 'AI 生成各层级的触达内容（邮件序列、LinkedIn 私信模板、微信文案），按计划节奏自动/半自动发送。系统追踪打开率、点击率、回复率。', editable: true },
    { id: 's4', title: '第四阶段：效果评估与迭代（第22-30天）', content: '统计激活效果：触达成功率、回复率、二次询盘率、成交转化率。AI 自动识别表现最佳的触达序列并推荐全量推广。', editable: true },
  ],
  'operate-content': [
    { id: 's1', title: '第一阶段：内容战略规划（第1-3天）', content: '基于「企业决策者 + 英语/日语」的目标受众和语言，AI 输出季度内容战略：核心话题矩阵、关键词策略、内容形式组合、发布频率和渠道分配。', editable: true },
    { id: 's2', title: '第二阶段：内容生产线搭建（第4-10天）', content: 'AI 生成本月内容日历（12篇文章 + 8篇社媒帖子 + 2份白皮书），提供初稿。你审核修改后进入内容库。同步建立品牌视觉规范和内容质量标准。', editable: true },
    { id: 's3', title: '第三阶段：发布与分发（第11-30天）', content: '按日历自动/手动发布到 LinkedIn、官网博客、邮件 Newsletter。AI 监控互动数据（阅读量、分享、评论），每周输出内容表现周报。', editable: true },
    { id: 's4', title: '第四阶段：优化与放大（第31-60天）', content: '基于前 30 天数据，识别 Top 3 高互动内容主题，加大投入。低表现内容调整角度或放弃。AI 建议下一个季度的内容方向调整。', editable: true },
  ],
  'handle-inquiries': [
    { id: 's1', title: '第一阶段：询盘归集与清洗（第1-3天）', content: '接入你现有的询盘渠道（B2B 平台 + 官网 + LinkedIn），GrowthOS 统一 Inbox 归集所有询盘。AI 自动完成去重、垃圾过滤、意向初评（高/中/低）。', editable: true },
    { id: 's2', title: '第二阶段：智能分拣与跟进（第4-14天）', content: '高意向询盘自动生成跟进话术和报价模板，Push 到对应负责人。中意向进入培育序列（自动发送案例/技术文档）。低意向归档备用。AI 追踪响应时间和转化率。', editable: true },
    { id: 's3', title: '第三阶段：团队协作上线（第15-21天）', content: '配置团队权限（管理员/销售/市场），建立 SLA 规则（如 4 小时内首次响应）。所有跟进记录自动留存，形成客户时间线。', editable: true },
    { id: 's4', title: '第四阶段：效果归因与报告（第22-30天）', content: '生成首个 30 天效果报告：询盘来源分析、响应速度、意向转化漏斗、渠道 ROI 对比。AI 给出 3 条关键优化建议。', editable: true },
  ],
};