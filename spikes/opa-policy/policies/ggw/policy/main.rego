# SPK-OPA Spike — PolicyDecision 决策入口（M1 计划 SPK-OPA 行；CLAUDE.md 硬边界 #1：AI 不拥有业务状态，
# 状态与授权记录由 PG 提供，OPA 只做确定性判定）。
#
# 决策对象（唯一输出契约）: {"allow": bool, "require_approval": bool, "reason_codes": [string]}
#   allow=true                           → 放行（有有效授权且范围内）
#   allow=false + require_approval=true  → 生成审批任务（API 错误码 AUTHORIZATION_REQUIRED，母本 11.15）
#   allow=false + require_approval=false → 拒绝（API 错误码 ACTION_DENIED；reason_codes 进 policy_reason_codes）
#
# fail-closed 三层：
#   1) 本文件 default decision = deny（引擎内部：未匹配任何规则 → 拒）
#   2) 动作类型不在治理清单 → 显式 deny（内部读写应由 RBAC/BE-04 承接，不应到达 OPA）
#   3) 引擎不可达 = 拒（应用侧约定，OPA 无法自证，见 REPORT.md「PEP 约定」：
#      PDP 连接错误/超时/非 200/响应缺 result/决策形状非法 → 一律按 deny 处理，
#      清单动作全部拒绝 + readiness 亮红 + 结构化告警；禁止降级为 allow 或跳过检查）

package ggw.policy

import rego.v1

import data.ggw.policy.approval
import data.ggw.policy.campaign
import data.ggw.policy.model

# 默认审批集 = 经 PolicyDecision 的动作清单（SPK-OPA DoD；OD-8 默认集 + M1 计划 §5-C 拍板）
governed_actions := {
	"OUTBOUND_SEND",
	"CONTENT_PUBLISH",
	"DATA_EXPORT",
	"DELETE",
	"SUPPRESSION_CHANGE",
	"CROSS_BORDER_MODEL_CALL",
}

default decision := {
	"allow": false,
	"require_approval": false,
	"reason_codes": ["DEFAULT_DENY"],
}

# 按动作类型分派到子 package（每个子 package 输出同形决策对象）
decision := campaign.decision if input.action.type in {"OUTBOUND_SEND", "CONTENT_PUBLISH"}

decision := approval.decision if input.action.type in {"DATA_EXPORT", "DELETE", "SUPPRESSION_CHANGE"}

decision := model.decision if input.action.type == "CROSS_BORDER_MODEL_CALL"

# 动作类型可读但不在治理清单 → 显式拒绝（防误接入；内部读写走 RBAC）
decision := {
	"allow": false,
	"require_approval": false,
	"reason_codes": ["ACTION_TYPE_NOT_GOVERNED"],
} if {
	is_string(input.action.type)
	not input.action.type in governed_actions
}
