// M0 原型目标向导 mock —— Global Growth Workspace 目标类型（母本 8 类）。
// 合规约束：外联只走邮件和获授权渠道（D-019），一切对外发送均为「草稿生成 → 人工审批后发送」；
// 行业/区域选项对齐 PDR-001（首批做深：光伏能源、建材 × 东南亚、非洲），架构上仍由客户自选（D-004 Core+Pack）。
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

// PDR-001 试点行业置顶，其余行业保留客户自选空间（D-004）
const INDUSTRY_OPTIONS = [
  '光伏能源',
  '建材',
  '机械制造',
  '电子元器件',
  '新能源储能',
  '消费品',
  '医疗器械',
  '化工',
  '纺织服装',
  '食品饮料',
];

// PDR-001 试点区域（东南亚、非洲）国家置顶
const COUNTRY_OPTIONS = [
  '越南',
  '泰国',
  '马来西亚',
  '菲律宾',
  '印度尼西亚',
  '尼日利亚',
  '肯尼亚',
  '加纳',
  '坦桑尼亚',
  '埃及',
];

const REGION_OPTIONS = ['东南亚', '非洲', '中东', '拉美', '欧洲', '北美', '日韩', '南亚'];

export const goalOptions: GoalOption[] = [
  {
    id: 'find-customers',
    icon: 'ri-user-search-line',
    title: '寻找海外客户',
    subtitle: 'Find Overseas Customers',
    description:
      '通过 AI 驱动的 ICP 画像和信号引擎，精准定位高价值潜客，生成合规触达策略（邮件草稿，人工审批后发送）',
    color: 'from-emerald-500/20 to-teal-500/10',
  },
  {
    id: 'recruit-distributors',
    icon: 'ri-organization-chart',
    title: '招募海外经销商',
    subtitle: 'Recruit Overseas Distributors',
    description: '智能匹配优质经销商，输出结构化招募计划和谈判要点，产出销售接受的伙伴机会（SAO）',
    color: 'from-amber-500/20 to-orange-500/10',
  },
  {
    id: 'enter-new-market',
    icon: 'ri-earth-line',
    title: '进入新国家市场',
    subtitle: 'Enter a New Country Market',
    description:
      '全球市场扫描 + Market Pack 深度研究，输出市场进入评估、合规要点与首个验证 Campaign 草案',
    color: 'from-lime-500/20 to-green-500/10',
  },
  {
    id: 'promote-product',
    icon: 'ri-megaphone-line',
    title: '推广某个产品',
    subtitle: 'Promote a Product',
    description: '为新老产品制定海外推广策略，覆盖内容、获授权渠道、预算和 KPI 的全链路方案',
    color: 'from-rose-500/20 to-pink-500/10',
  },
  {
    id: 'reactivate-customers',
    icon: 'ri-restart-line',
    title: '激活历史客户',
    subtitle: 'Reactivate Historical Customers',
    description: '分析沉睡客户画像，制定分层唤醒策略，通过邮件草稿序列与获授权渠道内容触达提升复购',
    color: 'from-violet-500/20 to-purple-500/10',
  },
  {
    id: 'operate-content',
    icon: 'ri-global-line',
    title: '运营海外内容',
    subtitle: 'Operate Overseas Content',
    description:
      '构建多语言内容矩阵，AI 辅助本地化创作，经人工审批后发布到获授权渠道，提升品牌声量',
    color: 'from-sky-500/20 to-cyan-500/10',
  },
  {
    id: 'handle-inquiries',
    icon: 'ri-chat-check-line',
    title: '处理询盘与互动',
    subtitle: 'Handle Inquiries & Engagement',
    description: '统一管理跨平台询盘与互动，AI 智能分拣、生成回复草稿，把有效意向转化为 SAO',
    color: 'from-indigo-500/20 to-blue-500/10',
  },
  {
    id: 'evaluate-marketing',
    icon: 'ri-line-chart-line',
    title: '判断营销效果',
    subtitle: 'Evaluate Marketing Effectiveness',
    description:
      '以三级结果链（Qualified Lead → SAO → Verified Outcome）统一口径衡量渠道与 Campaign 效果及单位 SAO 成本',
    color: 'from-fuchsia-500/20 to-purple-500/10',
  },
];

export const goalQuestionsMap: Record<string, GoalQuestion[]> = {
  'find-customers': [
    {
      id: 'target-region',
      question: '目标市场是哪个地区？',
      description: '选择你最想开拓的海外区域',
      type: 'single',
      options: REGION_OPTIONS,
      required: true,
    },
    {
      id: 'industry',
      question: '你所处的行业是什么？',
      description: '帮助我们精准匹配行业数据库',
      type: 'select',
      options: INDUSTRY_OPTIONS,
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
      placeholder: '例如：我们主要做光伏组件出口，已有越南进口商客户...',
      required: false,
    },
  ],
  'recruit-distributors': [
    {
      id: 'target-country',
      question: '目标国家是哪个？',
      description: '选择你想要进入的新市场',
      type: 'single',
      options: COUNTRY_OPTIONS,
      required: true,
    },
    {
      id: 'industry',
      question: '产品所属行业？',
      description: '帮助匹配合适的经销商画像',
      type: 'select',
      options: INDUSTRY_OPTIONS,
      required: true,
    },
    {
      id: 'distributor-scale',
      question: '期望的经销商规模？',
      description: '这决定了招募策略和筛选标准',
      type: 'single',
      options: [
        '中小型（年营收 < 500万美元）',
        '中型（年营收 500-2000万美元）',
        '大型（年营收 > 2000万美元）',
        '不限规模',
      ],
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
      placeholder: '例如：我们的石膏板已通过 SONCAP 认证，在尼日利亚有少量试用客户...',
      required: false,
    },
  ],
  'enter-new-market': [
    {
      id: 'target-country',
      question: '想进入哪个国家市场？',
      description: '也可以选多个候选国之一，系统会做市场扫描对比',
      type: 'single',
      options: COUNTRY_OPTIONS,
      required: true,
    },
    {
      id: 'industry',
      question: '你所处的行业是什么？',
      description: '用于加载对应的 Market Pack 与合规要点',
      type: 'select',
      options: INDUSTRY_OPTIONS,
      required: true,
    },
    {
      id: 'entry-mode',
      question: '期望的进入方式？',
      description: '不确定也没关系，市场扫描会给出建议',
      type: 'single',
      options: [
        '直接出口找进口商',
        '发展本地经销商',
        '参与项目投标',
        '线上渠道销售',
        '暂不确定，需要建议',
      ],
      required: true,
    },
    {
      id: 'timeline',
      question: '期望的进入时间窗口？',
      description: '决定研究深度与验证节奏',
      type: 'single',
      options: ['3 个月内', '3-6 个月', '6-12 个月', '一年以上'],
      required: true,
    },
    {
      id: 'extra-info',
      question: '还有什么补充信息？',
      description: '例如已有认证、目标价格带、竞争对手动向等（可选）',
      type: 'textarea',
      placeholder: '例如：我们计划先做肯尼亚，已了解到当地对 KEBS 认证有要求...',
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
      options: [
        '光伏组件/逆变器',
        '建材产品',
        '工业设备',
        '消费电子',
        '家居用品',
        '原材料',
        '服装配饰',
        '食品饮料',
      ],
      required: true,
    },
    {
      id: 'target-market',
      question: '目标市场？',
      description: '选择主要推广区域',
      type: 'single',
      options: [...REGION_OPTIONS.slice(0, 6), '全球'],
      required: true,
    },
    {
      id: 'promotion-budget',
      question: '推广预算范围？',
      description: '月度推广预算（含内容、工具与数据成本）',
      type: 'single',
      options: ['3万以下', '3-10万', '10-20万', '20-50万', '50万以上'],
      required: true,
    },
    {
      id: 'extra-info',
      question: '还有什么补充信息？',
      description: '例如竞品信息、差异化卖点等（可选）',
      type: 'textarea',
      placeholder: '例如：与竞品相比，我们的组件转换效率提升 1.5 个百分点...',
      required: false,
    },
  ],
  'reactivate-customers': [
    {
      id: 'customer-segment',
      question: '要激活的客户群体是？',
      description: '之前通过什么渠道获取的客户？',
      type: 'single',
      options: [
        '展会获取的客户',
        'B2B 平台（阿里国际站等）',
        '独立站询盘客户',
        '老客户推荐',
        '线下拜访客户',
        '多种渠道混合',
      ],
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
      placeholder: '例如：这些客户主要来自东南亚，之前询盘转化率约15%...',
      required: false,
    },
  ],
  'operate-content': [
    {
      id: 'content-type',
      question: '主要想做哪类内容？',
      description: '选择内容方向，可多选（均发布在企业获授权的自有渠道）',
      type: 'multiple',
      options: [
        'LinkedIn 企业主页内容',
        '产品视频/短视频',
        '技术白皮书/案例',
        '行业博客/SEO',
        '社媒账号日常运营',
        '邮件 Newsletter',
      ],
      required: true,
    },
    {
      id: 'target-audience',
      question: '目标受众是谁？',
      description: '内容的阅读者和潜在客户',
      type: 'single',
      options: [
        '企业决策者（CEO/VP）',
        '技术采购经理',
        '行业工程师',
        '经销商/代理商',
        '终端消费者',
      ],
      required: true,
    },
    {
      id: 'target-language',
      question: '内容语言？',
      description: '主要输出的语言',
      type: 'multiple',
      options: ['英语', '越南语', '泰语', '印尼语', '法语', '阿拉伯语', '斯瓦希里语', '西班牙语'],
      required: true,
    },
    {
      id: 'extra-info',
      question: '还有什么补充信息？',
      description: '例如品牌调性、已有内容资产等（可选）',
      type: 'textarea',
      placeholder: '例如：我们已有英文官网和 LinkedIn 主页，但内容更新频率低...',
      required: false,
    },
  ],
  'handle-inquiries': [
    {
      id: 'inquiry-source',
      question: '询盘主要来源？',
      description: '选择主要的询盘渠道，可多选',
      type: 'multiple',
      options: [
        '官网表单',
        'B2B 平台',
        'LinkedIn 主页互动',
        '展会收集',
        '邮件询盘',
        'WhatsApp/微信',
      ],
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
      options: [
        '回复效率低，经常漏单',
        '不知道哪些询盘质量高',
        '缺乏统一管理平台',
        '营销效果难以量化',
        '团队协作混乱',
      ],
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
  'evaluate-marketing': [
    {
      id: 'evaluation-scope',
      question: '想评估什么范围的效果？',
      description: '决定报告的口径与拆分维度',
      type: 'single',
      options: ['某一个 Campaign', '某个渠道（如邮件外联）', '某个市场/国家', '整体营销投入'],
      required: true,
    },
    {
      id: 'key-questions',
      question: '最想回答哪些问题？',
      description: '可多选，均以三级结果链统一口径回答',
      type: 'multiple',
      options: [
        '产出了多少 Qualified Lead',
        '产出了多少 SAO 及单位成本',
        '哪些渠道/内容更有效',
        '结果是否经过销售验证（Verified Outcome）',
        '预算应如何再分配',
      ],
      required: true,
    },
    {
      id: 'data-availability',
      question: '目前有哪些数据可用？',
      description: '可多选，用于确定归因方式',
      type: 'multiple',
      options: [
        '平台内 Campaign 与触点数据',
        '邮件回复/会议记录',
        '自有 CRM 数据（可导入增强）',
        '仅有零散 Excel 记录',
      ],
      required: true,
    },
    {
      id: 'extra-info',
      question: '还有什么补充信息？',
      description: '例如老板最关心的指标、汇报周期等（可选）',
      type: 'textarea',
      placeholder: '例如：管理层每月看一次投入产出，最关心单位获客成本...',
      required: false,
    },
  ],
};

export const samplePlanMap: Record<string, PlanSection[]> = {
  'find-customers': [
    {
      id: 's1',
      title: '第一阶段：ICP 画像构建（第1-3天）',
      content:
        '基于你选择的「东南亚 + 光伏能源 + B2B」定位，系统自动生成 ICP 画像草案与 10 个样例账户。你需要逐个确认样例「是不是我要找的企业」，回测通过后 ICP 才能激活并启动批量搜索。',
      editable: true,
    },
    {
      id: 's2',
      title: '第二阶段：潜客发现与评分（第4-10天）',
      content:
        'AI 信号引擎基于获授权的数据供应商（贸易数据、企业注册库、展会名录）匹配潜客，按六维评分（匹配度/角色/意向/数据质量/可触达性/互动度）排序。预计首批产出 200-500 条候选，每条附评分依据与数据来源。',
      editable: true,
    },
    {
      id: 's3',
      title: '第三阶段：触达策略执行（第11-30天）',
      content:
        '基于确认后的 Qualified Lead 名单，AI 生成个性化邮件草稿序列（人工审批后发送）与电话跟进脚本。建议先从评分 Top 50 开始小批量测试，根据回复率迭代优化话术。',
      editable: true,
    },
    {
      id: 's4',
      title: '第四阶段：结果链追踪与优化（第31-60天）',
      content:
        '建立「触达 → 回复 → Qualified Lead → SAO → Verified Outcome」三级结果链漏斗追踪。每周生成转化报告，AI 自动识别瓶颈环节并给出优化建议，核心看板指标为月度新增 SAO 与单位 SAO 成本。',
      editable: true,
    },
  ],
  'recruit-distributors': [
    {
      id: 's1',
      title: '第一阶段：市场调研与画像（第1-5天）',
      content:
        '针对「尼日利亚 + 建材」市场，AI 输出行业经销商生态分析报告，包括：头部经销商画像、渠道结构、准入要求（SONCAP 认证与清关）、典型合作模式。',
      editable: true,
    },
    {
      id: 's2',
      title: '第二阶段：经销商筛选与触达（第6-20天）',
      content:
        '从获授权的行业数据库与贸易数据（如 HS 编码进口记录）中筛选 30-50 家目标经销商，按「行业匹配度 + 渠道覆盖 + 财务健康度」评分。AI 生成招募邮件草稿序列，经人工审批后发送。',
      editable: true,
    },
    {
      id: 's3',
      title: '第三阶段：谈判支持与签约（第21-45天）',
      content:
        '针对回复意向的经销商（转为 SAO），AI 生成谈判要点清单（独家权、最低采购量、市场支持政策等），辅助你完成商业条款协商。同步生成英文版合作方案草稿。',
      editable: true,
    },
    {
      id: 's4',
      title: '第四阶段：渠道启动与赋能（第46-90天）',
      content:
        '协助首批经销商完成产品培训、营销物料本地化、联合推广活动策划。建立渠道健康度评分体系，季度输出经销商绩效报告（签约与首单为 Verified Outcome）。',
      editable: true,
    },
  ],
  'enter-new-market': [
    {
      id: 's1',
      title: '第一阶段：全球市场扫描（第1-5天）',
      content:
        '系统对候选国家做市场扫描：需求规模、进口结构、竞争格局、价格带、渠道结构，输出进入优先级建议。每项结论附数据来源与置信度，供你确认或调整候选市场。',
      editable: true,
    },
    {
      id: 's2',
      title: '第二阶段：Market Pack 深度研究（第6-12天）',
      content:
        '针对确认的目标国家加载/构建 Market Pack：准入认证与合规要点（由规则库给出，法律与认证结论需专家确认）、清关与物流、本地商业惯例、典型买家画像与决策链。',
      editable: true,
    },
    {
      id: 's3',
      title: '第三阶段：ICP 与首批验证名单（第13-20天）',
      content:
        '基于 Market Pack 生成该市场的 ICP 草案与 10 个样例账户回测。确认后从获授权数据源产出首批 50-100 家目标企业名单，附评分与证据。',
      editable: true,
    },
    {
      id: 's4',
      title: '第四阶段：首个市场验证 Campaign（第21-60天）',
      content:
        '生成首个验证 Campaign 草案：目标（以 SAO 口径设定）、邮件草稿序列（人工审批后发送）、获授权渠道内容计划、预算与停止条件。以小步快跑验证市场假设，按周复盘回复率与 Qualified Lead 产出。',
      editable: true,
    },
  ],
  'promote-product': [
    {
      id: 's1',
      title: '第一阶段：竞品分析与定位（第1-3天）',
      content:
        '基于你输入的「光伏组件 + 东南亚市场」，AI 输出竞品分析报告：目标市场 TOP5 竞品的定价、渠道、内容策略。提炼你的差异化卖点并制定核心信息屋（关键数字与认证需引用已审核的企业 Claim）。',
      editable: true,
    },
    {
      id: 's2',
      title: '第二阶段：内容资产准备（第4-10天）',
      content:
        'AI 生成产品推广所需的核心内容：产品落地页（英文）、技术规格书、3 篇行业应用案例、获授权渠道内容日历（LinkedIn 主页 + 官网博客为主）。所有内容 AI 生成初稿后人工校对与审批。',
      editable: true,
    },
    {
      id: 's3',
      title: '第三阶段：渠道分发与引流（第11-30天）',
      content:
        '按日历将审批后的内容发布到获授权渠道，配合邮件草稿序列（人工审批后发送）触达目标企业名单。AI 根据互动数据优化内容主题与发送节奏。',
      editable: true,
    },
    {
      id: 's4',
      title: '第四阶段：询盘转化与复盘（第31-60天）',
      content:
        '建立「内容互动 → 询盘 → Qualified Lead → SAO」转化漏斗。周报自动统计各渠道产出与单位成本，AI 对比行业基准给出优化建议。',
      editable: true,
    },
  ],
  'reactivate-customers': [
    {
      id: 's1',
      title: '第一阶段：客户分析与分层（第1-3天）',
      content:
        '导入历史客户数据（展会 + B2B 平台 + 独立站），AI 自动完成客户分层：高价值（曾成交/大额询盘）、中等（多次互动未成交）、低活跃（仅一次接触）。输出分层名单和画像，并标注每条数据的来源与许可。',
      editable: true,
    },
    {
      id: 's2',
      title: '第二阶段：激活策略制定（第4-7天）',
      content:
        '针对不同层级制定差异化激活策略：高价值客户 → 一对一视频邀约/样品寄送；中等客户 → 新产品/案例邮件序列；低活跃客户 → 行业报告/Webinar 邀请。已退订或禁止联系的客户自动排除（Suppression 不可被覆盖）。',
      editable: true,
    },
    {
      id: 's3',
      title: '第三阶段：内容触达执行（第8-21天）',
      content:
        'AI 生成各层级的邮件草稿序列（人工审批后发送）与获授权渠道内容。系统追踪打开率、点击率、回复率，回复统一进入 Inbox 处理。',
      editable: true,
    },
    {
      id: 's4',
      title: '第四阶段：效果评估与迭代（第22-30天）',
      content:
        '统计激活效果：触达成功率、回复率、二次询盘率、Qualified Lead 与 SAO 产出。AI 自动识别表现最佳的触达序列并推荐扩大应用。',
      editable: true,
    },
  ],
  'operate-content': [
    {
      id: 's1',
      title: '第一阶段：内容战略规划（第1-3天）',
      content:
        '基于「企业决策者 + 英语/越南语」的目标受众和语言，AI 输出季度内容战略：核心话题矩阵、关键词策略、内容形式组合、发布频率和获授权渠道分配。',
      editable: true,
    },
    {
      id: 's2',
      title: '第二阶段：内容生产线搭建（第4-10天）',
      content:
        'AI 生成本月内容日历（12篇文章 + 8篇社媒帖子 + 2份白皮书），提供初稿。你审核修改后进入内容库；涉及数字、认证、客户案例的表述须引用已审核的企业 Claim。同步建立品牌视觉规范和内容质量标准。',
      editable: true,
    },
    {
      id: 's3',
      title: '第三阶段：发布与分发（第11-30天）',
      content:
        '按日历经人工审批后发布到获授权渠道（LinkedIn 主页、官网博客、邮件 Newsletter）。AI 监控互动数据（阅读量、分享、评论），每周输出内容表现周报。',
      editable: true,
    },
    {
      id: 's4',
      title: '第四阶段：优化与放大（第31-60天）',
      content:
        '基于前 30 天数据，识别 Top 3 高互动内容主题，加大投入。低表现内容调整角度或放弃。AI 建议下一个季度的内容方向调整。',
      editable: true,
    },
  ],
  'handle-inquiries': [
    {
      id: 's1',
      title: '第一阶段：询盘归集与清洗（第1-3天）',
      content:
        '接入你现有的询盘渠道（B2B 平台 + 官网 + 获授权社媒账号），Global Growth Workspace 统一 Inbox 归集所有询盘。AI 自动完成去重、垃圾过滤、意向初评（高/中/低），每条判定附依据。',
      editable: true,
    },
    {
      id: 's2',
      title: '第二阶段：智能分拣与跟进（第4-14天）',
      content:
        '高意向询盘生成跟进话术和报价模板草稿，推送给对应负责人确认后发送。中意向进入培育序列（案例/技术文档，审批后发送）。低意向归档备用。有效意向确认后转为 Qualified Lead 并可升级为 SAO。',
      editable: true,
    },
    {
      id: 's3',
      title: '第三阶段：团队协作上线（第15-21天）',
      content:
        '配置团队权限（管理员/销售/市场），建立 SLA 规则（如 4 小时内首次响应）。所有跟进记录自动留存，形成客户时间线与审计记录。',
      editable: true,
    },
    {
      id: 's4',
      title: '第四阶段：效果归因与报告（第22-30天）',
      content:
        '生成首个 30 天效果报告：询盘来源分析、响应速度、Qualified Lead → SAO 转化漏斗、渠道产出对比。AI 给出 3 条关键优化建议。',
      editable: true,
    },
  ],
  'evaluate-marketing': [
    {
      id: 's1',
      title: '第一阶段：口径统一与基线梳理（第1-3天）',
      content:
        '将现有营销数据映射到三级结果链统一口径：Qualified Lead → SAO → Verified Outcome。梳理各渠道/Campaign 的历史投入与产出基线，标注数据时间与缺失范围。',
      editable: true,
    },
    {
      id: 's2',
      title: '第二阶段：归因与漏斗核对（第4-10天）',
      content:
        '采用简单透明的归因模型（首触/末触）核对各渠道贡献，逐条对齐触点记录（邮件回复、会议、样品）。每个 SAO 均可回溯到来源 Campaign 与证据，避免黑盒归因。',
      editable: true,
    },
    {
      id: 's3',
      title: '第三阶段：效果报告生成（第11-14天）',
      content:
        '输出效果报告：各渠道/Campaign 的 Qualified Lead 数、SAO 数、单位 SAO 成本、经销售验证的结果（Verified Outcome）。报告中的每个数字可下钻到具体对象。',
      editable: true,
    },
    {
      id: 's4',
      title: '第四阶段：预算再分配建议（第15-21天）',
      content:
        'AI 基于单位 SAO 成本与验证率给出预算再分配建议（建议需你确认后才会调整任何 Campaign）。建立月度复盘节奏，持续跟踪北极星指标变化。',
      editable: true,
    },
  ],
};
