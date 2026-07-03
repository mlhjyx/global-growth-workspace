# Event Architecture（事件架构）

权威：母本 11.10（Envelope）/ 11.11（事件词典）/ ADR-009（Outbox）。仓库落地：

- Envelope Schema：packages/contracts/json-schema/common/envelope.schema.json（PascalCase 事件名 + schema_version）
- 各域事件：packages/contracts/asyncapi/&lt;domain&gt;.events.yaml（唯一定义处，5 域已建）
- 传输：M1 用 PostgreSQL Transactional Outbox + 幂等消费者；规模阈值后引入 Broker（ADR-009）
- Webhook：验签、provider_event_id 去重、重放、死信（ADR-014）
- correlation_id 贯穿 Campaign/Workflow/Trace（母本 10.10.3）
- SAO 结果链事件（SAOAccepted/SAOWithdrawn/OutcomeVerified 等）已补齐于 opportunity.events.yaml
