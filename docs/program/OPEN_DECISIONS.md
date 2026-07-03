# Open Decisions（未关闭业务决策）

**唯一活跃跟踪。** 母本 15.12 与 CLAUDE.md 的清单以本文件为准。规则（CLAUDE.md 硬边界）：命中未关闭项即停止，向业务负责人提问，**禁止 Claude Code 自行假设或静默改变产品边界**。关闭后移入 [DECISION_LEDGER.md](DECISION_LEDGER.md) 并标 PDR 编号。

| ID | 决策 | 阻塞什么 | 最晚关闭点 | 状态 |
|---|---|---|---|---|
| OD-01 | 首批 2 个行业 | fixtures/Pack/试点画像 | M0 用户测试前 | ✅ 关闭 → PDR-001（光伏能源、建材） |
| OD-02 | 首批目标区域/国家 | 同上 | M0 用户测试前 | ✅ 区域关闭 → PDR-001（东南亚、非洲）；**国家级 3 个 Market Pack 待收敛** |
| OD-03 | 首批 3 个 Growth Motion Pack | M1 W3 Campaign Epic | Campaign M1 Schema 冻结前 | ⬜ 开放（候选 GM-TRD/GM-DIST/GM-ABO） |
| OD-04 | 首批发布平台（M2 四个） | M1 W4 Publish Adapter | Publish Adapter Spike 前 | ⬜ 开放 |
| OD-05 | 首批互动回流平台（M2 两个） | M1 W5 Engage | Engage Spike 前 | ⬜ 开放 |
| OD-06 | **外联 MVP：只做草稿/导出 vs 真实发送** | 决定是否引入域名预热/发信基础设施/合规链路（工作量差一倍） | M1 Outreach Dev-Ready 前 | ⬜ 开放（高影响） |
| OD-07 | 首批数据源组合（贸易/行业 + 企业/联系人 + 邮箱验证） | Data Hub M1 实现、Provider Bake-off 范围 | Data Hub M1 实现前 | ⬜ 开放（架构已多源可替换；V-006） |
| OD-08 | AiToEarn 实际复用的模块范围 | M1 W4 EPIC-EXEC-001 | AiToEarn Spike（V-002）后 | ⬜ 开放 |
| OD-09 | 知识层：Cognee / Graphiti / pgvector 基线选型 | M1 W2 知识实现 | Bake-off（V-004）后 | ⬜ 开放（ADR-004 保留接口，pgvector 为退出基线） |
| OD-10 | 试点商务模式（免费/付费/共建）+ 首批 Design Partner 与成功阈值 | M2 客户招募与成功口径 | M2 客户招募前 | ⬜ 开放 |
| OD-11 | 代理商多 Workspace 模式是否进入首批 | Workspace M1 Schema（RBAC/委派） | Workspace M1 Schema 冻结前 | ⬜ 开放 |
| OD-12 | 私有化部署是否进入 M3 | M2 架构冻结（区域/租户隔离物理模式） | M2 架构冻结前 | ⬜ 开放（ADR-001 逻辑隔离，物理待定） |
| OD-13 | 哪些动作必须人工审批 | Policy/审批链默认集 | M1 W1 Policy Epic | ⬜ 默认集已定（对外发送/发布、数据导出、跨境模型、删除/Suppression），最终以业务确认为准 |

## 提问模板（命中未关闭项时对业务负责人）

> 决策 OD-XX「<决策>」尚未关闭，它阻断了 <Epic/工作>。可选项：<A/B/C 及各自代价>。在你拍板前，我不会替你假设，相关 Epic 停在编码前。
