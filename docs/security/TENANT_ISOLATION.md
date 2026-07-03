# Tenant Isolation（租户隔离）

- 一切业务表/索引/对象存储路径/缓存键/Trace 带 workspace_id；PG 启用 RLS 作纵深防御（ADR-001）
- 切换 Workspace 不泄漏缓存/搜索/任务上下文（WSP-004）
- 权限变更即时影响新请求；运行中高风险任务重新校验（母本 7.1.4）
- 隔离测试进 CI（testing/SECURITY_TEST_PLAN.md）；渗透测试 M2 前完成
