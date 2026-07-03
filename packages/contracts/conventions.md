# 契约公约（Contracts Conventions）

所有契约文件必须遵守本公约。违反公约的契约不得合并。权威业务定义在母本（`docs/…v2.1_母本.md`），本文只定工程形态。

## 目录

```
json-schema/common/        公共原语：envelope、field-evidence、primitives
json-schema/<domain>/      领域对象 Schema，一个对象一个文件：<object-name>.schema.json（kebab-case）
json-schema/ai-tasks/<task>/   AI Task 的 input/output Schema
asyncapi/<domain>.events.yaml  该域全部领域事件（AsyncAPI 3.0）
openapi/<domain>.yaml          该域 REST API（OpenAPI 3.1）
state-machines/<object>.state.ts  状态机（TS，受保护路径）
fixtures/                  样例数据（符合 json-schema，供 M0 原型与测试共用）
```

领域目录名：`workspace`、`knowledge`、`lead`、`campaign`、`opportunity`。

## JSON Schema

- Draft 2020-12；`$id` 用 `ggw://contracts/<domain>/<object-name>`。
- 字段名 **snake_case**（与母本 11.10 事件 Envelope、9.2 FieldEvidence 一致）。
- 每个 Schema 顶部 `description` 必须引用母本需求/章节 ID（如 `CAM-008`、`母本 7.6.2`）。
- 所有业务对象必含：`id`（前缀式，如 `cam_01H…`，见 primitives）、`workspace_id`、`created_at`、`updated_at`、`version`（乐观锁整数，母本 11.16）。
- 时间一律 ISO 8601 UTC 字符串（`format: date-time`）；金额 `{ amount, currency, original_amount?, original_currency? }`（母本 11.14）。
- 枚举值 UPPER_SNAKE_CASE，与状态机文件保持同一份取值。
- `additionalProperties: false`（对象封闭；扩展走版本演进）。

## 事件（AsyncAPI）

- 事件名 **PascalCase** + `schema_version`（母本 0.5、11.11），不用数字编号。
- 每个事件 payload 单独定义，Envelope 引用 `common/envelope.schema.json`（母本 11.10 字段：event_id、event_type、schema_version、workspace_id、aggregate_type、aggregate_id、occurred_at、producer、correlation_id、causation_id、privacy_classification、payload）。
- 事件必须列在所属域的 `asyncapi/<domain>.events.yaml`；同一事件不得在两个域重复定义。
- 消费者幂等（至少一次投递，母本 ADR-009）；payload 里不放可从事实源查到的大对象，放 ID + 变更要点。

## API（OpenAPI 3.1）

- 路径分组按母本 11.12（`/workspaces`、`/companies`、`/knowledge`、`/icps`、`/leads`、`/campaigns`、`/opportunities` …）。
- 所有写操作要求 `Idempotency-Key` 头（母本 11.16）；更新用 `If-Match`/`version` 乐观锁，冲突返回 `VERSION_CONFLICT`（母本 11.15）。
- 错误模型统一：`{ error_code, message, details?, retryable, policy_reason_codes? }`，error_code 用母本 11.15 机器码（`ACTION_DENIED`、`AUTHORIZATION_REQUIRED`、`BUDGET_EXCEEDED`、`LICENSE_RESTRICTED`…）。
- 列表统一 cursor 分页：`?cursor=&limit=`，响应 `{ items, next_cursor }`。
- 每个 operation 的 `description` 引用需求 ID；标注所需 Policy 动作（如 `policy: lead.export`）。

## 状态机（*.state.ts）

- 每个对象一个文件：状态 union type + 显式转移表 `TRANSITIONS: Record<State, State[]>` + 触发事件名映射。
- 状态取值与母本 11.9 一致；扩展必须在文件头注明来源（如「ENG-017 补 WITHDRAWN/DOWNGRADED」）。
- 状态机文件是受保护路径：改动 = 业务规则变更，走 plan mode 审批。

## 追踪

- 每个文件头部注释/description 写明：母本需求 ID、负责域、schema_version。
- Breaking change：提主版本 + 迁移说明（母本 ADR-017）；`contracts:validate` 在 CI 校验。
