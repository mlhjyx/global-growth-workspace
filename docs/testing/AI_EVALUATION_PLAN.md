# AI Evaluation Plan

权威：母本 9.10/14.2 + packages/evals（Registry：15 Task）。规则：

- 新增 AI Task 必须同 PR 交付 Task Contract + Prompt + Schema + Golden Set + 上线阈值（skill 化脚手架待建）
- 阈值按任务风险分别定（不用统一准确率）；高风险输出（Reply Draft/Expert Routing）另加人工 Gate 测试
- 在线质量：采用率、修改距离、Lead 接受率与业务 Outcome 经 correlation_id 关联（母本 10.10.3）
- Trace 脱敏后入 Langfuse（M1 W1 接入后启用数据集管理）
