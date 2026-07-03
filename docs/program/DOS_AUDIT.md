# Development Operating System 建立审计（2026-07-03）

指令要求的八层研发体系对照仓库现状的一次性审计；后续状态以 README/ROADMAP 滚动为准。

## 八层现状

| 层 | 内容 | 现状 |
|---|---|---|
| L0 母本 | v2.1 | ✅ docs/（baseline/ 指针已立；母本文件位置不动，避免断链） |
| L1 项目治理 | program 9 件 | ✅ 本 PR 补齐（新增 CHARTER/CHANGE_CONTROL/GITHUB_CHECKLIST/DOS_AUDIT；7 件套自 PR#2 迁入 docs/program） |
| L2 Epic 包 | 模板 + M0 六包 + FOUNDATION | ✅ 本 PR（M0-01/02 为追溯记录，03-06 初始包） |
| L3 机器契约 | 五域 46 Schema/5 OpenAPI/5 AsyncAPI/11 状态机/fixtures/AI Task | ✅ 首批；CRT/PUB/ENG/MKT/DAT 待补=M1 前置（RISK-105） |
| L4 工程实现 | apps/prototype（M0）；web/api/services=M1 | 🔄 M0 2/6 Epic；M1 运行时未开始（不建空壳目录） |
| L5 质量体系 | testing 6 件 + security 5 件 + evals | ✅ 骨架本 PR；执行随 M1 |
| L6 发布体系 | CI verify ✅；Preview=EPIC-M0-06；环境/CD=M1 | 🔄 |
| L7 商业运营 | docs/business | ⬜ 未建（不阻塞开发；随融资/试点需要） |

## 与指令目录树的差异（有意为之，防重复事实源）

- `docs/business/`、`docs/design/`、`docs/operations/`、`packages/domain|ai-registry|ui`、`services/*`：**未建空目录**——无内容的壳会伪装成就绪；随对应阶段创建
- `docs/ai/` → 现为 `packages/evals`（Registry+Golden Set 同码仓，利于 CI 校验）；`docs/oss/<project>/` 目录式 → 现为单文件交付卡（9 段齐备，文件粒度够用，项目复杂化时再拆目录）
- 母本不改名不搬家（CLAUDE.md/hook/大量引用锚定该路径）；`docs/baseline/README.md` 作规范入口

## GitHub 治理状态（诚实）

已配：仅 squash+删分支、里程碑 M0-M3、13 标签、PR/Issue 模板、CODEOWNERS、dependabot。待 Pro：分支保护/Required Checks（403 已验证，用户升级中，命令已备于 GITHUB_CONFIGURATION_CHECKLIST）。待做：Project 看板、labeler、CI 扩展。

## 风险

本 PR 为 R2（触及 CLAUDE.md），按 CHANGE_CONTROL 需人工批准合并——本体系的第一次自我执行。
