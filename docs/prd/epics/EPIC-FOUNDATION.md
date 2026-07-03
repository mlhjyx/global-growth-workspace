# Dev-Ready Package：EPIC-FOUNDATION（M1 Foundation）

> **交付要求 #12：M1 生产实现开始前必须提交并通过本包评审。** 当前为骨架，M0 期间随架构去风险 Spike 结果逐步填充；未过 Gate 3 不启动 M1 Runtime 编码。

- **Release / Wave：** M1 / Wave 1
- **覆盖需求：** WSP-001~010（部分）、母本第 11 部分架构、ADR-001~018 + ADR-100~104
- **依赖 Open Decision：** OD-11（代理商模式影响 Workspace Schema）、OD-13（审批默认集）
- **依赖 Spike：** Temporal / OPA / LiteLLM / Langfuse（docs/oss/，W1）——**Spike 结果直接决定本包，故 Spike 先行**

## 待交付内容（11 段，随 Spike 填充）

| 段 | 内容 | 状态 |
|---|---|---|
| 1 Product Requirements | 多租户平台地基、Workspace/权限/审批/预算/审计 | 母本 7.1 已定 |
| 2 User Flow | 建组织→Workspace→成员→角色→策略 | ⬜ |
| 3 UI States | 设置页/权限/审批八态 | ⬜ |
| 4 Domain Model | Core ERD（Prisma）+ Tenant Scope + RLS + PII 分级 | ⬜ 契约已有 workspace 域 Schema |
| 5 API/Event | /workspaces 组 OpenAPI + workspace.events（已建）→ NestJS 实现 | 🔄 契约已建 |
| 6 Permissions | RBAC+ABAC 矩阵、Policy 动作、审批链、审计事件 | ⬜ 依赖 OPA Spike |
| 7 Tests | 租户隔离测试、RLS 测试、权限矩阵测试、契约测试 | ⬜ |
| 8 AI Eval | N/A（Foundation 无 AI Task） | N/A |
| 9 Threat Model | 多租户泄漏（RISK-009）、Secret、认证、越权、SSRF | ⬜ 关键 |
| 10 Rollout/Rollback | 迁移可回滚、Feature Flag、灰度 | ⬜ |
| 11 Task Breakdown | Adapter Framework / Tenant / RBAC / Outbox / Policy / Approval 拆 PR | ⬜ |

## Foundation 运行时清单（母本评审修正：设计≠实现，以下均 M1）

PostgreSQL + Prisma Schema + RLS · 认证授权运行时 · Transactional Outbox + 幂等消费者 + DLQ · OPA 执行 · Temporal Runtime · Model Gateway · Secret 管理 · OpenTelemetry · 迁移/回滚 · docker-compose→部署拓扑 · Backup/RPO/RTO · 生产 CI/CD · Provider Contract Test 对真实服务。

**当前 Foundation 状态：设计/契约/校验基线已立（ADR-100~104、五域契约、CI verify）；运行时实现全部属 M1，未开始。**
