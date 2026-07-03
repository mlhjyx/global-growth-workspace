# @ggw/evals

领域 AI Task 的 Golden Set 与评估器（母本 9.10、14.2）。

## 原则

- 每个 AI Task 交付时必须同时提交 Golden Set（母本 9.4 契约必备项）。
- **上线阈值按任务风险制定，不用一个统一「准确率」**（母本 14.2）。
- 覆盖：字段正确率、事实支持率、检索 Recall、分类 F1、工具选择、越权、本地化、成本（母本 7.10 离线质量）。
- Golden Set 版本化；敏感数据脱敏后入库（母本 10.10 Langfuse 数据治理）。

## 首个打样（阶段 1）

`Company Understanding`（企业画像提取，母本 9.3 → KNW-002）：≥50 家企业官网 + 20 份文件，标注关键字段正确率、事实支持率、幻觉率上限；作为其余 Task 的模板。

## AI Task Registry（母本 9.3，共 14 + 1 补充）

**不得只实现一个 Task**，但每个 Task 随其所属 Epic 逐个完整实例化（一次性全做会产生无对应功能的空壳）。当前 1/15 打样。

| AIT | Task | 支撑需求 | 状态 |
|---|---|---|---|
| AIT-01 | Company Understanding | KNW-002 | ✅ 打样 |
| AIT-02 | Global Market Scan | MKT-001 | ⬜ M1 W2 |
| AIT-03 | Market Research | MKT-003~010 | ⬜ M1 W2 |
| AIT-04 | ICP Design | LED-001 | ⬜ M1 W3 |
| AIT-05 | Lead Research | LED-012 | ⬜ M1 W3 |
| AIT-06 | Lead Qualification | LED-006/007 | ⬜ M1 W3 |
| AIT-07 | Campaign Planning | CAM-001 | ⬜ M1 W3 |
| AIT-08 | Content Strategy | CRT-001 | ⬜ M1 W4 |
| AIT-09 | Content Generation | CRT-002/004 | ⬜ M1 W4 |
| AIT-10 | Content QC / Fact Verification（评审补） | CRT-005 | ⬜ M1 W4 |
| AIT-11 | Video Planning | CRT-007 | ⬜ M1 W4 |
| AIT-12 | Engagement Triage | ENG-003/004 | ⬜ M1 W5 |
| AIT-13 | Reply Draft | ENG-005 | ⬜ M1 W5 |
| AIT-14 | Growth Analyst | ANA-008 | ⬜ M1 W5 |
| AIT-15 | Expert Routing | EXP-002/003 | ⬜ M1 W5 |

每个 Task 必备产物（母本 9.4）：输入/输出 Schema、Prompt（版本化）、允许工具、检索范围、成本/超时、Fallback、拒答策略、人工 Gate、Golden Set、评估指标、上线阈值。
