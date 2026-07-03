// M0 原型统一数据源：packages/contracts/fixtures（契约强校验样例，PDR-001 光伏/建材 × 东南亚/非洲）。
// 规则（Demo Gap Analysis 结论 3）：页面 mock 一律从本模块取数或派生，禁止再造与契约冲突的假数据。
// fixtures 为按 $schema_ref 混装的实体数组，此处按类型分组导出。
import workspaceRaw from '../../../../packages/contracts/fixtures/workspace.json';
import companiesRaw from '../../../../packages/contracts/fixtures/companies.json';
import icpsRaw from '../../../../packages/contracts/fixtures/icps.json';
import leadsRaw from '../../../../packages/contracts/fixtures/leads.json';
import campaignRaw from '../../../../packages/contracts/fixtures/campaign.json';
import opportunitiesRaw from '../../../../packages/contracts/fixtures/opportunities.json';

type Entity = { $schema_ref: string; id: string } & Record<string, any>;

const byRef = (raw: unknown, suffix: string): Entity[] =>
  (raw as Entity[]).filter((e) => e.$schema_ref?.endsWith(suffix));

// ---- workspace 域 ----
export const organization = byRef(workspaceRaw, '/organization')[0];
export const workspace = byRef(workspaceRaw, '/workspace')[0];
export const memberships = byRef(workspaceRaw, '/membership');

// ---- knowledge 域 ----
export const knowledgeSources = byRef(companiesRaw, '/knowledge-source');
export const companyProfiles = byRef(companiesRaw, '/company-profile');
export const offerings = byRef(companiesRaw, '/offering');
export const claims = byRef(companiesRaw, '/claim');
export const claimEvidences = byRef(companiesRaw, '/claim-evidence');

// ---- lead 域 ----
export const icpDefinitions = byRef(icpsRaw, '/icp-definition');
export const buyingCommitteeRoles = byRef(icpsRaw, '/buying-committee-role');
export const accounts = byRef(leadsRaw, '/account');
export const contacts = byRef(leadsRaw, '/contact');
export const leads = byRef(leadsRaw, '/lead');
export const leadScores = byRef(leadsRaw, '/lead-score');
export const fieldEvidences = byRef(leadsRaw, '/field-evidence');

// ---- campaign 域 ----
export const campaigns = byRef(campaignRaw, '/campaign');
export const audiences = byRef(campaignRaw, '/audience');
export const outreachSequences = byRef(campaignRaw, '/outreach-sequence');
export const executionAuthorizations = byRef(campaignRaw, '/execution-authorization');
export const stopConditions = byRef(campaignRaw, '/stop-condition');

// ---- opportunity 域（三级结果链）----
export const opportunities = byRef(opportunitiesRaw, '/opportunity');
export const commercialOutcomes = byRef(opportunitiesRaw, '/commercial-outcome');
export const touchpoints = byRef(opportunitiesRaw, '/touchpoint');

// ---- 关联辅助 ----
export const accountById = new Map(accounts.map((a) => [a.id, a]));
export const contactById = new Map(contacts.map((c) => [c.id, c]));
export const contactsByAccount = (accountId: string) =>
  contacts.filter((c) => c.account_id === accountId);
export const leadByAccountId = new Map(leads.map((l) => [l.account_id, l]));
export const scoreById = new Map(leadScores.map((s) => [s.id, s]));
export const scoreByLeadId = new Map(leadScores.map((s) => [s.lead_id, s]));
export const evidencesByEntity = (entityId: string) =>
  fieldEvidences.filter((e) => e.entity_id === entityId);

// ---- 展示词典：契约枚举 → 中文标签（唯一允许的翻译点，禁止在页面里自造词）----
export const LEAD_STATE_LABELS: Record<string, string> = {
  DISCOVERED: '已发现',
  ENRICHING: '补全中',
  REVIEW: '待确认',
  QUALIFIED: '合格',
  REJECTED: '已拒绝',
  SUPPRESSED: '禁止联系',
  CONTACTED: '已触达',
  CONVERTED: '已转化',
};

export const CAMPAIGN_STATE_LABELS: Record<string, string> = {
  DRAFT: '草稿',
  RESEARCHING: '研究中',
  READY_FOR_REVIEW: '待评审',
  APPROVED: '已批准',
  SCHEDULED: '已排期',
  RUNNING: '运行中',
  PAUSED: '已暂停',
  BLOCKED: '已阻断',
  COMPLETED: '已完成',
  LEARNED: '已复盘',
  ARCHIVED: '已归档',
};

export const OPPORTUNITY_STAGE_LABELS: Record<string, string> = {
  NEW: '新建',
  QUALIFIED: '已确认',
  MEETING: '会议',
  SAMPLE_DEMO: '样品/演示',
  PROPOSAL: '报价',
  WON: '赢单',
  LOST: '输单',
  WITHDRAWN: '已撤回',
  DOWNGRADED: '已降级',
};

// 三级结果链（北极星口径，ENG-016/ANA-013）
export const QUALIFICATION_LABELS: Record<string, string> = {
  QUALIFIED_LEAD: 'Qualified Lead（合格线索）',
  SALES_ACCEPTED: 'SAO（销售接受机会）',
  VERIFIED: 'Verified Outcome（已验证结果）',
};

export const SCORE_DIMENSION_LABELS: Record<string, string> = {
  fit: '匹配度 Fit',
  role: '角色 Role',
  intent: '意向 Intent',
  data_quality: '数据质量',
  reachability: '可触达性',
  engagement: '互动度',
};
