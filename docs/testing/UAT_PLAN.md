# UAT Plan（M0 Gate 1 用户测试）

- 对象：光伏/建材试点画像用户（PDR-001）
- 材料：M0 原型 Preview（<https://mlhjyx.github.io/global-growth-workspace/>）+ J-A/J-B 任务脚本
- 方式：任务式测试——无培训完成「从目标到机会」关键步骤；记录任务完成率、术语理解、错误恢复、审批理解（母本 14.1 Usability）
- 产出：M0 Validation Report（RELEASE_GATES 的 M0 完成标准项）

**执行件（EPIC-M0-06 T4）**：

- 任务脚本 + 数据采集表 + 判定阈值：[UAT_SCRIPTS_M0.md](UAT_SCRIPTS_M0.md)
- 报告模板 + Gate 1 判定：[GATE1_REPORT_TEMPLATE.md](GATE1_REPORT_TEMPLATE.md)
- 埋点：原型「洞察 → Gate 1 验证埋点」条（重置采集 / 导出 JSON），事件定义见 `apps/prototype/src/analytics/analytics.ts`
