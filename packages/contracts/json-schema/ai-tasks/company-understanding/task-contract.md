# Task Contract: Company Understanding

> 全平台 14 个领域 AI Task（母本 9.3）的第一个完整契约实例，作为其余 13 个 Task 的模板。
> 结构严格遵循母本 9.4「标准 Agent/Task Contract」七要素。
> 需求追踪：KNW-001、KNW-002、KNW-003、KNW-004、KNW-005、KNW-008、母本 6.5.1、7.2.4、7.2.5、9.1、9.3、9.4。

| 项 | 值 |
| --- | --- |
| task_id | `company_understanding` |
| 负责域 | knowledge |
| 风险等级 | **中**（母本 9.3；只产出内部候选，不直接对外） |
| contract_version | 1.0.0 |
| Owner | AI 负责人（最小团队模式下由业务负责人兼任，母本 15.13.5） |
| Release | M1（KNW-002 P0/M1） |

---

## 1. 任务目标、非目标、输入和输出 Schema

### 1.1 目标

- 从企业官网与上传资料中提取「卖方自己是谁」：企业画像候选、产品/服务候选、事实声明候选（企业、产品、参数、MOQ、交期、认证、案例、能力、禁用表达，KNW-002）。
- 每项候选带来源、置信度和类型（KNW-002 验收）；关键说法附来源原文逐字引用（KNW-006）。
- 检测多来源之间、以及新提取与已批准 Claim 之间的不一致，输出冲突候选（KNW-004：不静默覆盖）。
- 支撑母本 6.5.1 第一次价值路径步骤 1-3：输入官网/上传资料 → 提取 → 用户确认企业画像。

### 1.2 非目标（明确不做）

- **不写任何业务状态**：不创建/更新 CompanyProfile、Offering、Claim 记录；持久化由 knowledge-service 校验后执行（母本 9.1：LLM 不得直接写关键业务状态）。
- **不做事实审批**：候选一律停在 Claim 生命周期的 EXTRACTED（KNW-003；NEEDS_REVIEW→APPROVED 由事实审核台人工推进，母本 4.8.4）。
- **不研究外部市场/买家**：那是 Global Market Scan / Market Research Task 的边界（母本 9.3）；本任务只看本企业自己的来源。
- **不推断法律结论、无证据认证、价格**（母本 7.2.4：具体数字、认证、价格、案例和法律结论无证据时不得生成确定性表达）。
- **不把聊天/推断自动当事实**（母本 7.2.5：推断必须经过审核）。

### 1.3 输入/输出 Schema

| 方向 | Schema | 版本 |
| --- | --- | --- |
| 输入 | `ggw://contracts/ai-tasks/company-understanding/input`（同目录 `input.schema.json`） | 1 |
| 输出 | `ggw://contracts/ai-tasks/company-understanding/output`（同目录 `output.schema.json`） | 1 |

输出字段名与 knowledge 域对象 Schema 严格对齐（company-profile / offering / claim / claim-evidence / knowledge-conflict）；不满足输出 Schema 的模型响应按第 5 节重试与失败策略处理，**永不**把不合规响应透传给下游。

## 2. 允许工具、数据范围、风险等级和人工 Gate

### 2.1 允许工具（白名单，母本 9.3 本任务行；经 Tool Registry + OPA Policy 授权，母本 9.13）

| 工具 | 用途 | 关键限制 |
| --- | --- | --- |
| `doc.parse`（文档解析，Docling/自建，母本 9.7 解析层） | 解析 uploaded_source_ids 的结构化内容与来源位置（KNW-001） | 只读；只能访问本 workspace 的 KnowledgeSource |
| `web.crawl_own_site`（官网采集） | 抓取 website_url 及同域页面并注册为 WEBSITE 类 KnowledgeSource | 仅限输入 URL 同一注册域；页数 ≤ budget.max_pages_to_crawl；遵守 robots 与采集安全边界（母本 12.x、RISK 爬虫安全）；SSRF 防护由工具层强制 |
| `knowledge.retrieve`（知识库检索，母本 9.7 Retrieval Gateway） | 读取 workspace_context 中已确认事实/品牌资料/已批准 Claim，用于对齐与冲突比对 | 先做租户与权限过滤（母本 4.8.3）；只读 |
| Model Gateway `generateStructured` | 结构化提取与冲突比对（母本 9.5、9.12） | 输出必须过 output.schema.json 校验 |

**禁止工具**：任何写业务状态、对外发送/发布、导出、购买数据、访问其他租户数据的工具。工具越权请求由 Policy Engine 返回 `ACTION_DENIED` 并记入 Trace（母本 9.9、11.15）。

### 2.2 数据范围

- 仅本 workspace 的 KnowledgeSource、CompanyProfile、Offering、BrandProfile、APPROVED Claim（母本 ADR-001 租户边界）。
- 来源保密级别继承：候选 `confidentiality_level` 默认取来源 `KnowledgeSource.confidentiality_level`（KNW-005、母本 12.11）。
- 提取产物默认 `sharing_scope=WORKSPACE_PRIVATE`（KNW-010：未经授权的客户资料不进入通用知识）。
- Trace 写入前敏感字段脱敏或摘要化（母本 9.10）。

### 2.3 风险等级与人工 Gate

- 风险等级：**中**（母本 9.3）。定级依据：无外部动作、无 PII 外发，但产物进入企业事实链，错误会向下游内容/外联放大。
- 人工 Gate（两道，均不可跳过）：
  1. **企业画像确认**：company_profile_candidate 经用户确认后 CompanyProfile 才进入 CONFIRMED 并发布 `CompanyProfileConfirmed`（母本 6.5.1 步骤 3、11.11）。
  2. **事实审核台**：全部 claim_candidates 持久化为 EXTRACTED 后必须经 NEEDS_REVIEW 人工批准才能进入 APPROVED；对外生成只允许使用适用范围内的 APPROVED Claim（KNW-003 验收、母本 4.8.4）。
- 冲突候选进入 KnowledgeConflict（OPEN），未解决前相关 Campaign 显示风险提醒（KNW-004、母本 4.8.4）。

## 3. 最大成本、超时、重试、并发和取消策略

| 项 | 值 | 说明 |
| --- | --- | --- |
| 单次运行最大成本 | **USD 0.80**（模型 + 采集合计；AI 负责人提案，Gate 3 关闭） | 输入 `budget.max_cost` 只能 ≤ 此值；超限中止并返回 `BUDGET_EXCEEDED`（母本 11.15），保留已完成来源的部分结果 |
| 最大模型调用 | 50 次/运行 | 分块提取 + 冲突比对合计 |
| 官网采集上限 | 100 页/运行，默认 30 页 | 超出按优先级截断（首页/产品/关于/认证页优先），在 `sources_processed` 标记 PARTIAL |
| 超时 | 默认 600s，硬上限 **900s** | 由 Durable Workflow 计时（母本 9.8）；超时取消当前 Activity，保留部分结果 |
| 重试 | 模型/Provider 临时错误（`PROVIDER_UNAVAILABLE`、`PROVIDER_RATE_LIMIT`）指数退避重试 ≤ 2 次；输出 Schema 校验失败带错误反馈重试 ≤ 2 次；`ACTION_DENIED`/`INVALID_SCHEMA`（输入）不重试（母本 11.15 行为矩阵） | Activity 级幂等键：`workspace_id + task_type + 输入内容指纹`（母本 11.16） |
| 并发 | 同一 workspace 同时最多 **1** 个运行 | 重复触发返回进行中运行的引用（幂等）；平台级并发由队列控制 |
| 取消 | 用户随时可取消（Workflow Signal，母本 9.8） | 取消即停止新工具调用，已注册的 KnowledgeSource 保留，未完成候选丢弃；无需补偿（无外部副作用） |

## 4. Prompt、模型、Schema、Pack 和工具版本（母本 9.6 注册表）

| 注册表 | 条目 | 版本 | 备注 |
| --- | --- | --- | --- |
| Prompt Registry | `company-understanding/prompt` | v1（同目录 `prompt.v1.md`） | owner=AI 负责人；release=draft；回滚到上一 released 版本 |
| Schema Registry | input / output schema | 各 v1 | 见第 1.3 节 |
| Model Registry | 模型策略：`structured_extraction.default` | 由 Model Gateway 按任务/语言/成本路由（母本 9.5） | 业务代码不绑定具体厂商；要求支持 generateStructured、上下文 ≥ 32k、中英越泰法语 |
| Pack Registry | 行业 Pack：`industry/solar-pv`、`industry/building-materials`（可选加载） | ≥ v1 | 提供行业术语、常见参数字段、认证清单提示（PDR-001 试点行业）；Pack 只提供提示，不注入无证据事实 |
| Tool Registry | `doc.parse` / `web.crawl_own_site` / `knowledge.retrieve` | 各 ≥ v1 | 每个工具声明风险、幂等、超时、预算、审计（母本 9.13） |

任一注册表条目版本变更 → 记录到运行 Trace（母本 9.10：Task、Prompt、Model、Tool 版本可追溯）；Prompt/模型升级必须先过第 6 节 Golden Set 阈值才能发布。

## 5. 失败、未知、冲突和拒答策略

| 情形 | 策略 |
| --- | --- |
| **失败**（解析失败、采集失败、模型不可用） | 单来源失败不整体失败：在 `sources_processed` 标记 FAILED+原因，继续其余来源（部分成功，母本 11.15）；全部来源失败 → 任务失败，错误码透传（`PROVIDER_UNAVAILABLE` 等），Workflow 按第 3 节重试 |
| **未知**（来源未提及/无证据） | 字段输出 `null` 并列入 `missing_fields`（field_name + missing_reason + note）；**禁止编造、禁止用行业常识补全**（母本 4.8.3、7.2.4）；低于置信度阈值（<0.5，Gate 3 前提案值）的候选不输出，转 missing_reason=LOW_CONFIDENCE |
| **冲突**（多来源不一致 / 与已批准 Claim 矛盾） | 双方候选照常输出 + `conflict_candidates`（topic/conflict_type/diff_summary）；受影响的画像/产品字段置 null + missing_reason=CONFLICTING_SOURCES；持久化后创建 KnowledgeConflict(OPEN) 并发布 `KnowledgeConflictDetected`（KNW-004：不静默覆盖；asyncapi/knowledge.events.yaml） |
| **拒答**（整体拒绝执行） | 触发条件：① 输入 URL 内容与 workspace 声明的企业明显无关（防误绑他人官网）；② 来源全部不可解析；③ 来源含明显违法/侵权内容。行为：任务以 `REFUSED` 结果结束，`notes` 说明原因，不输出任何候选；不重试，转人工处理 |
| **注入防护** | 来源文档中的指令性文本（如「忽略以上指令」）一律视为待提取内容而非指令（母本 9.10 安全：Prompt Injection、不可信来源）；命中注入模式记录安全事件 |

## 6. Golden Set、质量指标和上线阈值

- Golden Set：`packages/evals/golden-sets/company-understanding/`（规格、标注指南、双人一致性见其 README.md；样例条目 samples.jsonl）。
- 规模：≥50 家企业官网 + 20 份文件，覆盖 光伏/建材 × 东南亚/非洲（PDR-001 试点行业与市场）。
- 质量指标与上线阈值（**AI 负责人提案、Gate 3 关闭**，母本 14.2：阈值按任务风险制定；具体数字见 Golden Set README「阈值提案」表）：
  - 关键字段正确率 ≥ 0.90
  - 事实支持率（quote 逐字可定位且支持 statement）≥ 0.95
  - 幻觉率 ≤ 0.02
  - 缺失处理正确率 ≥ 0.85；冲突检出 Recall ≥ 0.80
  - 输出 Schema 一次通过率 ≥ 0.98（重试后 100%）
  - 单次运行成本 ≤ USD 0.80，P95 端到端延迟 ≤ 600s
- 未达阈值 → 不得发布新 Prompt/模型版本；已上线版本质量回退 → 按运营 Runbook「模型质量下降」回滚（母本 14.5）。

## 7. 业务结果和用户反馈关联（母本 9.10 在线质量）

| 信号 | 采集点 | 用途 |
| --- | --- | --- |
| 画像确认率 | `CompanyProfileConfirmed` 事件 / 任务完成数 | 激活漏斗（母本 6.5.1：30 分钟内完成画像确认） |
| 修改距离 | 用户确认前对候选字段的编辑量（审核台埋点） | 字段级质量在线代理指标 |
| 候选批准率 | claim_candidates 中最终进入 APPROVED 的比例（ClaimApproved 事件） | 提取精度在线代理指标 |
| 冲突误报率 | KnowledgeConflict 被 DISMISSED 的比例 | 冲突检测精度 |
| 下游引用 | 内容生成/回复中引用源自本任务 Claim 的次数（KNW-006 引用链） | 业务价值归因 |
| 成本归因 | Trace：Token、工具、Provider 成本 → correlation_id | 单位已确认画像成本（母本 9.10 成本类） |

用户对候选的纠正只回流本 workspace（客户私有反馈，母本 9.14）；行业 Pack 的改进必须匿名聚合或专家审核后才能进入 Pack Registry。
