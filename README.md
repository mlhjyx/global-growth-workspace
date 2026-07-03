# 出海企业 AI 全球客户开发与增长执行平台（Global Growth Workspace）

面向中国出海企业的 AI 全球客户开发与增长执行平台：平台主动研究全球市场、发现目标企业和决策人、生成图文与视频、执行多渠道发布与受控外联、统一处理互动，并把有效意向转化为可验证商业机会（SAO）。

## 单一真相源

- **产品真相**：[`docs/出海企业AI增长平台_总产品手册与PRD_v2.1_母本.md`](docs/出海企业AI增长平台_总产品手册与PRD_v2.1_母本.md) —— 唯一产品母本，含宪章、20 条锁定决策、170 条功能需求、架构与 Release 路线。
- **工程治理**：[`CLAUDE.md`](CLAUDE.md) —— Claude Code 开发的硬边界、目录约定、待关闭决策。
- **架构决策**：[`docs/adr/`](docs/adr/) —— 技术基线 ADR。

发生冲突时，优先级：法律/平台硬规则 > 企业策略 > 母本 Approved 决策 > Release 基线 > Pack 规则 > Campaign 配置 > AI Recommendation。

## 技术栈

pnpm workspaces + Turborepo · TypeScript(strict) · Next.js(Web) · NestJS(API) · PostgreSQL + Prisma · Temporal(耐久流程) · OPA(策略) · 契约优先（OpenAPI/AsyncAPI/JSON Schema）。选型理由见 `docs/adr/`。

## 目录

| 路径 | 用途 |
|---|---|
| `apps/web` | Next.js 前端 App Shell |
| `apps/api` | NestJS BFF/API |
| `apps/worker-*` | AI / 数据 / 媒体 / 集成 Worker |
| `packages/contracts` | OpenAPI、AsyncAPI 事件、JSON Schema（**受保护路径**） |
| `packages/domain-*` | 领域模型与应用服务 |
| `packages/policy` | OPA 策略与测试（**受保护路径**） |
| `packages/evals` | Golden Set 与评估器 |
| `packages/ui` | 设计系统与结构化 AI 组件 |
| `infra` | docker-compose、部署与 Runbook |
| `docs` | 产品母本、ADR |

## 快速开始

```bash
corepack enable          # 启用 pnpm 11.7
pnpm install             # 安装依赖（首次）
pnpm -w run typecheck    # 类型检查
pnpm -w run test         # 测试
```

本地依赖（PostgreSQL/Redis）见 `infra/docker-compose.dev.yml`。

## 当前阶段

**执行状态的唯一事实源是 [docs/program/ROADMAP.md](docs/program/ROADMAP.md) 的「当前状态」块**——本节只给入口，不复制状态（防止两处过期不一致）。

概要（可能滞后于 ROADMAP）：产品母本 v2.1 已批准；五域 P0 契约完成；M0 可点击原型开发中（六个 Epic 按 ROADMAP 表推进）；治理体系见 docs/program/（R0-R3 变更控制、决策账本、风险登记）；仓库已公开（PDR-004），main 由 ruleset 保护（仅 PR + CI verify 必绿）。
