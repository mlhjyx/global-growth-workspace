# Data Platform 交付包（交付要求 #7）

母本第 8 部分 Global Business Data Platform 的交付载体。**实现属 M1 W2**；本轮建立结构与契约骨架，真实 Provider 接入/采集依赖 OD-07 关闭与合同（V-006）。

## 交付项与状态

| 交付项 | 母本 | 载体 | 状态 |
|---|---|---|---|
| Data Source Catalog | 8.4 | data-source-catalog.md | ⬜ 待 OD-07 |
| Rights Matrix（字段级权利） | 8.10/9.2 | packages/contracts/common/field-evidence.schema.json | ✅ 契约已建 |
| Raw / Normalized / Canonical 分层 | 8.3/8.7 | packages/contracts/json-schema/lead（canonical company/contact） | 🔄 Canonical 部分已建 |
| Identity Resolution | 8.8 | 规则文档 + 契约 | ⬜ M1 |
| Evidence | 8.10 | field-evidence（已建） | ✅ |
| Data Quality | 8.14 | quality 规则 | ⬜ M1 |
| Refresh / Expiry | 8.15 | field-evidence.expires_at + 刷新 workflow | 🔄 字段已建 |
| Deletion（可追溯删除） | 8.15/9.11 | 删除编排 workflow | ⬜ M1（Temporal） |
| Cost Ledger | 8.19 | DataCostLedger schema | ⬜ M1 |
| Provider Router | 8.13 | DataSourceRouter | ⬜ M1 |
| Provider Contract Tests | 12.3 | packages/contracts/adapters-data 契约测试 | ⬜ M1 |

## 硬约束（母本 + CLAUDE.md）

- 展示/导出/AI/外联/多租户使用**分别**做 Policy Check（DAT-006）；已在 field-evidence 契约的五权利字段体现。
- M1/M2 不预购全量联系人库，按需 Just-in-time Enrichment（母本 2.2.5）。
- 公开采集只走批准来源 + SourcePolicy + 隔离 Fetcher（DAT-011/012，ADR-013）。
- 腾道仅竞品，不作 Provider（D-015）。
