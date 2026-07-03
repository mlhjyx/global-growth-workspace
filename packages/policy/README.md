# @ggw/policy

OPA（rego）确定性策略。处理角色/资源权限、数据用途、模型区域、导出、外联、发布、专家访问、预算和审批要求（母本 8.12）。

## 原则

- **LLM 不参与最终 Allow/Deny**（母本 9.9、硬边界）。策略输入见母本 8.12.2：`{actor, action, resource, data, context}`；输出 `allow / required_approvals / obligations / reason_codes / policy_version`，全部进 AuditLog。
- 策略输出可为：`ALLOW / ALLOW_WITH_DISCLOSURE / MASK_FIELDS / LIMIT_VOLUME / REQUIRE_APPROVAL / REQUIRE_EXPERT / DENY`（母本 10.10）。
- OPA 不可用时高风险动作 Fail Closed，低风险只读按缓存降级（母本 ADR-008）。
- 策略版本化、单元测试、回归、灰度、回滚（母本 8.12.3）。**受保护路径。**

阶段 0 占位；策略随 Policy Engine Epic（母本附录 N EPIC-POL-001）实现。
