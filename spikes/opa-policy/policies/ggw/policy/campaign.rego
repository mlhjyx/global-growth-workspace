# SPK-OPA — OUTBOUND_SEND / CONTENT_PUBLISH：以 ExecutionAuthorization 为授权载体
# 契约: ggw://contracts/campaign/execution-authorization（packages/contracts，CAM-008 不可变授权）
#
# 语义（SPK-OPA 任务定义）:
#   - 无授权对象           → require_approval（默认审批集）
#   - 有效授权且范围内     → allow
#   - 有授权但任一违规     → deny + reason_codes（母本 11.15 ACTION_DENIED）
#
# fail-closed 细则：关键字段缺失 / 时间戳非法 / 执行计数缺失 一律计为违规，
# 防止 Rego undefined 语义导致比较规则不触发而 fail-open。

package ggw.policy.campaign

import rego.v1

auth := input.authorization

default decision := {"allow": false, "require_approval": false, "reason_codes": ["DEFAULT_DENY"]}

decision := {
	"allow": false,
	"require_approval": true,
	"reason_codes": ["AUTHORIZATION_REQUIRED", "NO_EXECUTION_AUTHORIZATION"],
} if {
	not input.authorization
}

decision := {"allow": true, "require_approval": false, "reason_codes": []} if {
	input.authorization
	count(violations) == 0
}

decision := {"allow": false, "require_approval": false, "reason_codes": sort(violations)} if {
	input.authorization
	count(violations) > 0
}

req_ns := time.parse_rfc3339_ns(input.action.requested_at)

# —— 必填字段（fail-closed：缺失即违规）——

violations contains "REQUESTED_AT_MISSING" if not input.action.requested_at

violations contains "REQUESTED_AT_INVALID" if {
	input.action.requested_at
	not time.parse_rfc3339_ns(input.action.requested_at)
}

violations contains "ACTION_WORKSPACE_ID_MISSING" if not input.action.workspace_id

violations contains "ACTION_CAMPAIGN_ID_MISSING" if not input.action.campaign_id

violations contains "TEMPLATE_REF_MISSING" if not input.action.template_ref

violations contains "CONTENT_HASH_MISSING" if not input.action.content_hash

violations contains "AUDIENCE_ID_MISSING" if not input.action.audience_id

# 注意（Spike 发现）：`not <builtin>(ref)` / `not x in y` 会被编译器把 ref 提升到否定之外，
# ref undefined 时整条规则静默不触发（fail-open）。因此范围比较规则必须配套显式存在性违规。
violations contains "ACTION_CHANNEL_MISSING" if not input.action.channel

violations contains "ACTION_TYPE_MISSING" if not input.action.action_type

# —— 授权绑定与生命周期 ——

violations contains "WORKSPACE_MISMATCH" if auth.workspace_id != input.action.workspace_id

violations contains "CAMPAIGN_MISMATCH" if auth.campaign_id != input.action.campaign_id

violations contains "AUTHORIZATION_ID_MISMATCH" if {
	input.action.authorization_id
	input.action.authorization_id != auth.id
}

# 执行服务只接受 status=ACTIVE 且在有效期内的授权（CAM-008 验收）
violations contains "AUTHORIZATION_STATUS_NOT_ACTIVE" if auth.status != "ACTIVE"

violations contains "AUTHORIZATION_NOT_YET_VALID" if req_ns < time.parse_rfc3339_ns(auth.valid_from)

violations contains "AUTHORIZATION_EXPIRED" if req_ns >= time.parse_rfc3339_ns(auth.valid_until)

# —— 固化范围 scope（CAM-008；超出范围 ACTION_DENIED，母本 11.15）——

violations contains "CHANNEL_NOT_AUTHORIZED" if not input.action.channel in auth.scope.channels

violations contains "ACTION_TYPE_NOT_AUTHORIZED" if not input.action.action_type in auth.scope.allowed_action_types

# max_total_actions 为契约可选字段：设置时才检查；计数器由确定性执行服务提供（PG 事实源），缺失=fail-closed
violations contains "MAX_TOTAL_ACTIONS_EXCEEDED" if {
	auth.scope.max_total_actions
	input.action.actions_executed_total >= auth.scope.max_total_actions
}

# helper rule 间接层：ref undefined 被限制在 helper 体内 → helper undefined → not helper = true（fail-closed）
violations contains "EXECUTED_COUNTER_MISSING" if {
	auth.scope.max_total_actions
	not executed_counter_is_number
}

executed_counter_is_number if is_number(input.action.actions_executed_total)

# —— 模板固化（CAM-008：内容指纹绑定，模板内容变更后授权失配、执行拒绝）——

violations contains "TEMPLATE_NOT_AUTHORIZED" if {
	input.action.template_ref
	not template_refs[input.action.template_ref]
}

violations contains "TEMPLATE_CONTENT_HASH_MISMATCH" if {
	some t in auth.templates
	t.template_ref == input.action.template_ref
	t.content_hash != input.action.content_hash
}

# —— 受众固化（CAM-003：运行批次可追溯到冻结名单版本）——

violations contains "AUDIENCE_NOT_AUTHORIZED" if {
	input.action.audience_id
	not audience_ids[input.action.audience_id]
}

template_refs contains t.template_ref if some t in auth.templates

audience_ids contains a.audience_id if some a in auth.scope.audience_refs
