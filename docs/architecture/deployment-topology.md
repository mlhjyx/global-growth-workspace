# Deployment Topology（部署拓扑）

权威：母本 11.4 + ADR-010（区域分级）。当前状态（诚实）：

- **M0**：无部署基础设施；仅需 Preview（原型静态托管即可，M0 完成标准项）
- **M1**：单区域；docker-compose（PG+Redis）→ 云化：Web/API + Growth Core + Temporal + 私有 Worker 子网（AI/Crawler/Media/Integration 隔离），Egress Allowlist
- **M3**：多可用区、读副本、跨区备份、专属租户选项
- 中国/海外数据区域按数据分类路由（ADR-010，实际云区域上线前关闭）

实际拓扑图与 IaC 属 EPIC-FOUNDATION 交付物。
