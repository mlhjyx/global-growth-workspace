# Bounded Contexts（限界上下文）

权威：母本 9.1（11 个数据域）+ 11.5（monorepo 组织）。仓库映射：

| Context | 契约 | 实现位置（M1） | 所有权要点 |
|---|---|---|---|
| Workspace/Identity | contracts/workspace | domain-workspace | 租户边界，一切对象带 workspace_id |
| Company/Knowledge | contracts/knowledge | domain-knowledge | Claim/Evidence 事实源在 PG（D-013） |
| Market/Research | 待建（M1 W2） | domain-research | 研究产出必须落可执行对象 |
| Data Hub | 待建（M1 W2） | worker-data | Raw→Canonical，字段级权利 |
| ICP/Lead | contracts/lead | domain-lead | 六维评分、Suppression 不可覆盖 |
| Campaign/Execution | contracts/campaign | domain-campaign | Campaign=上下文非聚合根（D-009） |
| Content/Media | 待建（M1 W4） | domain-content + worker-media | 资产带 RightsRecord |
| Engage/Opportunity | contracts/opportunity（部分） | domain-engage | 三级结果链、SAO 回写 |
| Analytics | 待建 | domain-analytics | 规则归因非因果 |
| Pack/Expert | 待建 | domain-pack / domain-expert | Pack 版本化快照 |
| AI/Operations | ai-tasks 契约 | worker-ai | Trace 脱敏（ADR-016） |

> 注：M1 允许领域逻辑先内联 `apps/api` `modules/<ctx>/domain/`，第二消费方出现再抽 `packages/domain-*`，见 EPIC-FOUNDATION §0.2（BE-01α 冻结）。

跨 Context 只经契约与事件，不共享 ORM 模型（Python/TS 亦同，母本 11.5）。
