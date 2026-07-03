# ADR-104：CI 与测试——GitHub Actions + Vitest + Playwright + 契约校验

- **状态：** Accepted（2026-07-03）
- **关联母本：** 14.1 测试金字塔、ADR-017（契约兼容性）、ADR-018（灰度/回滚）、15.13 开发治理

## Context

母本 14.1 定义测试金字塔（Unit/Contract/Integration/E2E/AI Eval/Security/Resilience/Usability）。CI 需把其中可自动化的部分设为合并前置门槛，并把 CLAUDE.md 的硬边界转成机器校验。

## Decision

- **CI：** GitHub Actions（`.github/workflows/ci.yml`），PR 触发，串起：install → format:check → lint → typecheck → test → `contracts:validate`。
- **单元/契约测试：** Vitest。
- **E2E：** Playwright（母本已用于 AiToEarn），覆盖五条核心 Journey（母本 13.9）。
- **AI Eval：** Golden Set 在 `packages/evals`，作为独立 job（母本 14.2 阈值按任务风险定，不用统一准确率）。
- **契约校验：** `contracts:validate` 跑 OpenAPI/AsyncAPI/JSON Schema 校验与兼容性检查（ADR-102/母本 ADR-017），breaking change 无迁移则失败。
- **合并前置：** `/code-review` + `/security-review`（多租户隔离、数据权利、SSRF、Prompt Injection、导出与 Secret，母本 14.1 Security 行）。

## Consequences

- 阶段 0 先落 lint/typecheck/format/契约校验骨架；test/E2E/Eval 随对应域代码补齐。
- 安全与租户隔离测试是硬门槛，不通过不合并（母本 12.2、RISK-009）。
