# Security Test Plan（M1 生效，CI 逐步纳入）

- 租户隔离：跨 workspace 读写/检索/缓存污染自动化用例（每域必测，ADR-001）
- SSRF/爬虫隔离：内网/云元数据/file 协议阻断（ADR-013）
- Prompt Injection：不可信外部内容不得改变工具行为（母本 12.4/12.12）
- 权限：导出/完整邮箱/跨境模型调用的 RBAC+ABAC+Policy 拒绝路径
- Secret：扫描入 CI；Webhook 验签与重放（ADR-014）
- 母本 12.12 安全验收场景逐条转为测试用例
