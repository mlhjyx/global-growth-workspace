# SPK-OPA — CROSS_BORDER_MODEL_CALL：Workspace 级授权语义（M1 计划 §5-C 拍板）
#   Workspace 管理员签发边界授权（Provider/Region/Data Class/Task/预算边界），
#   每次调用做确定性 Policy Check + 全量记录；仅授权边界变化时重新人工审批
#   —— 不得每次调用弹人工确认。
#
# 注意（契约缺口，见 REPORT.md）：Workspace 级模型授权对象尚无契约 schema；spike 提案形状：
#   input.workspace_model_authorization:
#     {id, workspace_id, status, granted_by, boundaries: {providers[], regions[],
#      data_classes[](primitives.privacy_classification), tasks[]},
#      budget_cap: primitives.money, valid_from, valid_until}
#   input.action.model: {provider, region, data_class, task, consumed_amount}
#
# 预算说明：consumed_amount 为确定性 BudgetGuard（WSP-005，PG 事实源）提供的已消耗额；
# 币种归一由 BudgetGuard 负责，OPA 只做同币种边界比较。

package ggw.policy.model

import rego.v1

grant := input.workspace_model_authorization

default decision := {"allow": false, "require_approval": false, "reason_codes": ["DEFAULT_DENY"]}

decision := {
	"allow": false,
	"require_approval": true,
	"reason_codes": ["AUTHORIZATION_REQUIRED", "NO_WORKSPACE_MODEL_AUTHORIZATION"],
} if {
	not input.workspace_model_authorization
}

decision := {"allow": true, "require_approval": false, "reason_codes": []} if {
	input.workspace_model_authorization
	count(violations) == 0
}

decision := {"allow": false, "require_approval": false, "reason_codes": sort(violations)} if {
	input.workspace_model_authorization
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

# —— 授权绑定与生命周期 ——

violations contains "WORKSPACE_MISMATCH" if grant.workspace_id != input.action.workspace_id

violations contains "GRANT_STATUS_NOT_ACTIVE" if grant.status != "ACTIVE"

violations contains "GRANT_NOT_YET_VALID" if req_ns < time.parse_rfc3339_ns(grant.valid_from)

violations contains "GRANT_EXPIRED" if req_ns >= time.parse_rfc3339_ns(grant.valid_until)

# —— 边界检查（provider/region/data_class/task）——
# 注意（Spike 发现）：`not x in y` 的 ref 会被提升到否定之外，字段缺失时比较规则静默不触发（fail-open），
# 必须用显式完整性违规（helper rule 间接层）兜底。

violations contains "MODEL_ATTRIBUTES_INCOMPLETE" if not model_attributes_complete

model_attributes_complete if {
	input.action.model.provider
	input.action.model.region
	input.action.model.data_class
	input.action.model.task
}

violations contains "MODEL_PROVIDER_NOT_AUTHORIZED" if not input.action.model.provider in grant.boundaries.providers

violations contains "MODEL_REGION_NOT_AUTHORIZED" if not input.action.model.region in grant.boundaries.regions

violations contains "DATA_CLASS_NOT_AUTHORIZED" if not input.action.model.data_class in grant.boundaries.data_classes

violations contains "MODEL_TASK_NOT_AUTHORIZED" if not input.action.model.task in grant.boundaries.tasks

# —— 预算边界（§5-C：预算属授权边界之一）——
# 预算是授权的必备边界：缺 budget_cap 的授权 = 无预算上限的跨境调用，显式拒绝
# （Codex 3521756906；schema 侧 budget_cap 已同步入 required）

violations contains "BUDGET_CAP_MISSING" if not grant.budget_cap

violations contains "CROSS_BORDER_BUDGET_EXCEEDED" if {
	grant.budget_cap
	input.action.model.consumed_amount >= grant.budget_cap.amount
}

violations contains "BUDGET_COUNTER_MISSING" if {
	grant.budget_cap
	not budget_counter_is_number
}

budget_counter_is_number if is_number(input.action.model.consumed_amount)
