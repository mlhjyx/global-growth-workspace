// accounts 域视图模型 —— 一律从 @/data/fixtures（packages/contracts/fixtures）派生，
// 禁止再造与契约冲突的假数据（Demo Gap Analysis 结论 3、C 组 accountData.ts「重做」判定）。
// 契约对齐：lead/account、lead/contact、lead/lead（8 态 + queue 四类）、lead/lead-score（六维评分）、
// common/field-evidence（字段级数据权利）、lead/signal（信号类型合法枚举，含 TRADE 贸易信号）。
import {
  accounts as fxAccounts,
  contacts as fxContacts,
  contactsByAccount,
  leadByAccountId,
  scoreByLeadId,
  evidencesByEntity,
  fieldEvidences,
  icpDefinitions,
  buyingCommitteeRoles,
  LEAD_STATE_LABELS,
  SCORE_DIMENSION_LABELS,
} from '@/data/fixtures';

// ---------------------------------------------------------------------------
// 契约枚举类型（与 packages/contracts/json-schema/lead/* 保持一致）
// ---------------------------------------------------------------------------

/** lead.schema.json status 八态 */
export type LeadStatus =
  | 'DISCOVERED'
  | 'ENRICHING'
  | 'REVIEW'
  | 'QUALIFIED'
  | 'REJECTED'
  | 'SUPPRESSED'
  | 'CONTACTED'
  | 'CONVERTED';

/** lead.schema.json queue 四类（LED-008） */
export type LeadQueue = 'RECOMMENDED' | 'NEEDS_CONFIRMATION' | 'REJECTED' | 'DO_NOT_CONTACT';

/** signal.schema.json signal_type 合法枚举（LED-014；TRADE 对光伏/建材是核心信号源） */
export type SignalType =
  'TRADE' | 'HIRING' | 'FUNDING' | 'WEBSITE' | 'CONTENT' | 'RELATIONSHIP_CHANGE' | 'EVENT';

/** signal.schema.json status */
export type SignalStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED';

const SCORE_DIMENSION_KEYS = [
  'fit',
  'role',
  'intent',
  'data_quality',
  'reachability',
  'engagement',
] as const;
export type ScoreDimensionKey = (typeof SCORE_DIMENSION_KEYS)[number];

// ---------------------------------------------------------------------------
// 展示词典（契约枚举 → 中文标签；Lead 状态与六维标签用 fixtures 统一词典）
// ---------------------------------------------------------------------------

export { LEAD_STATE_LABELS, SCORE_DIMENSION_LABELS };

/** queue 四类标签（lead.schema.json：推荐、待确认、拒绝、禁止联系） */
export const LEAD_QUEUE_LABELS: Record<LeadQueue, string> = {
  RECOMMENDED: '推荐',
  NEEDS_CONFIRMATION: '待确认',
  REJECTED: '已拒绝',
  DO_NOT_CONTACT: '禁止联系',
};

export const COUNTRY_LABELS: Record<string, string> = {
  VN: '越南',
  TH: '泰国',
  MY: '马来西亚',
  PH: '菲律宾',
  ID: '印度尼西亚',
  NG: '尼日利亚',
  KE: '肯尼亚',
  GH: '加纳',
  TZ: '坦桑尼亚',
  EG: '埃及',
  ZA: '南非',
};

export const INDUSTRY_LABELS: Record<string, string> = {
  solar_distribution: '光伏分销',
  renewable_energy: '可再生能源',
  solar_epc: '光伏 EPC',
  engineering: '工程服务',
  electrical_wholesale: '电气批发',
  pv_module_manufacturing: '光伏组件制造',
  building_materials_distribution: '建材分销',
  hardware_retail: '五金零售',
  plumbing_wholesale: '管材批发',
  construction_contractor: '建筑承包',
  interior_fitout: '室内装修',
};

export const BUYING_ROLE_LABELS: Record<string, string> = {
  DECISION_MAKER: '决策人',
  INFLUENCER: '影响者',
  USER: '使用者',
  TECHNICAL: '技术评估',
  FINANCE: '财务',
  PROCUREMENT: '采购',
};

export const SCORE_METHOD_LABELS: Record<string, string> = {
  RULE: '规则',
  STATISTICAL: '统计',
  LLM: 'LLM',
  HUMAN_FEEDBACK: '人工反馈',
  COMPOSITE: '组合',
};

export const VERIFICATION_LABELS: Record<string, string> = {
  VALID: '已验证',
  UNVERIFIED: '未验证',
  EXPIRED: '已过期',
  INVALID: '无效',
};

export const ICP_STATUS_LABELS: Record<string, string> = {
  DRAFT: '草稿',
  HYPOTHESIS: '假设',
  VALIDATING: '回测中',
  ACTIVE: '激活中',
  SUPERSEDED: '已替代',
  ARCHIVED: '已归档',
};

export const SIGNAL_STATUS_LABELS: Record<SignalStatus, string> = {
  ACTIVE: '有效',
  EXPIRED: '已过期',
  REVOKED: '已撤回',
};

/** 信号类型展示配置（键 = signal.schema.json signal_type 合法枚举） */
export const signalTypeConfig: Record<SignalType, { icon: string; label: string; color: string }> =
  {
    TRADE: { icon: 'ri-ship-line', label: '贸易', color: 'text-success' },
    HIRING: { icon: 'ri-user-add-line', label: '招聘', color: 'text-primary-400' },
    FUNDING: { icon: 'ri-money-dollar-circle-line', label: '融资', color: 'text-data-highlight' },
    WEBSITE: { icon: 'ri-global-line', label: '网站', color: 'text-info' },
    CONTENT: { icon: 'ri-article-line', label: '内容', color: 'text-foreground-500' },
    RELATIONSHIP_CHANGE: { icon: 'ri-links-line', label: '关系变化', color: 'text-warning' },
    EVENT: { icon: 'ri-calendar-event-line', label: '展会活动', color: 'text-info' },
  };

/**
 * Lead 状态徽章（8 态，文字取 LEAD_STATE_LABELS）。
 * REJECTED（业务拒绝，中性灰）与 SUPPRESSED（禁止联系，合规硬约束）必须区分显示：
 * SUPPRESSED 用醒目警示色 + 禁止图标，模型不得覆盖（LED-007）。
 */
export const statusConfig: Record<
  LeadStatus,
  { label: string; color: string; bg: string; icon?: string }
> = {
  DISCOVERED: {
    label: LEAD_STATE_LABELS.DISCOVERED,
    color: 'text-foreground-500',
    bg: 'bg-foreground-500/10',
  },
  ENRICHING: { label: LEAD_STATE_LABELS.ENRICHING, color: 'text-info', bg: 'bg-info/10' },
  REVIEW: { label: LEAD_STATE_LABELS.REVIEW, color: 'text-warning', bg: 'bg-warning/10' },
  QUALIFIED: { label: LEAD_STATE_LABELS.QUALIFIED, color: 'text-success', bg: 'bg-success/10' },
  REJECTED: {
    label: LEAD_STATE_LABELS.REJECTED,
    color: 'text-foreground-400',
    bg: 'bg-foreground-500/10',
  },
  SUPPRESSED: {
    label: LEAD_STATE_LABELS.SUPPRESSED,
    color: 'text-error',
    bg: 'bg-error/15 border border-error/40',
    icon: 'ri-forbid-line',
  },
  CONTACTED: {
    label: LEAD_STATE_LABELS.CONTACTED,
    color: 'text-primary-400',
    bg: 'bg-primary-500/10',
  },
  CONVERTED: {
    label: LEAD_STATE_LABELS.CONVERTED,
    color: 'text-data-highlight',
    bg: 'bg-data-highlight/10',
  },
};

export const queueConfig: Record<
  LeadQueue,
  { label: string; color: string; bg: string; icon?: string }
> = {
  RECOMMENDED: { label: LEAD_QUEUE_LABELS.RECOMMENDED, color: 'text-success', bg: 'bg-success/10' },
  NEEDS_CONFIRMATION: {
    label: LEAD_QUEUE_LABELS.NEEDS_CONFIRMATION,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  REJECTED: {
    label: LEAD_QUEUE_LABELS.REJECTED,
    color: 'text-foreground-400',
    bg: 'bg-foreground-500/10',
  },
  DO_NOT_CONTACT: {
    label: LEAD_QUEUE_LABELS.DO_NOT_CONTACT,
    color: 'text-error',
    bg: 'bg-error/15 border border-error/40',
    icon: 'ri-forbid-line',
  },
};

// ---------------------------------------------------------------------------
// 视图类型（从契约实体派生，字段名保留契约语义）
// ---------------------------------------------------------------------------

export interface ScoreEvidenceView {
  evidenceType: string; // lead-score.schema score_evidence.evidence_type
  description: string;
  observedAt: string;
  fieldName?: string;
  contribution?: number;
}

export interface ScoreDimensionView {
  key: ScoreDimensionKey;
  label: string; // SCORE_DIMENSION_LABELS
  score: number; // 0-100
  method: string; // RULE/STATISTICAL/LLM/HUMAN_FEEDBACK/COMPOSITE
  computedAt: string;
  expiresAt?: string;
  evidence: ScoreEvidenceView[];
}

/** common/field-evidence 字段级数据权利视图（DAT-005：展示/导出/AI/外联分别检查） */
export interface FieldEvidenceView {
  entityId: string;
  entityLabel: string; // 账户 / 联系人
  fieldName: string;
  providerId: string;
  licenseId: string;
  fetchedAt: string;
  expiresAt: string;
  confidence: number; // 0-1
  allowedToDisplay: boolean;
  allowedToExport: boolean;
  allowedForAI: boolean;
  allowedForOutreach: boolean;
}

export interface ContactView {
  id: string;
  name: string;
  title: string;
  buyingRole: string; // 契约 buying_role 枚举
  /** 展示值：allowed_to_display=false 或无明文时为 value_masked（界面遮罩） */
  email: string;
  emailMasked: boolean; // true = 已按数据权利遮罩
  emailVerification: string; // VALID/UNVERIFIED/EXPIRED/INVALID
  suppressed: boolean;
  isPrimary: boolean;
}

export interface Account {
  id: string; // acc_ 前缀
  leadId: string; // led_ 前缀
  company: string;
  domain: string;
  industry: string; // 主行业中文标签（TopBar 搜索兼容）
  industries: string[]; // 全部行业中文标签
  country: string; // 中文国家名（TopBar 搜索兼容）
  countryCode: string;
  employees: string; // employee_range
  revenue: string; // revenue_range
  score: number; // lead-score.total_priority（列表可显示；展开处显示六维分项）
  leadStatus: LeadStatus;
  queue: LeadQueue;
  riskFlags: string[];
  hardExclusionApplied: boolean; // 命中硬性排除，模型不得覆盖（LED-007）
  suppressionApplied: boolean; // 命中全局 Suppression，禁止进入发送队列
  dimensions: ScoreDimensionView[]; // 六维评分（不再用单一黑盒分数）
  weightsSnapshot: Partial<Record<ScoreDimensionKey, number>>;
  contacts: ContactView[];
  evidences: FieldEvidenceView[];
  dataQuality: number; // data_quality 维度分（0-100）
  lastVerifiedAt: string;
  icpId: string;
}

// ---------------------------------------------------------------------------
// 账户视图：20 个账户（光伏/建材 × 东南亚/非洲，来自 contracts fixtures）
// ---------------------------------------------------------------------------

const toDay = (iso?: string) => (iso ? String(iso).slice(0, 10) : '');

const toContactView = (c: any): ContactView => {
  const emailPoint = (c.contact_points ?? []).find((p: any) => p.type === 'EMAIL');
  const emailEvidence = evidencesByEntity(c.id).find(
    (e) => e.field_name === 'contact_points.email',
  );
  const displayAllowed = emailEvidence ? emailEvidence.allowed_to_display !== false : true;
  const masked = !displayAllowed || !emailPoint?.value;
  return {
    id: c.id,
    name: c.full_name,
    title: c.current_role?.title ?? '',
    buyingRole: c.buying_role ?? '',
    email: masked ? (emailPoint?.value_masked ?? '***') : emailPoint.value,
    emailMasked: masked && !displayAllowed,
    emailVerification: emailPoint?.verification_status ?? 'UNVERIFIED',
    suppressed: Boolean(c.suppression?.suppressed || emailPoint?.suppressed),
    isPrimary: Boolean(emailPoint?.is_primary),
  };
};

const toEvidenceView = (e: any, entityLabel: string): FieldEvidenceView => ({
  entityId: e.entity_id,
  entityLabel,
  fieldName: e.field_name,
  providerId: e.provider_id,
  licenseId: e.license_id,
  fetchedAt: toDay(e.fetched_at),
  expiresAt: toDay(e.expires_at),
  confidence: e.confidence ?? 0,
  allowedToDisplay: e.allowed_to_display !== false,
  allowedToExport: e.allowed_to_export === true,
  allowedForAI: e.allowed_for_ai === true,
  allowedForOutreach: e.allowed_for_outreach === true,
});

export const mockAccounts: Account[] = fxAccounts.map((a) => {
  const lead = leadByAccountId.get(a.id);
  const score = lead ? scoreByLeadId.get(lead.id) : undefined;
  const cts = contactsByAccount(a.id);
  const dimensions: ScoreDimensionView[] = score
    ? SCORE_DIMENSION_KEYS.map((key) => {
        const d = score.dimensions[key];
        return {
          key,
          label: SCORE_DIMENSION_LABELS[key],
          score: d.score,
          method: d.method,
          computedAt: toDay(d.computed_at),
          expiresAt: toDay(d.expires_at),
          evidence: (d.evidence ?? []).map((ev: any) => ({
            evidenceType: ev.evidence_type,
            description: ev.description,
            observedAt: toDay(ev.observed_at),
            fieldName: ev.field_name,
            contribution: ev.contribution,
          })),
        };
      })
    : [];
  const evidences: FieldEvidenceView[] = [
    ...evidencesByEntity(a.id).map((e) => toEvidenceView(e, '账户')),
    ...cts.flatMap((c) => evidencesByEntity(c.id).map((e) => toEvidenceView(e, '联系人'))),
  ];
  const industries = (a.industries ?? []).map((i: string) => INDUSTRY_LABELS[i] ?? i);
  return {
    id: a.id,
    leadId: lead?.id ?? '',
    company: a.name,
    domain: a.domains?.[0] ?? '',
    industry: industries[0] ?? '',
    industries,
    country: COUNTRY_LABELS[a.country] ?? a.country,
    countryCode: a.country,
    employees: a.employee_range ?? '',
    revenue: a.revenue_range ?? '—',
    score: score?.total_priority ?? lead?.latest_priority ?? 0,
    leadStatus: (lead?.status ?? 'DISCOVERED') as LeadStatus,
    queue: (lead?.queue ?? 'NEEDS_CONFIRMATION') as LeadQueue,
    riskFlags: lead?.risk_flags ?? [],
    hardExclusionApplied: Boolean(score?.hard_exclusion_applied),
    suppressionApplied: Boolean(score?.suppression_applied),
    dimensions,
    weightsSnapshot: score?.weights_snapshot ?? {},
    contacts: cts.map(toContactView),
    evidences,
    dataQuality: score?.dimensions?.data_quality?.score ?? Math.round((a.quality_score ?? 0) * 100),
    lastVerifiedAt: toDay(a.last_verified_at),
    icpId: lead?.icp_id ?? a.matched_icp_ids?.[0] ?? '',
  };
});

const accountNameById = new Map(fxAccounts.map((a) => [a.id, a.name]));

// ---------------------------------------------------------------------------
// ICP 视图：fixtures.icpDefinitions + buyingCommitteeRoles
// （2 个 ICP：光伏 → 东南亚、建材 → 非洲经销商，PDR-001）
// ---------------------------------------------------------------------------

export interface ICPCriterionView {
  criterionId: string;
  field: string;
  operator: string;
  value?: unknown;
  requirementLevel: string; // MUST_HAVE / NICE_TO_HAVE
  weight?: number;
  rationale?: string;
}

export interface ICPExclusionView {
  criterionId: string;
  field: string;
  value?: unknown;
  reason: string;
}

export interface ICPTriggerSignalView {
  signalType: SignalType;
  subtype: string;
  minStrength?: number;
  lookbackDays?: number;
  weight?: number;
}

export interface CommitteeRoleView {
  id: string;
  roleType: string; // DECISION_MAKER/INFLUENCER/USER/TECHNICAL/FINANCE/PROCUREMENT
  name: string;
  description: string;
  typicalTitles: string[];
  weight: number;
  requiredForQualification: boolean;
  kpis: string[];
  objections: string[];
  informationNeeds: string[];
}

export interface ICPProfile {
  id: string; // icp_ 前缀
  name: string;
  description: string;
  status: string; // DRAFT/HYPOTHESIS/VALIDATING/ACTIVE/SUPERSEDED/ARCHIVED
  active: boolean; // status === 'ACTIVE'
  version: number;
  marketScope: string[]; // 国家中文标签
  businessScenarios: string[];
  painPoints: string[];
  criteria: ICPCriterionView[];
  exclusions: ICPExclusionView[];
  triggerSignals: ICPTriggerSignalView[];
  committee: CommitteeRoleView[];
  weights: Partial<Record<ScoreDimensionKey, number>>;
  matchCount: number; // 命中账户数（matched_icp_ids 派生）
  backtestPassed: boolean;
}

export const mockICPs: ICPProfile[] = icpDefinitions.map((icp) => ({
  id: icp.id,
  name: icp.name,
  description: icp.description,
  status: icp.status,
  active: icp.status === 'ACTIVE',
  version: icp.version,
  marketScope: (icp.market_scope ?? []).map((c: string) => COUNTRY_LABELS[c] ?? c),
  businessScenarios: icp.business_scenarios ?? [],
  painPoints: icp.pain_points ?? [],
  criteria: (icp.criteria ?? []).map((c: any) => ({
    criterionId: c.criterion_id,
    field: c.field,
    operator: c.operator,
    value: c.value,
    requirementLevel: c.requirement_level,
    weight: c.weight,
    rationale: c.rationale,
  })),
  exclusions: (icp.exclusions ?? []).map((x: any) => ({
    criterionId: x.criterion_id,
    field: x.field,
    value: x.value,
    reason: x.reason,
  })),
  triggerSignals: (icp.trigger_signals ?? []).map((s: any) => ({
    signalType: s.signal_type as SignalType,
    subtype: s.subtype,
    minStrength: s.min_strength,
    lookbackDays: s.lookback_days,
    weight: s.weight,
  })),
  committee: buyingCommitteeRoles
    .filter((r) => r.icp_id === icp.id)
    .map((r) => ({
      id: r.id,
      roleType: r.role_type,
      name: r.name,
      description: r.description,
      typicalTitles: r.typical_titles ?? [],
      weight: r.weight ?? 0,
      requiredForQualification: Boolean(r.required_for_qualification),
      kpis: r.kpis ?? [],
      objections: r.objections ?? [],
      informationNeeds: r.information_needs ?? [],
    })),
  weights: icp.weights ?? {},
  matchCount: fxAccounts.filter((a) => (a.matched_icp_ids ?? []).includes(icp.id)).length,
  backtestPassed: (icp.backtests ?? []).some((b: any) => b.passed),
}));

// ---------------------------------------------------------------------------
// 信号流：数据为静态编造，但类型/字段名对齐 signal.schema.json
// （signal_type 合法枚举 + strength/confidence 区分 + status/expires_at + source）
// ---------------------------------------------------------------------------

export interface SignalEvent {
  id: string; // sig_ 前缀
  workspace_id: string;
  account_id: string;
  signal_type: SignalType;
  subtype: string;
  title: string;
  summary: string;
  strength: number; // 0-1（参与 Intent 评分，LED-006）
  confidence: number; // 0-1（真实性置信度，与强度区分）
  status: SignalStatus; // EXPIRED 自动降低 Intent（LED-014）
  detected_at: string;
  expires_at: string;
  source: { provider_id: string; source_url?: string };
  attributes?: Record<string, unknown>;
  // —— 以下为原型视图辅助字段（非契约字段）——
  accountName: string;
  timeLabel: string;
  read: boolean;
}

const WS_ID = 'ws_01JZW0RK000000000000000001';
const sig = (
  n: number,
  accountId: string,
  signal_type: SignalType,
  subtype: string,
  title: string,
  summary: string,
  strength: number,
  confidence: number,
  status: SignalStatus,
  detected_at: string,
  expires_at: string,
  provider_id: string,
  timeLabel: string,
  read: boolean,
  attributes?: Record<string, unknown>,
  source_url?: string,
): SignalEvent => ({
  id: `sig_01JZS1GN0000000000000000${String(n).padStart(2, '0')}`,
  workspace_id: WS_ID,
  account_id: accountId,
  signal_type,
  subtype,
  title,
  summary,
  strength,
  confidence,
  status,
  detected_at,
  expires_at,
  source: { provider_id, ...(source_url ? { source_url } : {}) },
  attributes,
  accountName: accountNameById.get(accountId) ?? accountId,
  timeLabel,
  read,
});

export const mockSignalEvents: SignalEvent[] = [
  sig(
    1,
    'acc_01JZACCT000000000000000001',
    'TRADE',
    'pv_module_import_growth',
    'HS 854143 组件进口环比 +35%',
    '近 180 天光伏组件进口量环比增长 35%，进口与清关能力已验证（事实，来源海关贸易数据）',
    0.8,
    0.85,
    'ACTIVE',
    '2026-07-03T01:00:00Z',
    '2026-08-04T00:00:00Z',
    'prv_customs_trade_data',
    '15 分钟前',
    false,
    { hs_code: '854143', direction: 'import', value_range: '2M-5M USD' },
  ),
  sig(
    2,
    'acc_01JZACCT000000000000000011',
    'TRADE',
    'building_materials_import_recurring',
    'HS 6809 石膏板进口连续 4 个季度',
    '连续 4 个季度稳定进口石膏制品（HS 6809），具备整柜清关经验（事实，来源海关贸易数据）',
    0.75,
    0.85,
    'ACTIVE',
    '2026-07-03T00:30:00Z',
    '2027-01-01T00:00:00Z',
    'prv_customs_trade_data',
    '40 分钟前',
    false,
    { hs_code: '6809', direction: 'import', counterparty: 'CN' },
  ),
  sig(
    3,
    'acc_01JZACCT000000000000000003',
    'HIRING',
    'solar_project_engineer',
    '连续 90 天招聘光伏项目工程师',
    '招聘门户持续发布 solar project engineer 岗位，推断项目管道扩张（推断，命中 ICP trigger_signals.HIRING）',
    0.6,
    0.8,
    'ACTIVE',
    '2026-07-02T09:00:00Z',
    '2026-09-30T00:00:00Z',
    'prv_hiring_signals',
    '1 小时前',
    false,
    { role_category: 'solar_project_engineer', openings_count: 3 },
  ),
  sig(
    4,
    'acc_01JZACCT000000000000000005',
    'EVENT',
    'solar_expo_exhibitor',
    '参展 2026 东南亚光伏展',
    '以参展商身份亮相并发布扩品类招商信息（事实，来源公开网页采集）',
    0.5,
    0.9,
    'ACTIVE',
    '2026-07-01T08:00:00Z',
    '2027-06-30T00:00:00Z',
    'prv_public_web_crawl',
    '2 小时前',
    true,
    { event_name: 'Solartech SEA 2026', event_date: '2026-07-15', booth: 'B12' },
  ),
  sig(
    5,
    'acc_01JZACCT000000000000000002',
    'CONTENT',
    'project_pipeline_announcement',
    '官网公示 120MW 工商业屋顶项目管道',
    '官网新闻页公示 2026 年 120MW 工商业屋顶项目管道（事实，来源公司官网）',
    0.65,
    0.8,
    'ACTIVE',
    '2026-07-01T06:00:00Z',
    '2026-10-01T00:00:00Z',
    'prv_public_web_crawl',
    '3 小时前',
    true,
    { topic: 'project_pipeline', channel: 'website' },
    'https://saigon-greenenergy.example.com/news/2026-pipeline',
  ),
  sig(
    6,
    'acc_01JZACCT000000000000000016',
    'WEBSITE',
    'product_category_expansion',
    '官网新增吊顶系统产品线页面',
    '网站变更监测发现新增 ceilings 产品目录，推断品类扩张意向（推断）',
    0.45,
    0.7,
    'ACTIVE',
    '2026-06-30T10:00:00Z',
    '2026-10-28T00:00:00Z',
    'prv_public_web_crawl',
    '5 小时前',
    true,
    { page: '/products/ceilings', change_type: 'category_added' },
  ),
  sig(
    7,
    'acc_01JZACCT000000000000000013',
    'FUNDING',
    'working_capital_facility',
    '获当地银行营运资金授信',
    '公开报道获得营运资金授信以扩大进口配额（事实，置信度中等，待二次核实）',
    0.55,
    0.6,
    'ACTIVE',
    '2026-06-29T12:00:00Z',
    '2026-12-29T00:00:00Z',
    'prv_public_web_crawl',
    '昨天',
    true,
    { round: 'credit_facility', amount_range: '1M-5M USD' },
  ),
  sig(
    8,
    'acc_01JZACCT000000000000000017',
    'RELATIONSHIP_CHANGE',
    'competitor_exclusive_agency_signed',
    '与竞品品牌签署区域独家代理',
    '负向信号：命中 ICP negative_signals，建议下调优先级并复核匹配度（推断）',
    0.7,
    0.75,
    'ACTIVE',
    '2026-06-28T08:00:00Z',
    '2027-06-28T00:00:00Z',
    'prv_public_web_crawl',
    '2 天前',
    true,
    { relationship_type: 'exclusive_agency', change: 'signed' },
  ),
  sig(
    9,
    'acc_01JZACCT000000000000000006',
    'TRADE',
    'pv_module_import_stalled',
    '组件进口记录已中断 14 个月',
    '最近一次进口记录在 14 个月前，信号过期自动降低 Intent（LED-014 验收）',
    0.3,
    0.85,
    'EXPIRED',
    '2025-04-20T00:00:00Z',
    '2026-04-20T00:00:00Z',
    'prv_customs_trade_data',
    '3 天前',
    true,
    { hs_code: '854143', direction: 'import' },
  ),
  sig(
    10,
    'acc_01JZACCT000000000000000014',
    'EVENT',
    'construction_expo_exhibitor',
    '参展 West Africa Building Expo 2026',
    '以参展商身份出现在展商名录（事实，来源公开网页采集）',
    0.5,
    0.8,
    'ACTIVE',
    '2026-06-27T09:00:00Z',
    '2027-06-27T00:00:00Z',
    'prv_public_web_crawl',
    '3 天前',
    true,
    { event_name: 'West Africa Building Expo 2026', event_date: '2026-09-10' },
  ),
];

/** 按账户聚合的信号（列表「信号」列使用） */
export const signalsByAccount = (accountId: string): SignalEvent[] =>
  mockSignalEvents.filter((s) => s.account_id === accountId);

// ---------------------------------------------------------------------------
// 数据质量摘要：从 fixtures 派生（字段级 FieldEvidence 口径，DAT-005）
// ---------------------------------------------------------------------------

export interface DataQualityReport {
  totalAccounts: number;
  emailVerified: number; // 联系人主邮箱 VALID
  emailUnverified: number; // UNVERIFIED / EXPIRED
  maskedFields: number; // allowed_to_display=false（界面遮罩）
  exportRestricted: number; // allowed_to_export=false
  outreachRestricted: number; // allowed_for_outreach=false
  avgQualityScore: number; // 账户 quality_score 均值（0-100）
  evidenceFresh: number; // 证据在有效期内
  evidenceTotal: number;
  lastUpdate: string;
}

const NOW_ISO = '2026-07-03T00:00:00Z';
const emailPoints = fxContacts.map((c) =>
  (c.contact_points ?? []).find((p: any) => p.type === 'EMAIL'),
);

export const mockDataQuality: DataQualityReport = {
  totalAccounts: fxAccounts.length,
  emailVerified: emailPoints.filter((p) => p?.verification_status === 'VALID').length,
  emailUnverified: emailPoints.filter((p) => p && p.verification_status !== 'VALID').length,
  maskedFields: fieldEvidences.filter((e) => e.allowed_to_display === false).length,
  exportRestricted: fieldEvidences.filter((e) => e.allowed_to_export !== true).length,
  outreachRestricted: fieldEvidences.filter((e) => e.allowed_for_outreach !== true).length,
  avgQualityScore: Math.round(
    (fxAccounts.reduce((sum, a) => sum + (a.quality_score ?? 0), 0) /
      Math.max(fxAccounts.length, 1)) *
      100,
  ),
  evidenceFresh: fieldEvidences.filter((e) => String(e.expires_at ?? '') > NOW_ISO).length,
  evidenceTotal: fieldEvidences.length,
  lastUpdate: toDay(
    fieldEvidences.reduce(
      (max, e) => (String(e.fetched_at) > max ? String(e.fetched_at) : max),
      '',
    ),
  ),
};

// ---------------------------------------------------------------------------
// AI 洞察（AI 只提出建议；动作以「提案 + 审批」表述，硬边界 1）
// ---------------------------------------------------------------------------

export interface ProspectAIInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'evidence' | 'risk';
  title: string;
  content: string;
  confidence: number; // 0-100
  relatedAccountId?: string;
  relatedTo?: string; // 账户名称（展示用）
  actionable: boolean;
  actionText?: string;
}

export const mockAIInsights: ProspectAIInsight[] = [
  {
    id: 'pai1',
    type: 'evidence',
    title: 'Mekong Solar 贸易信号强劲',
    content:
      '事实：近 180 天 HS 854143 组件进口量环比增长 35%（来源：海关贸易数据，2026-06-20 观测）。六维评分 Fit 88 / Intent 80，主联系人为采购总监且邮箱已验证（allowed_for_outreach=true）。推断：处于供应商评估窗口期。',
    confidence: 92,
    relatedAccountId: 'acc_01JZACCT000000000000000001',
    relatedTo: 'Mekong Solar Trading Co., Ltd.',
    actionable: true,
    actionText: '生成外联提案（需审批）',
  },
  {
    id: 'pai2',
    type: 'suggestion',
    title: 'Lagos BuildMart 建议推进为 SAO',
    content:
      'Lagos BuildMart 已达 CONVERTED（已转化）且综合优先级 88，决策人 Managing Director 直接在联。按三级结果链 Qualified Lead → SAO → Verified Outcome，建议销售确认接受，推进为 SAO（销售接受机会）。',
    confidence: 88,
    relatedAccountId: 'acc_01JZACCT000000000000000011',
    relatedTo: 'Lagos BuildMart Distribution Ltd.',
    actionable: true,
    actionText: '创建 SAO 确认任务',
  },
  {
    id: 'pai3',
    type: 'warning',
    title: 'Bangkok Solar Import 数据质量不足',
    content:
      '风险旗标 unverified_email：主邮箱未通过验证，Reachability 仅 45、Data Quality 52，暂不可进入批量发送（母本 4.5.5）。建议先执行数据补全与邮箱验证，再评估是否移出待确认队列。',
    confidence: 90,
    relatedAccountId: 'acc_01JZACCT000000000000000004',
    relatedTo: 'Bangkok Solar Import Co., Ltd.',
    actionable: true,
    actionText: '创建数据补全提案',
  },
  {
    id: 'pai4',
    type: 'risk',
    title: 'Hanoi PV Components 命中全局禁止联系',
    content:
      'suppression_applied=true：该线索命中全局 Suppression（禁止联系），已进入 DO_NOT_CONTACT 队列，不会进入任何发送队列，且任何模型不得覆盖（LED-007 验收）。与 PT Bali（业务拒绝：同业制造商，硬性排除）不同，禁止联系属合规硬约束。',
    confidence: 99,
    relatedAccountId: 'acc_01JZACCT000000000000000010',
    relatedTo: 'Hanoi PV Components Co., Ltd.',
    actionable: false,
  },
  {
    id: 'pai5',
    type: 'warning',
    title: 'Nile Delta 命中负向信号',
    content:
      '关系变化信号：与竞品品牌签署区域独家代理，命中 ICP negative_signals（competitor_exclusive_agency_signed）。推断短期合作空间受限，建议复核匹配度并下调优先级，暂缓外联。',
    confidence: 78,
    relatedAccountId: 'acc_01JZACCT000000000000000017',
    relatedTo: 'Nile Delta Building Trade LLC',
    actionable: true,
    actionText: '发起重评提案',
  },
  {
    id: 'pai6',
    type: 'evidence',
    title: 'Borneo Energy 信号过期自动降分',
    content:
      '事实：最近一次组件进口记录在 14 个月前，贸易信号已过期（status=EXPIRED），Intent 维度自动降至 40（LED-014：信号过期自动降低 Intent）。关键字段超 12 个月未刷新已进入刷新队列（母本 4.5.5）。',
    confidence: 85,
    relatedAccountId: 'acc_01JZACCT000000000000000006',
    relatedTo: 'Borneo Energy Distribution Sdn. Bhd.',
    actionable: true,
    actionText: '创建数据刷新提案',
  },
];
