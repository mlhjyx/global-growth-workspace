# Program Charter（项目宪章）

## 产品目标

面向中国出海企业的 AI 全球获客与增长执行平台（Global Growth Workspace）。北极星：每个活跃 Workspace 每月新增 SAO 数量及单位成本。唯一产品事实源：**母本 v2.1**（docs/出海企业AI增长平台_总产品手册与PRD_v2.1_母本.md）。

## 事实源优先级（冲突处理顺序，写死）

```text
1. Product Baseline v2.1
2. Approved PDR / ADR（docs/program/DECISION_LEDGER.md、docs/architecture/adr/）
3. Epic Dev-Ready Package（docs/epics/）
4. 机器契约（packages/contracts：OpenAPI/AsyncAPI/JSON Schema/状态机）
5. Issue / Task Package
6. 代码与测试
7. 聊天记录和临时说明 —— 不得静默改变产品
```

发现冲突：停止相关实现 → 登记冲突（Open Decision 或 PDR/ADR 草案）→ 等待决策或在允许范围内继续其他工作。**不得自行选择偏好解释。**

## 当前阶段与成功标准

- 阶段：M0 原型开发（全模拟）。M0 完成标准见 [RELEASE_GATES.md](RELEASE_GATES.md)（两旅程可操作 + Preview + 用户测试 + Gate 1 + Validation Report，非 PR 数量）。
- 不做项：母本 1.6 战略非目标；M0 不接真实外部执行/开源运行时。

## 角色与权限

| 角色 | 承担者 | 职责 |
|---|---|---|
| 业务负责人 / 产品 Owner / 最终审批 | 用户（mlhjyx） | Open Decisions 拍板、R2/R3 合并批准、Gate 通过判定、发布授权 |
| 开发执行 / 架构 / 测试 / 文档 | Claude Code | 按本宪章与 CHANGE_CONTROL 在授权边界内执行 |

**Claude Code 权限边界**（母本 15.13.5 + CHANGE_CONTROL R 分级）：
- 可自主：函数实现、局部重构、测试组织、R0/R1 合并（按判定协议）、文档与追踪更新
- 不可自主：改产品定位/领域所有权/基础设施/数据库/工作流引擎/核心依赖/公共 API/租户隔离/数据授权规则；绕过 Policy/Approval；开源候选升生产；R2/R3 合并；生产发布；真实外部动作（发送/发布/采购数据）

## 发布权限

生产部署、真实发信/发布、数据供应商生产接入 = R3，仅业务负责人可批准。M0 Preview 部署 = R1。
