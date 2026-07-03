# ADR-100：monorepo 工具链与语言基线

- **状态：** Accepted（2026-07-03）
- **关联母本：** 11.2 技术基线、11.5 代码库与模块组织、0.3 偏离规则

## Context

母本 11.2 将后端框架定为「NestJS/Nx」，Web 定为 Next.js。Nx 是母本点名的 monorepo 编排候选，但项目实际形态是多语言 monorepo（TypeScript 的 web/api/domain + Python 的 AI/爬虫/媒体 Worker），且开发主要由 Claude Code 执行——它对「透明的文件与配置」比对「插件化的 project graph 抽象」更容易推理和操作。

## Decision

- **包管理：** pnpm（`packageManager: pnpm@11.7.0`，corepack 固定版本）。
- **编排：** Turborepo（任务图、缓存），**替代母本点名的 Nx**。
- **语言：** TypeScript，`strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`（见根 `tsconfig.base.json`），Node ≥ 22。
- **Web：** Next.js（App Router）；**API：** NestJS——这两项遵循母本，不偏离。
- Python Worker 独立管理依赖（uv/poetry，M1 引入），与 TS 通过 `packages/contracts` 的 JSON Schema/契约通信，不共享 ORM（母本 11.5）。

## 偏离说明（Nx → Turborepo）

这是对母本 SHOULD 级选型的偏离，理由：
1. Nx 的增益（代码生成器、约束图、受影响构建）对本项目早期收益有限，却引入额外抽象层和学习面；
2. pnpm workspaces + Turborepo 是纯 `package.json` + `turbo.json`，Claude Code 可直接读写与推理，无需理解 Nx 插件模型；
3. 多语言 monorepo 中 Nx 对 Python 侧帮助不大；
4. 迁移成本低：若未来 codegen/约束治理需求上升，可在不改变目录结构的前提下引入 Nx。

## Consequences

- 好处：工具链透明、启动快、AI 可操作性高。
- 代价：失去 Nx 的 project graph 与生成器；跨包重构需自行约束（用 `packages/contracts` + CI 契约校验兜底）。
- 若此决策被推翻，改用 Nx 时目录结构（apps/*、packages/*）可保留。
