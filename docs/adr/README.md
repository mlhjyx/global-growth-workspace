# 架构决策记录（ADR）

两套 ADR 编号，互不冲突：

- **ADR-001 ~ ADR-018**：产品架构决策，定义在**母本第 11.6 节**（多租户、Temporal、搜索、知识、AiToEarn、区域等）。这里不重复，只引用。
- **ADR-100 ~**：**工程落地决策**，把母本的框架级选型落到可执行的工具链、数据层、契约、环境、CI。本目录维护。

母本 0.3 规定：偏离 SHOULD 级选型必须有 ADR。以下 ADR-100 记录了对母本「NestJS/Nx」中 Nx 的偏离。

## 索引

| ID | 决策 | 状态 |
|---|---|---|
| [ADR-100](ADR-100-monorepo-toolchain.md) | monorepo 工具链与语言基线：pnpm workspaces + Turborepo + TypeScript(strict) | Accepted |
| [ADR-101](ADR-101-data-layer.md) | 数据层：PostgreSQL + Prisma + Row Level Security | Accepted |
| [ADR-102](ADR-102-contracts-first.md) | 契约优先：OpenAPI / AsyncAPI / JSON Schema 集中于 packages/contracts | Accepted |
| [ADR-103](ADR-103-local-dev-env.md) | 本地开发环境：docker-compose（PostgreSQL + Redis），Temporal/OPA 按需 | Accepted |
| [ADR-104](ADR-104-ci-and-testing.md) | CI 与测试：GitHub Actions + Vitest + Playwright + 契约校验 | Accepted |

## 格式

每个 ADR 包含：Status、Context、Decision、Consequences、关联母本。变更用新 ADR 取代旧 ADR（标 Superseded），不就地改写已 Accepted 的决策。
