# SPK-OPA — 决策测试（opa test policies fixtures/data.json）
# 全部用例经统一入口 data.ggw.policy.decision，契约 fixtures 由 scripts/build-inputs.mjs
# 从 packages/contracts/fixtures/{campaign,workspace}.json 生成为 data 文档挂载。
#
# 「引擎不可达 = 拒」无法在 Rego 内部测试（引擎死了就没有决策）：这是 PEP（应用侧）约定，
# 见 REPORT.md「PEP fail-closed 约定」——BE-06 必须以集成测试覆盖（关掉 OPA 容器 → 清单动作全拒 +
# readiness 亮红 + 告警）。本文件覆盖引擎内部 fail-closed（default deny / 字段缺失 / 非法输入）。

package ggw.policy_test

import rego.v1

auth_fixture := data.fixtures.execution_authorization

grant_fixture := data.fixtures.workspace_model_authorization

approval_fixture := data.fixtures.approval_token

# —— 基准动作（与 auth_01JZAVTH…0001 固化范围完全一致）——

outbound_ok := {
	"type": "OUTBOUND_SEND",
	"workspace_id": "ws_01JZW0RK000000000000000001",
	"campaign_id": "cam_01JZCAMP000000000000000001",
	"authorization_id": "auth_01JZAVTH000000000000000001",
	"channel": "EMAIL",
	"action_type": "OUTBOUND_EMAIL",
	"template_ref": "cnt_dealer_intro_en_v2",
	"content_hash": "sha256:tpl1a3c5e7092b4d6f8a0c2e4d6f8a0b2",
	"audience_id": "aud_01JZAVDN000000000000000001",
	"actions_executed_total": 120,
	"requested_at": "2026-07-01T08:00:00Z",
}

export_ok := {
	"type": "DATA_EXPORT",
	"workspace_id": "ws_01JZW0RK000000000000000001",
	"resource_id": "exp_job_20260701_001",
	"requested_at": "2026-07-01T08:00:00Z",
}

model_call_ok := {
	"type": "CROSS_BORDER_MODEL_CALL",
	"workspace_id": "ws_01JZW0RK000000000000000001",
	"requested_at": "2026-07-01T08:00:00Z",
	"model": {
		"provider": "anthropic",
		"region": "ap-southeast-1",
		"data_class": "INTERNAL",
		"task": "company_understanding",
		"consumed_amount": 120.5,
	},
}

allow_decision := {"allow": true, "require_approval": false, "reason_codes": []}

# ============================== 入口 fail-closed ==============================

test_empty_input_default_deny if {
	d := data.ggw.policy.decision with input as {}
	d == {"allow": false, "require_approval": false, "reason_codes": ["DEFAULT_DENY"]}
}

test_ungoverned_action_type_denied if {
	d := data.ggw.policy.decision with input as {"action": {
		"type": "INTERNAL_READ",
		"workspace_id": "ws_01JZW0RK000000000000000001",
		"requested_at": "2026-07-01T08:00:00Z",
	}}
	d == {"allow": false, "require_approval": false, "reason_codes": ["ACTION_TYPE_NOT_GOVERNED"]}
}

# ============================== OUTBOUND_SEND / CONTENT_PUBLISH ==============================

test_outbound_in_scope_allow if {
	d := data.ggw.policy.decision with input as {"action": outbound_ok, "authorization": auth_fixture}
	d == allow_decision
}

test_outbound_without_authorization_requires_approval if {
	d := data.ggw.policy.decision with input as {"action": outbound_ok}
	d == {
		"allow": false,
		"require_approval": true,
		"reason_codes": ["AUTHORIZATION_REQUIRED", "NO_EXECUTION_AUTHORIZATION"],
	}
}

test_publish_action_type_not_in_scope_denied if {
	act := object.union(outbound_ok, {"type": "CONTENT_PUBLISH", "action_type": "PUBLISH"})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["ACTION_TYPE_NOT_AUTHORIZED"]}
}

test_outbound_channel_not_authorized_denied if {
	act := object.union(outbound_ok, {"channel": "X"})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["CHANNEL_NOT_AUTHORIZED"]}
}

test_outbound_expired_authorization_denied if {
	act := object.union(outbound_ok, {"requested_at": "2026-09-21T00:00:00Z"})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["AUTHORIZATION_EXPIRED"]}
}

test_outbound_not_yet_valid_denied if {
	act := object.union(outbound_ok, {"requested_at": "2026-06-22T23:59:00Z"})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["AUTHORIZATION_NOT_YET_VALID"]}
}

test_outbound_max_total_actions_reached_denied if {
	act := object.union(outbound_ok, {"actions_executed_total": 900})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["MAX_TOTAL_ACTIONS_EXCEEDED"]}
}

test_outbound_just_below_max_total_allows if {
	act := object.union(outbound_ok, {"actions_executed_total": 899})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == allow_decision
}

test_outbound_executed_counter_missing_denied if {
	act := object.remove(outbound_ok, ["actions_executed_total"])
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["EXECUTED_COUNTER_MISSING"]}
}

test_outbound_revoked_authorization_denied if {
	auth := object.union(auth_fixture, {"status": "REVOKED"})
	d := data.ggw.policy.decision with input as {"action": outbound_ok, "authorization": auth}
	d == {"allow": false, "require_approval": false, "reason_codes": ["AUTHORIZATION_STATUS_NOT_ACTIVE"]}
}

test_outbound_template_not_authorized_denied if {
	act := object.union(outbound_ok, {"template_ref": "cnt_rogue_template_v9"})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["TEMPLATE_NOT_AUTHORIZED"]}
}

test_outbound_template_hash_mismatch_denied if {
	act := object.union(outbound_ok, {"content_hash": "sha256:tampered000000000000000000000000"})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["TEMPLATE_CONTENT_HASH_MISMATCH"]}
}

test_outbound_audience_not_authorized_denied if {
	act := object.union(outbound_ok, {"audience_id": "aud_01JZAVDN000000000000000999"})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["AUDIENCE_NOT_AUTHORIZED"]}
}

test_outbound_cross_workspace_authorization_denied if {
	act := object.union(outbound_ok, {"workspace_id": "ws_01JZW0RK000000000000000002"})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["WORKSPACE_MISMATCH"]}
}

test_outbound_campaign_mismatch_denied if {
	act := object.union(outbound_ok, {"campaign_id": "cam_01JZCAMP000000000000000002"})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["CAMPAIGN_MISMATCH"]}
}

test_outbound_authorization_id_mismatch_denied if {
	act := object.union(outbound_ok, {"authorization_id": "auth_01JZAVTH000000000000000002"})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["AUTHORIZATION_ID_MISMATCH"]}
}

test_outbound_requested_at_malformed_denied if {
	act := object.union(outbound_ok, {"requested_at": "not-a-timestamp"})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["REQUESTED_AT_INVALID"]}
}

test_outbound_requested_at_missing_denied if {
	act := object.remove(outbound_ok, ["requested_at"])
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["REQUESTED_AT_MISSING"]}
}

# 负向：字段缺失不得因 Rego 否定表达式的 term-hoisting 而放行（Spike 发现的 fail-open 陷阱）
test_outbound_channel_missing_denied if {
	act := object.remove(outbound_ok, ["channel"])
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["ACTION_CHANNEL_MISSING"]}
}

test_outbound_action_type_missing_denied if {
	act := object.remove(outbound_ok, ["action_type"])
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["ACTION_TYPE_MISSING"]}
}

test_outbound_multiple_violations_accumulate if {
	act := object.union(outbound_ok, {
		"channel": "X",
		"actions_executed_total": 900,
		"requested_at": "2026-09-25T08:00:00Z",
	})
	d := data.ggw.policy.decision with input as {"action": act, "authorization": auth_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": [
		"AUTHORIZATION_EXPIRED",
		"CHANNEL_NOT_AUTHORIZED",
		"MAX_TOTAL_ACTIONS_EXCEEDED",
	]}
}

# ============================== DATA_EXPORT / DELETE / SUPPRESSION_CHANGE ==============================

test_export_without_token_requires_approval if {
	d := data.ggw.policy.decision with input as {"action": export_ok}
	d == {"allow": false, "require_approval": true, "reason_codes": ["AUTHORIZATION_REQUIRED", "NO_APPROVAL_TOKEN"]}
}

test_export_with_valid_token_allows if {
	d := data.ggw.policy.decision with input as {"action": export_ok, "approval": approval_fixture}
	d == allow_decision
}

test_export_token_expired_denied if {
	act := object.union(export_ok, {"requested_at": "2026-07-01T10:00:00Z"})
	d := data.ggw.policy.decision with input as {"action": act, "approval": approval_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["APPROVAL_TOKEN_EXPIRED"]}
}

test_delete_not_covered_by_token_denied if {
	act := object.union(export_ok, {"type": "DELETE"})
	d := data.ggw.policy.decision with input as {"action": act, "approval": approval_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["ACTION_NOT_COVERED_BY_APPROVAL"]}
}

test_export_resource_not_covered_denied if {
	act := object.union(export_ok, {"resource_id": "exp_job_other_target"})
	d := data.ggw.policy.decision with input as {"action": act, "approval": approval_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["RESOURCE_NOT_COVERED_BY_APPROVAL"]}
}

test_suppression_change_without_token_requires_approval if {
	act := {
		"type": "SUPPRESSION_CHANGE",
		"workspace_id": "ws_01JZW0RK000000000000000001",
		"resource_id": "led_01JZ1EAD000000000000000011",
		"requested_at": "2026-07-01T08:00:00Z",
	}
	d := data.ggw.policy.decision with input as {"action": act}
	d == {"allow": false, "require_approval": true, "reason_codes": ["AUTHORIZATION_REQUIRED", "NO_APPROVAL_TOKEN"]}
}

test_delete_without_token_requires_approval if {
	act := object.union(export_ok, {"type": "DELETE"})
	d := data.ggw.policy.decision with input as {"action": act}
	d == {"allow": false, "require_approval": true, "reason_codes": ["AUTHORIZATION_REQUIRED", "NO_APPROVAL_TOKEN"]}
}

test_export_cross_workspace_token_denied if {
	act := object.union(export_ok, {"workspace_id": "ws_01JZW0RK000000000000000002"})
	d := data.ggw.policy.decision with input as {"action": act, "approval": approval_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["WORKSPACE_MISMATCH"]}
}

test_export_revoked_token_denied if {
	appr := object.union(approval_fixture, {"status": "REVOKED"})
	d := data.ggw.policy.decision with input as {"action": export_ok, "approval": appr}
	d == {"allow": false, "require_approval": false, "reason_codes": ["APPROVAL_STATUS_NOT_GRANTED"]}
}

# 负向：令牌安全攸关字段缺失/畸形必须显式拒绝，不得因比较表达式 undefined 而放行
# （Codex 3521756903/3521756920 fail-open 修复的回归防线）

test_export_token_without_expires_at_denied if {
	appr := object.remove(approval_fixture, ["expires_at"])
	d := data.ggw.policy.decision with input as {"action": export_ok, "approval": appr}
	d == {"allow": false, "require_approval": false, "reason_codes": ["APPROVAL_EXPIRES_AT_MISSING"]}
}

test_export_token_malformed_expires_at_denied if {
	appr := object.union(approval_fixture, {"expires_at": "not-a-timestamp"})
	d := data.ggw.policy.decision with input as {"action": export_ok, "approval": appr}
	d == {"allow": false, "require_approval": false, "reason_codes": ["APPROVAL_EXPIRES_AT_INVALID"]}
}

test_export_token_without_governed_actions_denied if {
	appr := object.remove(approval_fixture, ["governed_actions"])
	d := data.ggw.policy.decision with input as {"action": export_ok, "approval": appr}
	d == {"allow": false, "require_approval": false, "reason_codes": ["APPROVAL_SCOPE_MISSING"]}
}

test_export_token_without_status_denied if {
	appr := object.remove(approval_fixture, ["status"])
	d := data.ggw.policy.decision with input as {"action": export_ok, "approval": appr}
	d == {"allow": false, "require_approval": false, "reason_codes": ["APPROVAL_STATUS_MISSING"]}
}

test_export_token_without_workspace_id_denied if {
	appr := object.remove(approval_fixture, ["workspace_id"])
	d := data.ggw.policy.decision with input as {"action": export_ok, "approval": appr}
	d == {"allow": false, "require_approval": false, "reason_codes": ["APPROVAL_WORKSPACE_ID_MISSING"]}
}

test_export_token_without_resource_ids_denied if {
	appr := object.remove(approval_fixture, ["resource_ids"])
	d := data.ggw.policy.decision with input as {"action": export_ok, "approval": appr}
	d == {"allow": false, "require_approval": false, "reason_codes": ["APPROVAL_RESOURCE_IDS_MISSING"]}
}

test_export_token_malformed_resource_ids_denied if {
	appr := object.union(approval_fixture, {"resource_ids": "not-an-array"})
	d := data.ggw.policy.decision with input as {"action": export_ok, "approval": appr}
	d == {"allow": false, "require_approval": false, "reason_codes": ["APPROVAL_RESOURCE_IDS_INVALID"]}
}

# ============================== CROSS_BORDER_MODEL_CALL ==============================

test_crossborder_without_grant_requires_approval if {
	d := data.ggw.policy.decision with input as {"action": model_call_ok}
	d == {
		"allow": false,
		"require_approval": true,
		"reason_codes": ["AUTHORIZATION_REQUIRED", "NO_WORKSPACE_MODEL_AUTHORIZATION"],
	}
}

test_crossborder_within_boundaries_allows if {
	d := data.ggw.policy.decision with input as {
		"action": model_call_ok,
		"workspace_model_authorization": grant_fixture,
	}
	d == allow_decision
}

test_crossborder_provider_not_authorized_denied if {
	act := object.union(model_call_ok, {"model": object.union(model_call_ok.model, {"provider": "unknown_vendor"})})
	d := data.ggw.policy.decision with input as {"action": act, "workspace_model_authorization": grant_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["MODEL_PROVIDER_NOT_AUTHORIZED"]}
}

test_crossborder_confidential_data_class_denied if {
	act := object.union(model_call_ok, {"model": object.union(model_call_ok.model, {"data_class": "CONFIDENTIAL"})})
	d := data.ggw.policy.decision with input as {"action": act, "workspace_model_authorization": grant_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["DATA_CLASS_NOT_AUTHORIZED"]}
}

test_crossborder_region_and_task_out_of_boundary_denied if {
	act := object.union(model_call_ok, {"model": object.union(model_call_ok.model, {
		"region": "eu-west-1",
		"task": "free_chat",
	})})
	d := data.ggw.policy.decision with input as {"action": act, "workspace_model_authorization": grant_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": [
		"MODEL_REGION_NOT_AUTHORIZED",
		"MODEL_TASK_NOT_AUTHORIZED",
	]}
}

test_crossborder_grant_expired_denied if {
	act := object.union(model_call_ok, {"requested_at": "2027-01-01T00:00:00Z"})
	d := data.ggw.policy.decision with input as {"action": act, "workspace_model_authorization": grant_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["GRANT_EXPIRED"]}
}

test_crossborder_budget_exceeded_denied if {
	act := object.union(model_call_ok, {"model": object.union(model_call_ok.model, {"consumed_amount": 500})})
	d := data.ggw.policy.decision with input as {"action": act, "workspace_model_authorization": grant_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["CROSS_BORDER_BUDGET_EXCEEDED"]}
}

test_crossborder_budget_counter_missing_denied if {
	# 注意：object.union 对两侧同为对象的键做递归合并，直接 union 会把被移除的键合并回来；
	# 必须先移除整个 model 再放入删减后的副本。
	act := object.union(object.remove(model_call_ok, ["model"]), {"model": object.remove(model_call_ok.model, ["consumed_amount"])})
	d := data.ggw.policy.decision with input as {"action": act, "workspace_model_authorization": grant_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": ["BUDGET_COUNTER_MISSING"]}
}

# 负向：授权缺 budget_cap = 无预算上限的跨境调用，显式拒绝（Codex 3521756906）
test_crossborder_grant_without_budget_cap_denied if {
	grant := object.remove(grant_fixture, ["budget_cap"])
	d := data.ggw.policy.decision with input as {"action": model_call_ok, "workspace_model_authorization": grant}
	d == {"allow": false, "require_approval": false, "reason_codes": ["BUDGET_CAP_MISSING"]}
}

# 负向：budget_cap 形状不可用同样显式拒绝——amount 缺失与 amount 非数值两个变体
# （Codex 3522746091；缺失变体曾复现 term-hoisting 陷阱，见 model.rego 注释）
test_crossborder_grant_budget_cap_without_amount_denied if {
	grant := object.union(object.remove(grant_fixture, ["budget_cap"]), {"budget_cap": {"currency": "USD"}})
	d := data.ggw.policy.decision with input as {"action": model_call_ok, "workspace_model_authorization": grant}
	d == {"allow": false, "require_approval": false, "reason_codes": ["BUDGET_CAP_INVALID"]}
}

test_crossborder_grant_non_numeric_budget_cap_denied if {
	grant := object.union(object.remove(grant_fixture, ["budget_cap"]), {"budget_cap": {"amount": "500", "currency": "USD"}})
	d := data.ggw.policy.decision with input as {"action": model_call_ok, "workspace_model_authorization": grant}
	d == {"allow": false, "require_approval": false, "reason_codes": ["BUDGET_CAP_INVALID"]}
}

# 负向：model 属性整体缺失 → 完整性违规 + 预算计数缺失（不得静默放行）
test_crossborder_model_attributes_missing_denied if {
	act := object.remove(model_call_ok, ["model"])
	d := data.ggw.policy.decision with input as {"action": act, "workspace_model_authorization": grant_fixture}
	d == {"allow": false, "require_approval": false, "reason_codes": [
		"BUDGET_COUNTER_MISSING",
		"MODEL_ATTRIBUTES_INCOMPLETE",
	]}
}

test_crossborder_revoked_grant_denied if {
	grant := object.union(grant_fixture, {"status": "REVOKED"})
	d := data.ggw.policy.decision with input as {"action": model_call_ok, "workspace_model_authorization": grant}
	d == {"allow": false, "require_approval": false, "reason_codes": ["GRANT_STATUS_NOT_ACTIVE"]}
}
