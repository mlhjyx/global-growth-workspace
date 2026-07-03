// 治理组件共享类型（母本 6.13 一致性组件 / 硬边界 1）
// M0 为全模拟：类型形状对齐 packages/contracts 契约，数据来自 fixtures 或页面静态构造。

/** 证据条目 —— 对齐 common/field-evidence 与 knowledge/claim-evidence 的展示子集 */
export interface EvidenceItem {
  id: string;
  /** 证据针对的字段或说法，如 "employee_range"、"IEC 61215 认证" */
  subject: string;
  /** 来源：Provider 名 / 来源 URL / 文档名 */
  source: string;
  source_url?: string;
  fetched_at: string;
  expires_at?: string;
  confidence: number; // 0-1
  /** 数据权利（field-evidence 五权利的展示子集） */
  allowed_to_display?: boolean;
  allowed_to_export?: boolean;
  allowed_for_outreach?: boolean;
  /** 原文片段（知识证据） */
  quote?: string;
}

/** 成本徽章 —— 母本 ANA-005 五类成本口径 */
export type CostCategory = 'DATA' | 'MODEL' | 'MEDIA' | 'EMAIL' | 'EXPERT';

export interface CostInfo {
  /** 预估还是实际发生 */
  kind: 'ESTIMATED' | 'ACTUAL';
  amount: number;
  currency: string;
  category?: CostCategory;
  detail?: string; // 如 "Provider 查询 40 次 + 联系人解锁 12 条"
}

/** 策略徽章 —— 对齐 OPA 决策输出（母本 9.9/12.10） */
export type PolicyEffect =
  | 'ALLOW'
  | 'ALLOW_WITH_DISCLOSURE'
  | 'REQUIRE_APPROVAL'
  | 'MASK_FIELDS'
  | 'LIMIT_VOLUME'
  | 'REQUIRE_EXPERT'
  | 'DENY';

export interface PolicyInfo {
  effect: PolicyEffect;
  /** 机器可读原因码，如 LICENSE_RESTRICTED、SUPPRESSION_APPLIED */
  reason_codes?: string[];
  /** 人类可读说明 */
  reason?: string;
  policy_version?: string;
}

/** 受治理动作 —— 对齐 workspace/approval-rule 的 governed_actions */
export type GovernedAction =
  | 'CAMPAIGN_LAUNCH'
  | 'CONTENT_PUBLISH'
  | 'OUTBOUND_SEND'
  | 'DATA_EXPORT'
  | 'CROSS_BORDER_MODEL_CALL'
  | 'HIGH_RISK_REPLY'
  | 'DELETION'
  | 'SUPPRESSION_OVERRIDE'
  | 'BUDGET_INCREASE'
  | 'PROVIDER_UNLOCK'
  | 'EXPERT_SHARE';

export const GOVERNED_ACTION_LABELS: Record<GovernedAction, string> = {
  CAMPAIGN_LAUNCH: 'Campaign 启动',
  CONTENT_PUBLISH: '内容发布',
  OUTBOUND_SEND: '外联发送',
  DATA_EXPORT: '数据导出',
  CROSS_BORDER_MODEL_CALL: '跨境模型调用',
  HIGH_RISK_REPLY: '高风险回复',
  DELETION: '删除操作',
  SUPPRESSION_OVERRIDE: 'Suppression 覆盖',
  BUDGET_INCREASE: '预算上调',
  PROVIDER_UNLOCK: '高成本数据解锁',
  EXPERT_SHARE: '专家资料共享',
};

/** 审批提案 —— ActionProposal 的展示形状（母本硬边界 1：外部动作先提案后执行） */
export interface ApprovalProposal {
  id: string;
  action: GovernedAction;
  title: string;
  /** 提案者：人或 AI Task */
  proposed_by: string;
  proposed_at: string;
  risk_level: 'L1' | 'L2' | 'L3';
  /** 影响范围摘要，如 "42 位联系人 · 2 个渠道 · 预计 3 天" */
  scope_summary: string;
  /** 变更差异（审批人必须看到改了什么，母本 6.12.1） */
  diff?: { field: string; before: string; after: string }[];
  cost?: CostInfo;
  policy?: PolicyInfo;
  evidence?: EvidenceItem[];
  /** 授权有效期（批准后生成 ExecutionAuthorization） */
  expires_at?: string;
  status: 'PENDING' | 'APPROVED' | 'RETURNED' | 'SCOPE_LIMITED';
}

/** 页面状态 —— 母本 6.10 八态的原型子集 */
export type PageStateKind =
  | 'EMPTY'
  | 'LOADING'
  | 'ERROR'
  | 'PERMISSION'
  | 'PARTIAL_SUCCESS'
  | 'NEEDS_REVIEW'
  | 'NEEDS_ACTION'
  | 'BLOCKED';
