# Integration Boundaries（集成边界）

权威：母本第 10 部分（逐项目边界）、11.13（Adapter 契约）、docs/program/DEPENDENCY_MAP.md。硬规则：

- 业务代码禁止 import 厂商/Provider/开源项目 SDK；一律经 packages/adapters-* 返回统一 Contract
- Adapter 必返回 external_id / cost / evidence / license / raw_record_ref；错误映射为统一类别（母本 11.15）
- 每个执行调用带 workspace_id + correlation_id + idempotency_key + authorization_id
- 外部开源服务不得直连主数据库（母本 11.4）；爬虫/媒体 Worker 网络隔离（ADR-013）
- 禁止的集成方式清单见母本 10.19
