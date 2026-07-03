# Test Strategy

权威：母本 14.1 测试金字塔（Unit/Contract/Integration/E2E/AI Eval/Security/Resilience/Usability）。仓库现状与计划：

| 层 | 现状 | 计划 |
|---|---|---|
| 契约校验 | ✅ contracts:validate（Ajv+yaml+fixtures 强校验），CI verify | Breaking change 检查（ADR-017）M1 加 |
| 类型/构建/格式 | ✅ CI verify | — |
| Unit | ⬜ 原型无单测（M0 可接受） | M1 起领域规则/评分/状态机必测 |
| Contract Test | ⬜ | M1 对 Adapter/真实服务（CONTRACT_TEST_PLAN） |
| Integration/E2E | ⬜ | M1 起（E2E_MATRIX） |
| AI Eval | 🔄 Golden Set 规格已立（1 Task） | 每 AI Task 附带（AI_EVALUATION_PLAN） |
| Security | ⬜ | M1 起（SECURITY_TEST_PLAN；租户隔离进 CI） |
| Usability/UAT | ⬜ | M0 Gate 1 用户测试（UAT_PLAN） |
