# CLAUDE.md — Global Growth Workspace 开发治理

本文件是 Claude Code 在本仓库开发时的**根级工程约束**。产品真相在
`docs/出海企业AI增长平台_总产品手册与PRD_v2.1_母本.md`（下称「母本」）。本文件只做工程约束，
**不覆盖母本的产品决策**。发生冲突时以母本为准；引用需求时用母本的稳定 ID（如 `CAM-008`、`DAT-005`、`ADR-002`）。

## 项目本质

面向中国出海企业的 AI 全球客户开发与增长执行平台。平台**主动**研究全球市场、发现目标企业和决策人、
生成内容与视频、执行多渠道发布与受控外联、统一互动，并把有效意向转化为可验证商业机会（SAO）。
客户自有 CRM/名单是**增强**，不是使用前置条件。

北极星：每个活跃 Workspace 每月新增的 Sales Accepted Opportunity（SAO）数量及其单位成本。
结果链：`Qualified Lead → Sales Accepted Opportunity → Verified Commercial Outcome`。

## 硬边界（MUST，违反即阻断）

1. **AI 不拥有业务状态。** LLM 只做理解、研究、生成、提出建议；状态、权限、预算、执行、审计、回滚由确定性系统负责。任何外部动作（发送、发布、删除、导出、报价）必须先产生 `ActionProposal`，经 Policy/Approval 后才执行。
2. **业务代码不直连厂商/Provider SDK。** 模型、数据、媒体、渠道、邮件、CRM 一律经 Adapter/Contract 接入（母本第 10、11 部分）。模型走自有 Model Gateway（`ADR-007`），不直接 import 厂商 SDK。
3. **Campaign 是业务上下文，不是巨型聚合根**（`D-009`）。Audience/ContentPlan/Sequence/Authorization/Opportunity 独立聚合，用 ID 和事件关联。
4. **PostgreSQL 是业务事实源。** Claim/Evidence/权限/审批/结果写 PG（`D-011`/`D-013`）。Cognee/Graphiti 只是候选辅助层，不拥有事实（`ADR-010`）。所有业务表带 `workspace_id`，启用 RLS（`ADR-001`）。
5. **数据权利字段级可追溯。** 每个 Canonical 字段带来源、许可、`allowed_actions`；展示/导出/AI/外联分别做 Policy Check（母本 8.10、`DAT-005/006`）。
6. **不采用腾道 API**（`D-015`）。腾道仅竞品分析，不作 Provider、不进 OSS 注册表。
7. **外联只走邮件和获授权渠道**（`D-019`）。禁止无授权抓取、批量加好友、自动私信、绕过验证码/登录墙。
8. **LLM 不做最终法律/财税/认证/价格结论**（`D-018`）。高风险经规则 + 专家确认。
9. **禁止**：把 API Key/Secret/供应商参数硬编码；把密钥写进仓库；绕过 Policy/Approval 执行外部动作；用 Streamlit/开源项目前端替代本产品 App Shell；把开源项目数据库当业务主库。

## 受保护路径（改动需在 plan mode 经 Owner 批准）

- `packages/contracts/**` — OpenAPI / AsyncAPI 事件 / JSON Schema（跨域契约，改动是 breaking change，走 `ADR-017`）
- `packages/policy/**` — OPA 策略
- `**/prisma/migrations/**` — 数据库迁移（必须可回滚）
- `**/*.state.ts`、状态机定义
- `CLAUDE.md`、`docs/母本`、`docs/adr/**`

`.claude/hooks/guard-protected-paths.mjs` 会对这些路径写操作发出提示，并硬阻断向仓库写入 `.env`/secrets。

## OPEN DECISIONS（未关闭，命中即停并向业务负责人提问，禁止推断）

来自母本 15.12，这些只有业务负责人能定，Claude Code 不得替其猜测：

1. 首批聚焦的 2 个行业
2. 首批 2 个目标国家/地区
3. 首批连接的发布/邮件平台
4. 外联在 MVP 是「只生成草稿/导出」还是「真实发送」（决定是否引入域名预热/发信基础设施/合规链路）
5. 试点商务模式（免费 / 付费 / 共建）
6. 是否提供代理商多客户（多 Workspace）模式
7. 私有化部署是否为首批要求
8. 哪些动作必须人工审批（默认：对外发送/发布、数据导出、跨境模型调用、删除/Suppression）
9. 数据供应商选择（经 Bake-off，母本附录 H/D）
10. 试点客户与成功标准

命中以上任一项时：停止，说明缺哪项决策、它阻断了什么，请业务负责人拍板。

## 开发工作流

1. **纵切片，不按层平推。** 第一条切片沿 J-A 旅程打穿骨架：Workspace/权限 → Company 知识 → ICP/Lead → Campaign 画布 →（mock 执行）。
2. **每个 Epic 先 plan mode**：列涉及的需求 ID、文件、Schema/API/事件变更、测试、迁移、回滚；经 Owner 批准后再写代码。
3. **一个 PR 一个清晰问题**；提交同时含代码、测试、迁移、文档、可回滚说明；迁移必须可回滚。
4. **合并前置检查**：`/code-review`（接口与实现）、`/security-review`（多租户隔离与数据权利）。
5. **新增 AI 功能必须同时提交** Task Contract（输入/输出 JSON Schema）+ Prompt + Golden Set（母本 9.4）。
6. **新增页面必须覆盖**五态：Empty / Loading / Error / Permission / Partial Success（母本 6.10）。
7. **新增 Tool 必须注册**权限、风险、幂等、审计。

## 目录与约定

- 见 `README.md` 目录表与 `docs/adr/` 技术基线。
- Domain package 不依赖具体 Provider SDK；Adapter 可依赖 SDK 但返回统一 Contract。
- Python（AI/爬虫/媒体 Worker）与 TypeScript 通过 JSON Schema/契约通信，不共享 ORM 模型（母本 11.5）。
- 提交信息用中文或英文祈使句，引用需求 ID；破坏性接口变更提升契约主版本并更新 `ADR`。

## 最小团队模式

单人/小团队下，母本 15.2/15.3 多个 Owner 角色可由同一业务负责人兼任；plan mode 的一次人工批准可替代常规变更的多角色会签。但**始终保留显式人工确认**：对外发送/发布授权、数据权利与导出、跨境模型调用、删除与 Suppression，以及上面的 OPEN DECISIONS。
