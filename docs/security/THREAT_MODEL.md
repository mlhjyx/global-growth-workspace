# Threat Model（骨架，EPIC-FOUNDATION 补全为正式版）

顶级威胁（对应 RISK_REGISTER）：

1. 跨租户数据泄漏（RISK-009，极高）→ workspace_id 强制 + RLS + 隔离测试进 CI
2. Prompt Injection 驱动工具越权 → 外部内容一律不可信；工具仅接受 Schema 化参数 + OPA + 审批（母本 12.4）
3. 爬虫 SSRF/内网访问 → 隔离 Worker + Allowlist + 元数据阻断（ADR-013）
4. 数据权利违规（导出/外联越权）→ 字段级五权利 Policy Check（DAT-006）
5. Secret 泄漏 → 不入库（hook 阻断）+ KMS（ADR-015）+ 扫描
6. 未授权外部动作 → ActionProposal→Policy→Approval→不可变授权（硬边界 1）

正式版须含：数据流图、信任边界、STRIDE 逐项、缓解措施到测试用例的映射。
