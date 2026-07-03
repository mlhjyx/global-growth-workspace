# Secret Management

- 仓库零 Secret：guard hook 阻断 .env/密钥写入；CI secret-scan（待办，见 GITHUB_CONFIGURATION_CHECKLIST）
- 运行时：KMS/Envelope Encryption（ADR-015）；Provider Key 由 INT-001 统一管理，加密存储不回显
- BYOK：客户自带 Key 与平台 Key 隔离计量（母本 10.9.2）
- 高风险操作（导出/删除/Provider Key/策略变更）要求增强认证（母本 12.2）
