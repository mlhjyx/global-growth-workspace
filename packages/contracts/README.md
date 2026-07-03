# @ggw/contracts

跨域契约的**单一事实源**。领域类型、API 客户端、事件类型由此**生成**，业务代码不手写重复类型。

## 目录（阶段 1 P0 契约生成时建立）

```
openapi/       REST 端点，按母本 11.12 API 分组（/workspaces /companies /leads /campaigns …）
asyncapi/      领域事件：Envelope（母本 11.10）+ 每事件 payload schema + schema_version（母本 11.11）
json-schema/   领域对象 与 AI Task 输入/输出 Schema（母本 9.4）
adapters/      Provider Adapter 的 TS 接口（母本 11.13 ProviderAdapter、ContentExecutionProvider 等）
```

## 规则

- **受保护路径**：改动是跨域 breaking change，经 plan mode 审批；提升契约主版本并提供迁移（母本 ADR-017）。
- 事件命名 PascalCase + `schema_version`（母本 0.5、11.11），不用数字编号。
- `contracts:validate` 在 CI 跑校验与兼容性检查（ADR-104）。
- Provider JSON **禁止**穿透领域层——Adapter 返回统一 Contract（母本 9.7 Adapter 契约）。

## 首批（P0 四域）待生成

`WSP`（Workspace/权限）、`KNW`（企业知识/Claim）、`CAM`（Campaign/授权）、`LED`（ICP/Lead）——见母本第 7.1/7.2/7.6/7.5 节需求与第 11.9 状态机。
