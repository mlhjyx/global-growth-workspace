# 交付治理体系索引

母本 v2.1 是产品与架构总母本，但不是唯一研发交付物。本目录承载**跨 Epic 的项目治理**，随开发滚动维护。单一事实源原则：每类信息只有一个权威文件，其他位置引用不重复。

## 治理文件（第 1 类：项目治理）

| 文件 | 作用 | 权威来源 |
|---|---|---|
| [ROADMAP.md](../plan/ROADMAP.md) | Release × Wave × Epic 拆分与当前状态 | 本文件 |
| [DECISION_LEDGER.md](DECISION_LEDGER.md) | 已锁定决策与被取代结论 | 母本附录 A + 本文件增量 |
| [OPEN_DECISIONS.md](OPEN_DECISIONS.md) | 未关闭业务决策（命中即停，禁止假设） | 本文件（母本 15.12 的活跃跟踪版） |
| [RISK_REGISTER.md](RISK_REGISTER.md) | 风险登记与缓解 | 本文件（母本 15.9 RISK-001~012 + 新增） |
| [DEPENDENCY_MAP.md](DEPENDENCY_MAP.md) | 外部/开源/Provider 依赖与替换 | 本文件 |
| [RELEASE_GATES.md](RELEASE_GATES.md) | Gate 0-5 通过条件与当前状态 | 本文件（母本 13.10/15.4） |
| [TRACEABILITY_MATRIX.md](TRACEABILITY_MATRIX.md) | Epic→需求 ID→页面→事件→ADR→PR | 本文件 |

## 交付包（其余类别，随对应阶段填充）

| 目录 | 内容 | 状态 |
|---|---|---|
| [docs/prd/epics/](../prd/epics/) | 每个 Epic 编码前的 Dev-Ready Package（模板 `_TEMPLATE.md`） | 骨架已立，按 Epic 填充 |
| [docs/oss/](../oss/) | 开源项目交付卡（Assessment→Exit Plan，9 段） | 骨架+索引已立，Spike 属 M1 |
| [docs/data-platform/](../data-platform/) | Data Platform 交付包（Catalog→Provider Contract Tests） | 骨架已立，实现属 M1 W2 |
| [packages/evals/](../../packages/evals/) | AI Task Registry + Golden Set | Company Understanding 已打样，其余随 Task 填充 |
| [docs/architecture/adr/](../architecture/adr/) | ADR（母本 11.6 + 工程落地 ADR-100~） | 基线已立 |

## 12 项交付要求的落位追踪

| # | 要求 | 落位 | 状态 |
|---|---|---|---|
| 1 | 项目治理 7 件套 | docs/governance/ | ✅ 骨架已立 |
| 2 | 每 Epic Dev-Ready Package | docs/prd/epics/_TEMPLATE.md | ✅ 模板已立，M1 Foundation 首个 |
| 3 | M0-A 安全合并 + main 验证 | PR #1 MERGED，main CI success 752e499 | ✅ 完成 |
| 4 | M0-B Governance Components PR | 本分支 feat/m0-batch2-governance | 🔄 进行中 |
| 5 | Architecture De-risking Track 并行启动 | docs/oss/ + RELEASE_GATES | 🔄 文档骨架已立；Spike 需真跑=M1 |
| 6 | 每个开源项目 9 段交付 | docs/oss/_TEMPLATE.md + registry | ✅ 模板+索引已立 |
| 7 | Data Platform 交付包 | docs/data-platform/ | ✅ 骨架已立；实现=M1 W2 |
| 8 | AI Task Registry + Golden Set | packages/evals/ | 🔄 1/14 已打样，registry 索引已立 |
| 9 | PR 关联规范 | .github/pull_request_template.md | ✅ 强制模板已立 |
| 10 | 未明确决策入 OPEN_DECISIONS | OPEN_DECISIONS.md | ✅ 已立，禁止自行假设 |
| 11 | M0 完成标准（非四 PR） | RELEASE_GATES.md Gate 1 | ✅ 已定义 |
| 12 | M1 前交 Foundation Dev-Ready Package | docs/prd/epics/EPIC-FOUNDATION.md | ⬜ M1 前置，未开始 |

**诚实边界**：标「文档骨架已立」的项，其可执行结果（Spike Result、Production Gate、真实 Provider 选型、运行时实现）依赖 M1 真实环境，不能由文档代替。ROADMAP 当前状态块是唯一进度真相。
