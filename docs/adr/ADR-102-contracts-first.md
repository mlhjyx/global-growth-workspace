# ADR-102：契约优先——OpenAPI / AsyncAPI / JSON Schema 集中于 packages/contracts

- **状态：** Accepted（2026-07-03）
- **关联母本：** ADR-017（Schema 版本化）、11.10 事件 Envelope、11.12 API 分组、9.6 Registry

## Context

母本第 11 部分给出 API 分组、事件 Envelope 和 Adapter 契约的骨架，但 payload/端点级 schema 未定。为避免各域各自发明、Provider JSON 穿透领域层，契约必须集中、版本化、CI 校验。

## Decision

- 所有跨域契约集中在 `packages/contracts`：
  - `openapi/` — REST 端点（按母本 11.12 分组）；
  - `asyncapi/` — 领域事件（Envelope + 每事件 payload schema + `schema_version`，母本 11.10/11.11）；
  - `json-schema/` — 领域对象与 AI Task 输入/输出 Schema；
  - `adapters/` — Provider Adapter 的 TypeScript 接口（母本 11.13）。
- **单一事实源：** 领域类型、API 客户端、事件类型由契约**生成**，业务代码不手写重复类型。
- **版本化：** breaking change 提升契约主版本并提供迁移（母本 ADR-017）；CI 跑兼容性检查（`contracts:validate`）。
- **事件命名：** PascalCase 事件名 + `schema_version`（母本 0.5、11.11），不使用数字编号。
- **保护：** `packages/contracts/**` 是受保护路径，改动经 plan mode 审批。

## Consequences

- 前期需搭生成管线（schema → TS 类型/客户端），一次性成本。
- 收益：领域层与 Provider 解耦、跨语言（TS/Python）一致、契约破坏在 CI 即暴露。
