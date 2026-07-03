# Golden Set: Company Understanding

> Company Understanding AI Task 的离线评估数据集规格（母本 9.4「Golden Set、质量指标和上线阈值」、9.14、14.2；需求 KNW-002）。
> 本目录是全平台 14 个 AI Task Golden Set 的第一个实例与模板。

| 项 | 值 |
| --- | --- |
| 对应 Task Contract | `packages/contracts/json-schema/ai-tasks/company-understanding/task-contract.md` |
| 评估对象 Schema | `ggw://contracts/ai-tasks/company-understanding/output` v1 |
| Owner | AI 负责人 |
| 状态 | 规格 v1（数据收集中）；阈值为提案值，**Gate 3 关闭**（母本 15.4.4） |

## 1. 数据集规格（PDR-001 试点行业 × 市场）

规模下限（母本 14.2：企业/产品抽取用真实文件和官网样本）：

- **≥ 50 家企业官网**（每家 5–30 个页面快照，抓取物固化入库，避免线上页面漂移导致评估不可复现）；
- **≥ 20 份上传文件**（产品册 PDF、公司介绍 PPTX、报价/参数表 XLSX、证书扫描件 IMAGE 至少各 3 份，覆盖 KNW-001 主要来源类型）。

覆盖矩阵（每格为企业官网数下限；行业 × 市场 = PDR-001 试点组合）：

| | 东南亚（VN/TH/PH/ID/MY） | 非洲（NG/KE/ZA/EG） |
| --- | --- | --- |
| 光伏（组件/逆变器/支架/储能） | ≥ 13 | ≥ 12 |
| 建材（地板/板材/卫浴/门窗/管材） | ≥ 13 | ≥ 12 |

强制包含的分层样本：

- **语言**：中文官网 ≥ 20、英文官网 ≥ 20、中英混合 ≥ 5；文件中含英文产品册 ≥ 5。
- **难样本 ≥ 10**：信息稀疏官网（单页站）、参数以图片呈现、认证仅有证书扫描件、官网与文件口径冲突（MOQ/交期/认证有效期至少各 2 例）。
- **负样本 ≥ 5**：与 workspace 声明企业无关的网站、纯目录站/占位站——期望整体拒答（REFUSED）或大面积 missing。
- **禁止推断样本 ≥ 5**：来源含模糊表述（如「即将通过认证」「价格面议」）——期望 null + FORBIDDEN_TO_INFER/NOT_FOUND_IN_SOURCES。

数据治理：样本一律脱敏（真实小企业需授权或做名称/联系方式替换，母本 9.10 敏感字段脱敏）；数据集版本化（`dataset_version`，语义化版本），阈值与版本绑定。

## 2. 目录结构

```
golden-sets/company-understanding/
  README.md          本规格
  samples.jsonl      样本索引与期望（每行一条，见第 5 节字段说明）
  inputs/            固化输入（input.schema.json 实例 + 来源快照/文件）
  expected/          字段级期望标注（output schema 的期望子集，每样本一个 JSON）
```

## 3. 标注指南

对每个样本，标注员依据固化来源独立产出 `expected/` 标注：

1. **画像字段**：逐字段给出期望值或 `null+missing_reason`；期望值必须能在来源中指出出处（页面/页码/单元格）。
2. **产品**：期望的 offering 列表（name/offering_type/category/specs/moq/lead_time/certifications）；同一产品多型号时按官网结构拆分。
3. **Claim**：期望的关键 Claim 清单（claim_type + 规范化 statement + 出处）；只标注对获客有业务价值的关键事实（认证、MOQ、交期、核心参数、产能、案例），不要求穷举。
4. **冲突**：来源不一致处标注期望的 conflict（topic/conflict_type/涉及来源）。
5. **判定规则**：
   - 字段正确 = 与期望值语义等价（单位换算等价算对；数字/枚举必须精确）；
   - 事实支持 = 输出的 quote 能在来源中**逐字定位**且确实支持 statement；
   - 幻觉 = 输出了期望标注中不存在、且来源中找不到依据的字段值或 Claim；
   - 缺失处理正确 = 期望 null 的字段输出了 null 且 missing_reason 类别一致。

## 4. 双人一致性要求

- 每个样本由 **2 名标注员独立标注**（primary/secondary），不得互相查看。
- 一致性度量：字段级简单一致率 ≥ **0.85** 且 Cohen's κ ≥ **0.75**（在 claim_type 分类与 missing_reason 分类上分别计算）。
- 不达标 → 修订本指南的判定规则后重标该批次。
- 分歧样本由 AI 负责人仲裁（adjudicator），仲裁结论回写 `expected/` 并在 samples.jsonl 标记 `status=ADJUDICATED`。
- 样本状态机：`DRAFT → DUAL_ANNOTATED → ADJUDICATED → APPROVED`（APPROVED 后进入评估基线）。

## 5. samples.jsonl 字段

每行一个 JSON 对象：`sample_id`、`dataset_version`、`industry`（SOLAR_PV|BUILDING_MATERIALS）、`target_market`（ISO 3166-1 alpha-2）、`sample_kind`（STANDARD|HARD|NEGATIVE|NO_INFERENCE）、`source_mix`（来源类型列表）、`input_ref`（inputs/ 相对路径）、`expected_ref`（expected/ 相对路径）、`expected_fields`（关键期望摘要，便于快速核对）、`expected_missing`、`expected_conflicts`、`annotator`（primary/secondary/adjudicator）、`agreement`（双人一致率，未标注为 null）、`status`。

## 6. 阈值提案（AI 负责人提案、Gate 3 关闭）

上线阈值按任务风险（中）制定，不用统一「准确率」（母本 14.2）。以下数字为 **AI 负责人提案值**，在 Gate 3（Development Ready，母本 15.4.4）评审关闭后生效；生效前任何 Prompt/模型版本不得以「达标」名义发布。

| 指标 | 定义 | 阈值（提案） |
| --- | --- | --- |
| 关键字段正确率 | legal_name、hq_country、industries、founded_year、offering.name、moq、lead_time、certifications 与期望语义等价的比例 | ≥ **0.90** |
| 事实支持率 | claim_candidates 中 quote 可逐字定位且支持 statement 的比例（KNW-006） | ≥ **0.95** |
| 幻觉率（上限） | 无来源依据的字段值/Claim 占全部输出候选的比例（RISK-003） | ≤ **0.02** |
| 缺失处理正确率 | 期望 null 的字段输出 null 且 missing_reason 类别一致的比例（母本 4.8.3） | ≥ **0.85** |
| 冲突检出 Recall | 期望冲突被 conflict_candidates 命中的比例（KNW-004） | ≥ **0.80** |
| 冲突误报率 | 输出冲突中不在期望冲突内的比例 | ≤ **0.20** |
| 拒答正确率 | 负样本正确 REFUSED / 非负样本不误拒 | ≥ **0.90** / 误拒 ≤ 0.05 |
| Schema 一次通过率 | 首次模型响应通过 output.schema.json 校验 | ≥ **0.98**（重试后 100%） |
| 成本 | 单样本运行成本 | ≤ **USD 0.80** |
| 延迟 | P95 端到端 | ≤ **600s** |

回归规则：Prompt/模型/Pack 任一版本变更必须在最新 APPROVED 基线上全量回归；任一指标越过阈值 → 阻断发布（母本 9.6 Prompt Registry release 流程、14.5「模型质量下降」Runbook）。
