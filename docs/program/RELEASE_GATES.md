# Release Gates（发布门）

母本 13.10（战略/交付 Gate 0-5）与 15.4（研发就绪 Gate）的活跃跟踪。Gate 未过不得进入下一阶段。

| Gate | 通过条件 | 当前状态 |
|---|---|---|
| Gate 0 战略 | 决策、定位、目标客户、一级域、非目标锁定 | ✅ 通过（母本 v2.1 + PDR-001） |
| Gate 1 体验 | 完整原型通过任务测试；Demo↔PRD 映射完成；8-12 用户测试 | 🔄 Demo Gap 完成（V-001）；**M0 完成标准见下**；用户测试待原型就绪 |
| Gate 2 技术与供应商 | AiToEarn/Video/Knowledge/Crawler/Provider/平台权限/邮件 Spike 通过 | ⬜ 未开始（= 架构去风险线 + V-002~V-008） |
| Gate 3 Development Ready | 页面/需求/数据/API/事件/ADR/测试/Backlog 完整（逐 Epic） | 🔄 P0 契约首批完成；逐 Epic 补 Dev-Ready Package |
| Gate 4 Pilot Ready | 数据权利/安全/发信/平台/专家/Runbook/支持就绪 | ⬜ M2 前置 |
| Gate 5 Commercial Ready | SLA/计费/毛利/安全/灾备/合同/客户成功 | ⬜ M3 前置 |

## M0 完成标准（交付要求 #11 —— 不是"四个 PR 合并"）

M0 视为完成，须同时满足：

- [ ] 两条完整旅程端到端可操作：J-A（光伏→东南亚主动获客）、J-B（建材→非洲经销商招募）
- [ ] Preview 部署可访问（供 Design Partner 点击）
- [ ] 目标用户测试完成（≥ 数名试点画像用户，任务式测试）
- [ ] Gate 1 指标通过：无培训任务完成率、术语理解、错误恢复、审批理解（母本 12.1 Usability）
- [ ] Validation Report 完成（原型验证结论 + Demo↔PRD 最终映射 + 发现问题清单）

M0 四个 PR（数据术语 / 治理组件 / 补缺页面 / 旅程串线）是**达成上述标准的手段**，合并 ≠ M0 完成。

## M1 前置（交付要求 #12）

M1 生产实现开始前，必须提交并通过评审：**[EPIC-FOUNDATION Dev-Ready Package](../epics/EPIC-FOUNDATION.md)**（含 C4、ADR 基线、Core ERD、Tenant/RBAC、Event Envelope、Adapter Contract、OpenAPI Baseline、CI/CD、Security Baseline、Threat Model）。未过不启动 M1 Runtime 编码。
**Foundation 例外（GDR-002，2026-07-04）**：该包两阶段化——阶段一（BE-01α）经业务负责人 R2 批准即启动地基运行时（BE-02..05）；阶段二（BE-01β）随 Spike 验收卡终审，最晚 BE-04 前；纵向切片需 BE-01β。见 docs/program/M1_BACKEND_FOUNDATION_PLAN.md。
