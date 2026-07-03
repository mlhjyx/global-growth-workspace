// EPIC-M0-03 研究域 mock（PG-003/004，母本 7.3.6 八层模型 / 7.3.7 分维度评分 / PDR-001 候选国家）
// 规则：评分必须分维度展示（禁单一黑盒分）；每条证据标注四分类（事实/供应商自述/AI推断/未知）。

export type EvidenceCategory = 'FACT' | 'VENDOR_CLAIM' | 'AI_INFERENCE' | 'UNKNOWN';

export const EVIDENCE_CATEGORY_LABELS: Record<EvidenceCategory, { label: string; cls: string }> = {
  FACT: { label: '事实', cls: 'bg-success/10 text-success border-success/30' },
  VENDOR_CLAIM: { label: '供应商自述', cls: 'bg-warning/10 text-warning border-warning/30' },
  AI_INFERENCE: {
    label: 'AI 推断',
    cls: 'bg-primary-500/10 text-primary-300 border-primary-500/30',
  },
  UNKNOWN: { label: '未知', cls: 'bg-white/5 text-foreground-500 border-white/10' },
};

export type SupportLevel = 'FULLY' | 'TEMPLATE' | 'EXPERT_REVIEW' | 'UNSUPPORTED';

export const SUPPORT_LEVEL_LABELS: Record<SupportLevel, { label: string; cls: string }> = {
  FULLY: { label: 'Fully Supported', cls: 'bg-success/10 text-success' },
  TEMPLATE: { label: 'Template Supported', cls: 'bg-primary-500/10 text-primary-300' },
  EXPERT_REVIEW: { label: 'Expert Review Required', cls: 'bg-warning/10 text-warning' },
  UNSUPPORTED: { label: 'Unsupported', cls: 'bg-error/10 text-error' },
};

// 母本 7.3.7 九维度（竞争强度/准入复杂度为反向计分，已换算为"越高越好"）
export const SCORE_DIMENSIONS = [
  { key: 'demand', label: '需求吸引力' },
  { key: 'trade_momentum', label: '贸易动量' },
  { key: 'buyer_access', label: '买家可达性' },
  { key: 'competition', label: '竞争格局（反向）' },
  { key: 'margin', label: '价格/毛利潜力' },
  { key: 'channel', label: '渠道可行性' },
  { key: 'entry', label: '准入复杂度（反向）' },
  { key: 'data', label: '数据可得性' },
  { key: 'fit', label: '战略匹配' },
] as const;

export interface MarketEvidence {
  id: string;
  subject: string;
  category: EvidenceCategory;
  source: string;
  fetched_at: string;
  confidence: number;
  quote?: string;
}

export interface MarketCandidate {
  id: string;
  country: string;
  flag: string;
  industry: '光伏能源' | '建材';
  region: '东南亚' | '非洲';
  support_level: SupportLevel;
  scores: Record<string, number>; // key = SCORE_DIMENSIONS.key
  data_as_of: string;
  headline: string;
  evidences: MarketEvidence[];
  risks: string[];
}

const ev = (
  id: string,
  subject: string,
  category: EvidenceCategory,
  source: string,
  confidence: number,
  quote?: string,
): MarketEvidence => ({
  id,
  subject,
  category,
  source,
  fetched_at: '2026-06-28',
  confidence,
  quote,
});

export const marketCandidates: MarketCandidate[] = [
  {
    id: 'mc_vn',
    country: '越南',
    flag: '🇻🇳',
    industry: '光伏能源',
    region: '东南亚',
    support_level: 'TEMPLATE',
    data_as_of: '2026-06-28',
    headline: '屋顶光伏补贴重启，组件进口量同比上行，本地组装竞争加剧',
    scores: {
      demand: 82,
      trade_momentum: 78,
      buyer_access: 70,
      competition: 48,
      margin: 55,
      channel: 72,
      entry: 60,
      data: 75,
      fit: 80,
    },
    evidences: [
      ev(
        'ev_vn1',
        '2025 年组件进口额同比 +23%',
        'FACT',
        '海关贸易数据（样例）',
        0.88,
        '进口额 12.4 亿美元，同比增长 23%',
      ),
      ev('ev_vn2', '屋顶光伏 FIT 政策 2026 重启', 'FACT', '越南工贸部公告（样例）', 0.85),
      ev('ev_vn3', '本地 EPC 商倾向直采一线组件', 'AI_INFERENCE', '多来源综合推断', 0.62),
      ev('ev_vn4', '某数据商称覆盖越南 90% 进口商', 'VENDOR_CLAIM', 'Provider 宣传页', 0.4),
    ],
    risks: ['本地组装产能扩张挤压进口组件空间', '反倾销政策风向需专家确认'],
  },
  {
    id: 'mc_id',
    country: '印尼',
    flag: '🇮🇩',
    industry: '光伏能源',
    region: '东南亚',
    support_level: 'EXPERT_REVIEW',
    data_as_of: '2026-06-28',
    headline: '本地含量要求（TKDN）高，需本地伙伴；需求增速快',
    scores: {
      demand: 76,
      trade_momentum: 71,
      buyer_access: 55,
      competition: 62,
      margin: 60,
      channel: 58,
      entry: 35,
      data: 62,
      fit: 72,
    },
    evidences: [
      ev('ev_id1', 'TKDN 本地含量要求覆盖光伏组件', 'FACT', '印尼工业部法规（样例）', 0.9),
      ev('ev_id2', '国家电力公司年度采购计划扩容', 'FACT', 'PLN 公开文件（样例）', 0.8),
      ev('ev_id3', '经销商模式或可绕开部分准入限制', 'UNKNOWN', '待专家确认', 0.3),
    ],
    risks: ['TKDN 合规路径必须专家确认（Expert Review Required）'],
  },
  {
    id: 'mc_th',
    country: '泰国',
    flag: '🇹🇭',
    industry: '光伏能源',
    region: '东南亚',
    support_level: 'TEMPLATE',
    data_as_of: '2026-06-28',
    headline: '工商业分布式需求稳定，渠道成熟，价格竞争充分',
    scores: {
      demand: 68,
      trade_momentum: 64,
      buyer_access: 74,
      competition: 45,
      margin: 50,
      channel: 76,
      entry: 65,
      data: 78,
      fit: 70,
    },
    evidences: [
      ev('ev_th1', '工商业电价上调带动自发自用需求', 'FACT', '泰国能源监管委员会（样例）', 0.82),
      ev('ev_th2', '头部分销商集中度高', 'AI_INFERENCE', '进口记录聚类推断', 0.6),
    ],
    risks: ['价格战激烈，毛利承压'],
  },
  {
    id: 'mc_ph',
    country: '菲律宾',
    flag: '🇵🇭',
    industry: '光伏能源',
    region: '东南亚',
    support_level: 'TEMPLATE',
    data_as_of: '2026-06-28',
    headline: '电价高企 + 绿色能源拍卖计划，岛屿物流复杂',
    scores: {
      demand: 74,
      trade_momentum: 66,
      buyer_access: 62,
      competition: 58,
      margin: 68,
      channel: 60,
      entry: 55,
      data: 60,
      fit: 66,
    },
    evidences: [
      ev('ev_ph1', 'GEA-3 拍卖新增光伏配额', 'FACT', '菲律宾能源部（样例）', 0.84),
      ev('ev_ph2', '岛屿间物流成本占比高', 'AI_INFERENCE', '公开物流报价综合', 0.58),
    ],
    risks: ['物流与售后网络成本高'],
  },
  {
    id: 'mc_my',
    country: '马来西亚',
    flag: '🇲🇾',
    industry: '光伏能源',
    region: '东南亚',
    support_level: 'TEMPLATE',
    data_as_of: '2026-06-28',
    headline: 'NEM 净计量配额延续，工商业屋顶需求稳定，认证路径清晰',
    scores: {
      demand: 66,
      trade_momentum: 60,
      buyer_access: 68,
      competition: 52,
      margin: 54,
      channel: 70,
      entry: 62,
      data: 72,
      fit: 64,
    },
    evidences: [
      ev('ev_my1', 'NEM 3.0 配额延续至 2026', 'FACT', '马来西亚能源委员会（样例）', 0.86),
      ev('ev_my2', 'SIRIM 认证周期约 8-12 周', 'FACT', 'SIRIM 官方（样例）', 0.8),
      ev('ev_my3', '大型 EPC 偏好东盟区域仓发货', 'AI_INFERENCE', '招标条款综合推断', 0.55),
    ],
    risks: ['本地组件产能享受政策倾斜，进口价格空间受限'],
  },
  {
    id: 'mc_ng',
    country: '尼日利亚',
    flag: '🇳🇬',
    industry: '建材',
    region: '非洲',
    support_level: 'EXPERT_REVIEW',
    data_as_of: '2026-06-28',
    headline: '城建需求旺盛，SONCAP 认证是硬门槛，外汇波动大',
    scores: {
      demand: 85,
      trade_momentum: 72,
      buyer_access: 58,
      competition: 66,
      margin: 70,
      channel: 55,
      entry: 38,
      data: 52,
      fit: 78,
    },
    evidences: [
      ev('ev_ng1', '建材进口额连续三年增长', 'FACT', '海关贸易数据（样例）', 0.8),
      ev('ev_ng2', 'SONCAP 认证为清关强制要求', 'FACT', 'SON 官方（样例）', 0.92),
      ev('ev_ng3', '奈拉汇率波动影响回款', 'FACT', '央行公开数据（样例）', 0.85),
      ev('ev_ng4', '某目录商称有 5 万建材买家名录', 'VENDOR_CLAIM', 'Provider 宣传', 0.35),
    ],
    risks: ['SONCAP 认证与外汇管制必须专家确认', '账期与回款风险高'],
  },
  {
    id: 'mc_ke',
    country: '肯尼亚',
    flag: '🇰🇪',
    industry: '建材',
    region: '非洲',
    support_level: 'TEMPLATE',
    data_as_of: '2026-06-28',
    headline: '东非枢纽，基建项目带动，KEBS 认证流程相对清晰',
    scores: {
      demand: 72,
      trade_momentum: 68,
      buyer_access: 66,
      competition: 60,
      margin: 62,
      channel: 64,
      entry: 58,
      data: 58,
      fit: 74,
    },
    evidences: [
      ev('ev_ke1', '政府保障房计划拉动板材/管材需求', 'FACT', '肯尼亚住房部（样例）', 0.78),
      ev('ev_ke2', 'KEBS PVoC 装运前验证要求', 'FACT', 'KEBS 官方（样例）', 0.88),
    ],
    risks: ['项目回款周期长'],
  },
  {
    id: 'mc_za',
    country: '南非',
    flag: '🇿🇦',
    industry: '建材',
    region: '非洲',
    support_level: 'TEMPLATE',
    data_as_of: '2026-06-28',
    headline: '市场成熟渠道规范，SABS 标准严格，竞争者多',
    scores: {
      demand: 60,
      trade_momentum: 55,
      buyer_access: 72,
      competition: 42,
      margin: 48,
      channel: 74,
      entry: 62,
      data: 76,
      fit: 62,
    },
    evidences: [
      ev('ev_za1', '五金连锁渠道集中度高', 'FACT', '零售年报（样例）', 0.8),
      ev('ev_za2', '本地产能与欧洲品牌竞争激烈', 'AI_INFERENCE', '进口结构推断', 0.65),
    ],
    risks: ['价格与品牌双重竞争'],
  },
  {
    id: 'mc_eg',
    country: '埃及',
    flag: '🇪🇬',
    industry: '建材',
    region: '非洲',
    support_level: 'EXPERT_REVIEW',
    data_as_of: '2026-06-28',
    headline: '新首都建设需求大，进口许可与外汇配额不确定性高',
    scores: {
      demand: 80,
      trade_momentum: 62,
      buyer_access: 54,
      competition: 58,
      margin: 66,
      channel: 52,
      entry: 32,
      data: 48,
      fit: 68,
    },
    evidences: [
      ev('ev_eg1', '新行政首都项目建材采购量大', 'FACT', '公开招标信息（样例）', 0.75),
      ev('ev_eg2', '进口许可发放节奏不透明', 'UNKNOWN', '待专家/当地渠道确认', 0.3),
    ],
    risks: ['进口许可与外汇是硬风险，需专家确认'],
  },
  {
    id: 'mc_ma',
    country: '摩洛哥',
    flag: '🇲🇦',
    industry: '建材',
    region: '非洲',
    support_level: 'TEMPLATE',
    data_as_of: '2026-06-28',
    headline: '2030 世界杯基建潮 + 欧非转口区位，法语区渠道需本地化',
    scores: {
      demand: 74,
      trade_momentum: 70,
      buyer_access: 60,
      competition: 55,
      margin: 58,
      channel: 62,
      entry: 56,
      data: 60,
      fit: 66,
    },
    evidences: [
      ev('ev_ma1', '场馆与配套基建招标集中释放', 'FACT', '公开招标信息（样例）', 0.8),
      ev('ev_ma2', 'NM 认证与欧标 EN 部分互认', 'FACT', 'IMANOR 官方（样例）', 0.78),
      ev('ev_ma3', '某商会称可对接 200 家进口商', 'VENDOR_CLAIM', '商会宣传（样例）', 0.35),
    ],
    risks: ['法语/阿拉伯语商务本地化成本', '项目类采购集中于少数总包商'],
  },
];

// ---- PG-004 研究工作台：进行中的研究项目 ----
export type QuestionStatus = 'ANSWERED' | 'IN_PROGRESS' | 'NEEDS_EXPERT' | 'OPEN';

export interface ResearchQuestion {
  id: string;
  layer: string; // 母本 7.3.6 八层
  question: string;
  status: QuestionStatus;
  evidence_count: number;
  conclusion?: string;
}

export const QUESTION_STATUS_LABELS: Record<QuestionStatus, { label: string; cls: string }> = {
  ANSWERED: { label: '已回答', cls: 'text-success' },
  IN_PROGRESS: { label: '研究中', cls: 'text-primary-400' },
  NEEDS_EXPERT: { label: '需专家', cls: 'text-warning' },
  OPEN: { label: '待开始', cls: 'text-foreground-500' },
};

export const activeResearch = {
  id: 'rp_001',
  market_id: 'mc_vn', // 对应 marketCandidates，工作台据此判断所选市场是否已有进行中研究
  title: '越南屋顶光伏市场深度研究',
  brief: {
    offering: '晶阳新能源 · 550W 双玻组件 + 混合逆变器',
    market: '越南（TEMPLATE 支持等级）',
    depth: '深度（八层全覆盖）',
    budget_used: 'USD 86 / 上限 USD 200',
    started_at: '2026-06-25',
  },
  progress: { answered: 9, total: 16 },
  data_as_of: '2026-07-02',
  questions: [
    {
      id: 'q1',
      layer: '全球市场筛选',
      question: '越南在东南亚候选中的综合优先级？',
      status: 'ANSWERED',
      evidence_count: 6,
      conclusion: '第 1 位（9 维中 6 维领先）',
    },
    {
      id: 'q2',
      layer: '产品与贸易',
      question: '组件进口量价趋势与季节性？',
      status: 'ANSWERED',
      evidence_count: 4,
      conclusion: '进口额 +23%，Q4 为采购高峰',
    },
    {
      id: 'q3',
      layer: '产品与贸易',
      question: '主要进口商集中度？',
      status: 'IN_PROGRESS',
      evidence_count: 2,
    },
    {
      id: 'q4',
      layer: '竞争情报',
      question: '一线中国品牌在越渠道布局？',
      status: 'ANSWERED',
      evidence_count: 5,
      conclusion: '3 家已设本地办事处，走分销为主',
    },
    {
      id: 'q5',
      layer: '竞争情报',
      question: '本地组装厂对进口组件的替代节奏？',
      status: 'IN_PROGRESS',
      evidence_count: 3,
    },
    {
      id: 'q6',
      layer: '买家地图',
      question: '屋顶光伏 EPC 的采购决策链？',
      status: 'ANSWERED',
      evidence_count: 4,
      conclusion: '技术总监主导选型，老板拍价格',
    },
    {
      id: 'q7',
      layer: '买家地图',
      question: '头部 20 家 EPC/进口商名单？',
      status: 'ANSWERED',
      evidence_count: 8,
      conclusion: '已生成候选企业池（见 Action Outputs）',
    },
    {
      id: 'q8',
      layer: '渠道研究',
      question: '行业展会与协会渠道价值？',
      status: 'ANSWERED',
      evidence_count: 3,
      conclusion: 'Solar Show Vietnam 为首选触点',
    },
    {
      id: 'q9',
      layer: '内容与传播',
      question: '买家关注的技术问题与内容形式？',
      status: 'ANSWERED',
      evidence_count: 4,
      conclusion: '双玻可靠性/湿热衰减为高频问题，短视频+白皮书',
    },
    {
      id: 'q10',
      layer: '准入与风险',
      question: '认证要求（安规/并网）？',
      status: 'NEEDS_EXPERT',
      evidence_count: 2,
    },
    {
      id: 'q11',
      layer: '准入与风险',
      question: '反倾销风险评估？',
      status: 'NEEDS_EXPERT',
      evidence_count: 1,
    },
    {
      id: 'q12',
      layer: '行动计划',
      question: '30/60/90 天进入计划？',
      status: 'ANSWERED',
      evidence_count: 0,
      conclusion: '草案已生成，待批准转 Campaign',
    },
  ] as ResearchQuestion[],
  action_outputs: [
    {
      id: 'ao1',
      type: 'ICP',
      label: '转为 ICP 草案',
      desc: '越南屋顶光伏 EPC/进口商画像（已含购买委员会）',
      done: false,
    },
    {
      id: 'ao2',
      type: 'LEADS',
      label: '转入客户发现',
      desc: '20 家优先企业池 → Lead Explorer',
      done: false,
    },
    {
      id: 'ao3',
      type: 'CAMPAIGN',
      label: '生成 Campaign 草案',
      desc: '30/60/90 天进入计划 → 战役画布',
      done: false,
    },
    {
      id: 'ao4',
      type: 'MONITOR',
      label: '加入监测',
      desc: '竞企动态 + 政策变化（月频）',
      done: true,
    },
  ],
};

// ---- 竞争情报 tab（客户视角的市场竞争对手，非本平台竞品）----
export interface CompetitorIntel {
  id: string;
  name: string;
  origin: string;
  industry: '光伏能源' | '建材';
  focus_markets: string[];
  strengths: string[];
  weaknesses: string[];
  threat: 'high' | 'medium' | 'low';
}

export const competitorIntel: CompetitorIntel[] = [
  {
    id: 'ci1',
    name: 'SolarMax Việt（样例）',
    origin: '越南本地组装',
    industry: '光伏能源',
    focus_markets: ['越南'],
    strengths: ['本地交付快', '免关税'],
    weaknesses: ['技术代差一代', '产能受限'],
    threat: 'high',
  },
  {
    id: 'ci2',
    name: 'GreenVolt Asia（样例）',
    origin: '中国出海同行',
    industry: '光伏能源',
    focus_markets: ['越南', '泰国', '菲律宾'],
    strengths: ['价格激进', '分销网密'],
    weaknesses: ['售后口碑弱'],
    threat: 'high',
  },
  {
    id: 'ci3',
    name: 'EuroBuild Materials（样例）',
    origin: '欧洲品牌',
    industry: '建材',
    focus_markets: ['南非', '肯尼亚'],
    strengths: ['品牌溢价', '标准背书'],
    weaknesses: ['价格高', '交期长'],
    threat: 'medium',
  },
  {
    id: 'ci4',
    name: 'Lagos BuildCo（样例）',
    origin: '尼日利亚本地',
    industry: '建材',
    focus_markets: ['尼日利亚'],
    strengths: ['渠道深', '账期灵活'],
    weaknesses: ['品类不全', '质量不稳'],
    threat: 'medium',
  },
];

export interface CompetitorAlert {
  id: string;
  competitor: string;
  type: 'pricing' | 'channel' | 'product' | 'policy';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  time: string;
}

export const competitorAlerts: CompetitorAlert[] = [
  {
    id: 'ca1',
    competitor: 'GreenVolt Asia（样例）',
    type: 'pricing',
    severity: 'warning',
    title: '越南市场组件报价下调约 4%（渠道反馈，待核实）',
    time: '2 天前',
  },
  {
    id: 'ca2',
    competitor: 'SolarMax Việt（样例）',
    type: 'product',
    severity: 'info',
    title: '发布 580W 新品，量产时间未知',
    time: '5 天前',
  },
  {
    id: 'ca3',
    competitor: '（政策）越南工贸部',
    type: 'policy',
    severity: 'critical',
    title: '拟修订并网验收规程（草案期）→ 已建议转专家确认',
    time: '1 周前',
  },
  {
    id: 'ca4',
    competitor: 'EuroBuild Materials（样例）',
    type: 'channel',
    severity: 'info',
    title: '与肯尼亚连锁渠道签独家协议（供应商自述）',
    time: '2 周前',
  },
];
