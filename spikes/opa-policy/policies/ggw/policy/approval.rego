# SPK-OPA — DATA_EXPORT / DELETE / SUPPRESSION_CHANGE：以 Approval Token 为授权载体
# 依据: packages/contracts/json-schema/workspace/approval-rule.schema.json（WSP-006：
#   高风险动作无有效 Approval Token 时执行失败 AUTHORIZATION_REQUIRED；
#   token 有效期由 approval_token_ttl_minutes 决定，过期需重新审批）。
#
# 注意（契约缺口，见 REPORT.md）：Approval Token 实体本身尚无契约 schema；
# 本包按 spike 提案形状消费：
#   input.approval: {id, workspace_id, approval_rule_id, status, governed_actions[],
#                    resource_ids[], granted_by, granted_at, expires_at}

package ggw.policy.approval

import rego.v1

appr := input.approval

default decision := {"allow": false, "require_approval": false, "reason_codes": ["DEFAULT_DENY"]}

decision := {
	"allow": false,
	"require_approval": true,
	"reason_codes": ["AUTHORIZATION_REQUIRED", "NO_APPROVAL_TOKEN"],
} if {
	not input.approval
}

decision := {"allow": true, "require_approval": false, "reason_codes": []} if {
	input.approval
	count(violations) == 0
}

decision := {"allow": false, "require_approval": false, "reason_codes": sort(violations)} if {
	input.approval
	count(violations) > 0
}

req_ns := time.parse_rfc3339_ns(input.action.requested_at)

# —— 必填字段（fail-closed）——

violations contains "REQUESTED_AT_MISSING" if not input.action.requested_at

violations contains "REQUESTED_AT_INVALID" if {
	input.action.requested_at
	not time.parse_rfc3339_ns(input.action.requested_at)
}

violations contains "ACTION_WORKSPACE_ID_MISSING" if not input.action.workspace_id

violations contains "RESOURCE_ID_MISSING" if not input.action.resource_id

# —— 审批令牌校验（WSP-006）——
# fail-closed 硬口径（Codex 3521756903/3521756920）：令牌字段缺失/畸形时，比较表达式在
# Rego 中是 undefined，规则体不触发即不产生 violation——等于无限期、无范围放行。
# 因此每个安全攸关字段先做显式缺失/畸形检查，比较规则一律以字段存在为前置守卫。

violations contains "APPROVAL_WORKSPACE_ID_MISSING" if not appr.workspace_id

violations contains "WORKSPACE_MISMATCH" if {
	appr.workspace_id
	appr.workspace_id != input.action.workspace_id
}

violations contains "APPROVAL_STATUS_MISSING" if not appr.status

violations contains "APPROVAL_STATUS_NOT_GRANTED" if {
	appr.status
	appr.status != "GRANTED"
}

# 缺失或不可解析的 expires_at = 永久有效令牌，显式拒绝
violations contains "APPROVAL_EXPIRES_AT_MISSING" if not appr.expires_at

violations contains "APPROVAL_EXPIRES_AT_INVALID" if {
	appr.expires_at
	not time.parse_rfc3339_ns(appr.expires_at)
}

violations contains "APPROVAL_TOKEN_EXPIRED" if {
	appr.expires_at
	req_ns >= time.parse_rfc3339_ns(appr.expires_at)
}

# 缺失动作范围 = 任意高风险动作可用同一令牌，显式拒绝
violations contains "APPROVAL_SCOPE_MISSING" if not appr.governed_actions

violations contains "APPROVAL_SCOPE_INVALID" if {
	appr.governed_actions
	not is_array(appr.governed_actions)
}

violations contains "ACTION_NOT_COVERED_BY_APPROVAL" if {
	is_array(appr.governed_actions)
	not input.action.type in appr.governed_actions
}

# 资源级绑定：审批与被操作资源一一对应，防止 token 复用到其他导出/删除对象
violations contains "APPROVAL_RESOURCE_IDS_MISSING" if not appr.resource_ids

violations contains "RESOURCE_NOT_COVERED_BY_APPROVAL" if {
	input.action.resource_id
	is_array(appr.resource_ids)
	not input.action.resource_id in appr.resource_ids
}
