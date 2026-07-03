# Decision Ledger（决策账本）

已锁定决策的权威表在**母本 v2.1 附录 A（Decision Ledger）与 1.4（D-001~D-020）**。本文件只登记母本冻结后新增/关闭的项目级决策（PDR = Product Decision Record）。冲突时优先级：法律/平台硬规则 > 企业策略 > 母本 Approved 决策 > 本账本 PDR > Release 基线。

## 项目级决策（母本冻结后）

| 编号 | 决策 | 状态 | 记录 |
|---|---|---|---|
| PDR-001 | 首批试点行业=光伏能源、建材；区域=东南亚、非洲（M2 试点范围，非产品限制） | APPROVED (2026-07-03) | [docs/decisions/PDR-001](../decisions/PDR-001-首批试点行业与目标市场.md) |
| ADR-100 | monorepo = pnpm workspaces + Turborepo（母本 11.5 未定工具链，Nx→Turborepo 偏离已记录） | APPROVED | docs/architecture/adr/ |
| ADR-101 | 主库 PostgreSQL + Prisma + RLS（M1 落地） | APPROVED | 同上 |
| ADR-102 | 契约优先：packages/contracts 为跨域单一事实源（受保护路径） | APPROVED | 同上 |
| ADR-103 | 本地环境 docker-compose（PG+Redis）；Temporal M1 引入 | APPROVED | 同上 |
| ADR-104 | CI = GitHub Actions（verify：type-check/build/format/contracts） | APPROVED | 同上 |
| PDR-002 | 开发执行主体 = Claude Code（非 Codex）；v2.1 已全文修正第 15 部分 | APPROVED | 母本 v2.1 附录 P.1 |
| PDR-003 | **不升级 GitHub Pro**：私有仓库维持 Free，服务端分支保护/Required Checks 不启用；以 CLAUDE.md 合并纪律 + CHANGE_CONTROL R0-R3 判定协议为唯一补偿控制（业务负责人拍板 2026-07-03） | APPROVED | RISK-101 更新为"接受残余风险" |

## 被取代/拒绝（防回潮）

见母本附录 A。要点：腾道作 API/Provider = REJECTED（仅竞品）；Campaign 巨型聚合根 = SUPERSEDED；客户资料第一来源 = SUPERSEDED；QGO 作唯一结果 = SUPERSEDED（改三级结果链）。

新增决策流程：影响产品定位/领域所有权/基础设施/数据库/公共 API/租户隔离/数据授权/开源升生产的变更，Claude Code 不得自决，必须先出 ADR 或 PDR 经人批准（母本 15.13.5 / 本账本）。
