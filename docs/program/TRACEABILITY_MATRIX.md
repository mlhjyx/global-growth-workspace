# Traceability Matrix（追踪矩阵）

Epic → 需求 ID → 页面 → 事件 → ADR → 契约 → PR。随开发滚动填充。权威需求定义在母本第 7 部分；契约在 packages/contracts。

## M0 原型（apps/prototype）

| 批次/Epic | 覆盖需求域 | 页面 | 契约 | PR | 状态 |
|---|---|---|---|---|---|
| M0-1 数据与术语 | 全域术语/枚举对齐 | 全部 | fixtures 五域 | [#1](https://github.com/mlhjyx/global-growth-workspace/pull/1) | ✅ MERGED |
| M0-2 治理组件 | 6.13/6.12.1、CAM-007/008、KNW-006、DAT-005/006、ANA-005 | Today/客户/战役（接入） | workspace/campaign/opportunity 状态机 | 本分支 | 🔄 |
| M0-3 补缺页面 | MKT-001~013、KNW-001~011、LED-006/008、ENG-016/017、EXP、INT | PG-003/004/002/005/006/010/011/013 | 待补 MKT/CRT/PUB/ENG 契约 | — | ⬜ |
| M0-4 旅程串线 | 全链路 | 全部 | — | — | ⬜ |

## 契约↔需求（已建，packages/contracts）

| 域 | 需求 ID | Schema/事件/状态机 |
|---|---|---|
| workspace | WSP-001~010 | 10 schema + workspace.events + 3 状态机 |
| knowledge | KNW-001~011 | 9 schema + knowledge.events + claim.state |
| lead | LED-001~014 | 11 schema + lead.events + lead/icp.state |
| campaign | CAM-001~013 | 9 schema + campaign.events + campaign/execution-authorization.state |
| opportunity | ENG-007~017/ANA-013/014 | 4 schema + opportunity.events + opportunity/commercial-outcome.state（SAO 断链修复） |
| ai-tasks | KNW-002（Company Understanding） | input/output schema + task-contract + prompt.v1 + golden-set |

## 待建契约（M1 前置，RISK-105）

CRT（Create/Video）、PUB（Publish/Outbound）、ENG（Engage/Inbox，opportunity 已部分）、MKT（Market Research）、DAT（Data Hub）、PAK（Pack）、EXP（Expert）、INT（Integration）、ANA（Analytics 事件）。

## 需求→AI Task（母本 9.3，14 个 Task）

见 [packages/evals/README.md](../../packages/evals/README.md) 的 AI Task Registry。当前 1/14 打样（Company Understanding），其余随对应 Epic 实例化。
