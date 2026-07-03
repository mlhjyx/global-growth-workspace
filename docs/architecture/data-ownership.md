# Data Ownership（数据所有权）

权威：母本 11.3/10.3.2、D-011、11.19。硬规则：

- **新平台（PostgreSQL）拥有**：Workspace、Company、Market、ICP、Lead、Campaign、Approval、Opportunity、Attribution、Data Rights、Pack、Expert、Claim/Evidence。
- **AiToEarn（MongoDB，其边界内）**：内容草稿、媒体任务、渠道账号、发布/互动执行记录；通过 ExternalExecutionId + Adapter + 领域事件映射，**不得直写新平台表、不得绕过 Policy**。
- **Cognee/Graphiti（若过 Bake-off）**：仅检索/关系/记忆辅助层，不拥有事实（ADR-004/D-013）。
- **搜索/向量/缓存/Trace**：投影非真相源（ADR-003/016）；删除编排必须覆盖（母本 11.17）。
- 媒体资产同步平台对象存储，不允许只存在执行内核内部目录（母本 10.3.5）。
