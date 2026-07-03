# Change Control（变更控制与合并判定协议）

变更等级 L1-L5 沿用母本 15.15。本文件补充 **PR 风险分级（R0-R3）与 Claude Code 合并判定协议**——回答"下次合并你自行判断"的判断标准。

## PR 风险分级

| 级别 | 范围 | 合并权限 |
|---|---|---|
| **R0** | 纯文档、拼写、测试补充、非业务 UI 微调；不触及代码行为 | Claude Code 可自主合并 |
| **R1** | M0 原型页面/可逆前端逻辑、mock 数据、非敏感功能；**不触及受保护路径** | Claude Code 可自主合并 |
| **R2** | 数据库迁移、公共 API、packages/contracts Schema、Auth、Tenant、Policy、Approval 链、数据导出逻辑、AI Tool 注册、外部发送/发布代码路径、OSS 升生产依赖、许可证变化、CLAUDE.md/母本/ADR | **必须人工批准合并** |
| **R3** | 生产部署、真实发信/发布、数据供应商生产接入、权限策略变更、Kill Switch 变更 | **必须人工批准**；Claude Code 不得执行最终发布 |

分级判定：取 PR 内**最高风险文件**的级别；拿不准时升一级；PR 描述必须标注 Risk Level。

## Claude Code 自主合并判定协议（R0/R1）

全部满足才可合并，任何一条不满足即停止并报告：

```text
[ ] 分级正确：diff 不含 R2/R3 路径（contracts/、migrations、policy、*.state.ts、CLAUDE.md、.github/workflows、auth/tenant 代码）
[ ] PR 非 Draft；无未解决 review thread；与 main 无冲突（mergeStateStatus 可合并）
[ ] Required Checks 全绿：gh pr view --json statusCheckRollup 完整读取（禁止截断），全部 conclusion=SUCCESS
[ ] PR 描述完整：Epic/需求 ID/风险/测试/回滚（模板必填项无缺）
[ ] 本地验证已在 PR 内记录（typecheck/build/format/契约按需）
[ ] 审查证据落盘：/code-review 结论写入 PR（评论或描述），不得只存在会话里；
    Codex 行级评论逐条核实并在 PR 内回复（已修复 commit / 不采纳+理由 / 延后+登记）
[ ] 无未登记的产品假设（对照 OPEN_DECISIONS：不涉及未关闭决策）
[ ] 合并方式 squash；合并后 60s 内确认 main CI run=success，失败立即 revert 或修复，不留红 main
[ ] 合并后更新 ROADMAP 状态与 TRACEABILITY_MATRIX
```

**Merged ≠ Accepted**：合并只表示进入 main；业务验收在 Gate（用户测试/Validation Report）完成后才算 Accepted。

## PR 状态流程

```text
Issue/任务就绪 → 分支 → （尽早）Draft PR → 实施计划 → 开发 → 自检
→ CI → Code Review（/code-review）→ 触及权限/租户/数据时 /security-review
→ Ready → 按 R 级合并 → main 验证 → Preview 验证 → 更新 ROADMAP/Traceability
```

## PR 边界

一个 PR 一个清晰问题；≤500-800 行人工代码（自动生成 Schema 例外，**超限必须在 PR 描述解释原因与审查分段方式**）；不混无关重构；含测试与文档更新；有回滚方式。分支命名：`feat/<epic>-<feature>`、`fix/`、`spike/`、`docs/`、`chore/`。Commit 用 Conventional Commits。

## 治理决策记录（GDR，Governance Decision Record——工程流程决策，与产品 PDR 分开编号）

| 编号 | 决策 | 批准 |
|---|---|---|
| GDR-001 | **正式文档 PR 审查机制**：专项 Agent 评审团（架构/治理/安全等按需组建）出具分级报告（APPROVE / APPROVE_WITH_CHANGES / REQUEST_CHANGES；BLOCKER/MAJOR/MINOR/NOTE）→ Claude Code 修订并把结论落盘 PR → CI 验证 → **业务负责人最终批准；Agent 通过不构成合并授权**。BLOCKER 与 MAJOR 必须修复或登记阻塞后才可提请批准。代码类 PR 另需 Codex 独立审查（内部子 Agent 不替代外部独立审查）。**适用范围**：治理规则/决策/计划类变更（CHANGE_CONTROL、PROGRAM_CHARTER、RELEASE_GATES、OPEN_DECISIONS、DECISION_LEDGER、docs/decisions/**、启动计划类文档）按本机制走 R2 级批准，R0「纯文档自主合并」对其**不适用**；纯状态跟踪更新（ROADMAP 状态行、TRACEABILITY_MATRIX、合并后状态同步）仍属 R0。 | 业务负责人 2026-07-04 |
| GDR-002 | **Foundation 运行时启动门修订**：以「BE-01α（Foundation 包中不依赖 Spike 的段）经批准」取代「过 Gate 3」作为 Foundation 地基运行时（BE-02..05）编码启动门；BE-01β（Spike 依赖段）最晚 BE-04 前终审；纵向切片仍需 BE-01β。 | 业务负责人 2026-07-04（双轨计划批示） |
| GDR-003 | **合并授权委托**：业务负责人授权——完成规定检查（GDR-001 Agent 评审团、Codex 评论逐条处置、CI 全绿、本文件合并协议全项）后，Claude Code 可**自主合并 R0-R2 级 PR**（含治理文档与后端地基），无需逐一人工批准；**每次 R2 自主合并必须在 PR 内落盘检查证据**。**保留人工确认的红线不变**：R3（生产发布/真实对外发送）、对外发送/发布授权、数据权利与导出、跨境模型调用授权（Workspace 级授权的建立）、删除与 Suppression、OPEN DECISIONS 的关闭。任何一项检查不满足即停止并报告，不得降级合并。 | 业务负责人 2026-07-04（「你可以进行合并，但需检查后进行合并，不用我批准」） |

## Agent 分工（审查模型）

| 角色 | 承担者 | 职责 | 边界 |
|---|---|---|---|
| 实现 Agent | Claude Code | 规划、实现、测试、文档、响应审查意见 | 自查不得等同独立审查 |
| 独立代码审查 | Codex（GitHub App，自动触发） | 业务逻辑/边界条件/数据与状态一致性，行级评论 | 不改变产品决策；评论须逐条核实回复 |
| 确定性 Gate | GitHub Actions verify + main ruleset | format/lint/typecheck/build/test/contracts；PR 必经、必绿 | 绿灯范围以 CI 配置为准，不得口头扩大 |
| 业务负责人 | @mlhjyx | R2/R3 批准、Open Decisions、产品与架构冲突裁决 | 唯一可关闭决策的人 |
