<!-- 每个 PR 必须填写以下关联（CLAUDE.md 合并纪律 / 交付要求 #9）。缺项视为未就绪。 -->

## 变更概要

<!-- 一句话：这个 PR 解决哪一个清晰问题 -->

## 关联

- **Epic：** <EPIC-ID 或 M0-x 批次>
- **需求 ID：** <母本第 7 部分需求 ID，逗号分隔>
- **ROADMAP 状态变化：** <本 PR 使 ROADMAP 哪一行从什么变为什么>
- **关闭/推进的 Open Decision：** <OD-XX 或 无>

## 风险与安全

- **风险：** <本变更引入/触及的风险，关联 RISK-XXX；无则写 无>
- **多租户/数据权利/审批影响：** <是否触及 workspace_id/RLS/Policy/外部动作；M0 原型写"全模拟，无真实外部动作">
- **受保护路径：** <是否改动 contracts/policy/migrations/*.state.ts；改动则说明已 plan mode 批准>

## 测试与验证

- [ ] type-check 通过
- [ ] build 通过
- [ ] format:check 通过
- [ ] contracts:validate 通过（若触及契约）
- [ ] `/code-review` 已跑并处理
- [ ] `/security-review` 已跑（若触及权限/租户/数据）
- **测试说明：** <跑了什么、结果>
- **截图/录屏：** <UI 变更附 Preview 截图；无 UI 变更写"无 UI 变更">

## 回滚

<!-- 如何回滚：revert 本分支即可 / 有迁移需 down / 其他 -->

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
