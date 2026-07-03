# ADR-101：数据层——PostgreSQL + Prisma + Row Level Security

- **状态：** Accepted（2026-07-03）
- **关联母本：** D-011、D-013、ADR-001（Shared DB + workspace_id + RLS）、ADR-015（PII/字段级加密）、8.10 数据权利

## Context

母本锁定 PostgreSQL 为业务事实源，M1/M2 采用 Shared Database + Shared Schema，所有业务表带 `workspace_id` 并启用 RLS 作纵深防御（ADR-001）。母本未指定 ORM。

## Decision

- **数据库：** PostgreSQL；本地经 `infra/docker-compose.dev.yml` 提供。
- **ORM：** Prisma。选它是因为 schema-first 与本项目「契约优先」一致，迁移可回滚可审计，且 Claude Code 对声明式 schema 友好。
- **多租户：** 每张业务表 `workspace_id NOT NULL`；启用 Postgres RLS 策略，应用层再强制 tenant scope（双层）。跨租户读写、向量检索、缓存污染纳入自动化隔离测试（母本 12.2）。
- **迁移：** 走 `prisma migrate`，迁移文件在 `**/prisma/migrations/**`（受保护路径，必须可回滚）。
- **敏感字段：** 邮箱/电话等按母本 ADR-015 做字段级加密/Tokenization，明文只对授权角色短时解密。
- **检索：** 起步用 Postgres FTS + pgvector（母本 ADR-003）；超阈值再评估 OpenSearch。

## Consequences

- Prisma 对复杂 RLS 和原生 SQL 有一定摩擦，必要时用 `$queryRaw` + 视图；RLS 策略本身以 SQL 迁移维护，不由 ORM 生成。
- 事实源单一：Cognee/Graphiti/向量库都是投影或辅助层，删除以 PG 为准（母本 8.15 删除编排）。
