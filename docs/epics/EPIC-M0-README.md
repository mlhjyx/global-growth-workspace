# M0 Epic 总览（六个 Epic，替代原四批划分）

按业务评审把 M0 从 4 批重切为 6 个 Epic（= 6 个 PR 线）。M0 全模拟；完成标准见 docs/program/RELEASE_GATES.md（非 PR 数量）。原型 Epic 的 Dev-Ready 要求按「原型减免」执行：无 API/迁移/威胁建模（全模拟），但页面范围、UI 状态、术语契约、任务拆分必填。

| Epic | 内容 | 状态 |
|---|---|---|
| [EPIC-M0-01](EPIC-M0-01-data-terminology.md) 数据与术语 | fixtures/结果链/枚举/合规清理/导航 | ✅ PR #1 已合并 |
| [EPIC-M0-02](EPIC-M0-02-governance.md) 治理组件 | Evidence/Approval/DryRun/Badges/八态 + Today 接入 | ✅ PR #2 已合并 |
| [EPIC-M0-03](EPIC-M0-03-research-knowledge.md) 研究与知识页面 | Global Market Scan、Research Workspace、Claim 审核台、ICP Builder 升级 | ⬜ 下一个 |
| [EPIC-M0-04](EPIC-M0-04-customer-campaign.md) 客户/Campaign/执行页面 | Lead Explorer 补全（Score Explain/四队列）、Campaign Canvas 治理接入、Content/Video/Publish 占位升级 | ⬜ |
| [EPIC-M0-05](EPIC-M0-05-engage-insight.md) Engage/Opportunity/Insight | Inbox Context 面板、三级结果链视图、归因/成本页 | ⬜ |
| [EPIC-M0-06](EPIC-M0-06-journey-validation.md) 旅程与验证基础 | J-A/J-B 串线、埋点、Preview 部署、测试脚本、Gate 1 Report 模板 | ⬜ |
