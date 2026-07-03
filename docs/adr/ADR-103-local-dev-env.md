# ADR-103：本地开发环境——docker-compose（PostgreSQL + Redis）

- **状态：** Accepted（2026-07-03）
- **关联母本：** 11.2 技术基线、ADR-002（Temporal/BullMQ 分工）、ADR-013（爬虫隔离）

## Context

母本目标架构涉及 PostgreSQL、Redis、Temporal、OPA、对象存储、pgvector 等。全部本地化会让阶段 0 过重。原则：**只起当前切片需要的依赖**。

## Decision

- `infra/docker-compose.dev.yml` 阶段 0 只含：
  - `postgres`（含 pgvector 扩展镜像）；
  - `redis`（BullMQ/缓存，母本 ADR-002 短任务）。
- **按需引入（M1 起，各自 ADR/占位）：** Temporal（耐久流程）、OPA（策略）、MinIO（S3 兼容对象存储）、OpenSearch（超阈值时）。
- 连接参数经 `.env`（不入库，见 `.env.example`）；密钥不硬编码（CLAUDE.md 硬边界、guard hook）。
- 爬虫/媒体 Worker 未来独立网络与沙箱，不直连主库（母本 ADR-013、8.11）。

## Consequences

- 阶段 0 一条 `docker compose up` 即可起 PG+Redis，足够跑 Workspace/Knowledge/Campaign/Lead 骨架与 M0 mock。
- Temporal/OPA 延后不影响契约设计——它们经 Adapter/Workflow 接入，接口先定。
