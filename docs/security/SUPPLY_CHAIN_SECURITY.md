# Supply Chain Security

权威：母本 10.17/10.18。要求：

- CI：SBOM 生成、许可证扫描、依赖漏洞、容器扫描、恶意包检测（M1 逐步纳入；dependabot 已启用）
- 镜像签名 + 可信 Registry；OSS 锁定版本/Commit；升级先过 Compatibility 环境 + 契约测试
- Fork 仅在必要且有长期 Owner 时；Patch 与 Upstream Diff 登记
- Exit Review 触发条件：许可证变化、停更、严重漏洞、商业冲突（见 DEPENDENCY_MAP）
