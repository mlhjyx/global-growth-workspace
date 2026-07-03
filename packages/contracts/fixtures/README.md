# Fixtures — P0 样例数据集

> **数据纯虚构声明：本目录所有公司、人名、邮箱、域名、证书编号、金额与贸易记录均为虚构演示数据，域名一律使用 `*.example.com`，与任何真实企业或个人无关，不得用于真实外联。**

## 用途

- **M0 原型 mock**：前端原型与 Demo 直接加载这些 JSON 作为接口 mock 数据。
- **测试 fixture**：契约测试、状态机测试与 `contracts:validate` 共用同一份数据（conventions.md：fixtures 符合 json-schema，供 M0 原型与测试共用）。
- **Schema 强校验**：每个条目带 `$schema_ref`（对应 Schema 的 `ggw://` `$id`），`npm run contracts:validate` 会按 Schema 逐条强校验；文件为扁平数组，条目类型由 `$schema_ref` 区分。

## 与 PDR-001 的关系

`docs/decisions/PDR-001-首批试点行业与目标市场.md` 决定首批试点：**行业 = 光伏能源、建材；区域 = 东南亚、非洲**。本数据集据此参数化：

| 维度 | 取值 |
| --- | --- |
| 样例租户 | 光伏企业「晶阳新能源」（Organization + Workspace + Owner/Marketer/Sales 三成员） |
| 样例公司 | 2 光伏（晶阳新能源=组件制造、苏源逆变=逆变器）+ 2 建材（恒基建材=石膏板材、泰岳管业=管材五金） |
| ICP | ICP-1 光伏→东南亚进口商/EPC（VN/TH/MY/PH/ID）；ICP-2 建材→非洲经销商（NG/KE/GH/TZ/EG） |
| Lead | 20 条：10 东南亚（光伏）+ 10 非洲（建材） |
| 旅程 | J-A 无历史数据主动获客（光伏×东南亚，DRAFT Campaign）；J-B 经销商招募（建材×非洲，RUNNING Campaign），对应母本 13.9 |
| 认证样例 | IEC 61215/61730/62109、TUV、SONCAP、KEBS、SGS 等（含 APPROVED / NEEDS_REVIEW / EXPIRED 状态，虚构证书编号） |

## 文件清单

| 文件 | 内容 | 主要 Schema |
| --- | --- | --- |
| `workspace.json` | 1 Organization + 1 Workspace + 3 Membership（OWNER/MARKETER/SALES） | workspace/* |
| `companies.json` | 6 KnowledgeSource + 4 CompanyProfile + 4 Offering + 26 Claim + 4 ClaimEvidence | knowledge/* |
| `icps.json` | 5 BuyingCommitteeRole + 2 ICPDefinition（均 ACTIVE，含回测记录；ICP-1 含一次未通过的回测演示 LED-004） | lead/* |
| `leads.json` | 20×（Account + Contact + Lead + LeadScore）+ 40 FieldEvidence（脚本生成，共 120 条） | lead/*、common/field-evidence |
| `campaign.json` | 1 RUNNING Campaign（J-B）含 Audience(FROZEN)/OutreachSequence/ExecutionAuthorization(ACTIVE)/2 StopCondition + 1 DRAFT Campaign（J-A） | campaign/* |
| `opportunities.json` | 7 Touchpoint + 3 Opportunity + 2 CommercialOutcome | opportunity/* |

## 演示要点（评审/Demo 可直接指认）

- **Lead 状态覆盖**：QUALIFIED×7、REVIEW×5、REJECTED×2（含硬性排除，`hard_exclusion_applied=true`、优先级归零，LED-003/007）、SUPPRESSED×2（退订 OPT_OUT 与数据主体删除权 WITHDRAWN，模型不可覆盖）、CONTACTED×1、CONVERTED×3（衔接 Opportunity）。
- **六维评分**：每条 Lead 一份 LeadScore，六维独立证据与时间（LED-006）；Intent 维度带 `expires_at` 演示信号过期降分（LED-014）。
- **FieldEvidence 数据权利差异**（母本 8.10 / DAT-005/006）：
  - 授权 B2B 联系人库（`lic_apex_b2b_2026`/`lic_afritrade_2026`）：可展示/可 AI/可外联，**不可导出、不可多租户**；
  - 公开网页抓取（`lic_public_web_tos`）：可导出、可多租户，**不可用于外联**；
  - 海关贸易数据（`lic_tradedata_2026`）：可 AI 分析，不可导出、不可外联；
  - Lead #19：`deletion_status=REVOKED` + 全部 allowed_* 为 false（删除权行使后的形态）。
- **Claim 生命周期**：APPROVED（带 `approved_by/approved_at` 与 ClaimEvidence 出处片段，KNW-006）、NEEDS_REVIEW（交期波动、合规结论待专家确认）、EXPIRED（过期认证阻止对外引用，KNW-009）；含 FORBIDDEN_EXPRESSION 禁用表达样例。
- **授权闭环**（CAM-008）：`auth_…0001` 固化 Audience 版本（`audience_version=3` + `snapshot_hash`）、模板指纹、频率上限、预算上限与阈值，`strategy_snapshot_hash` 与 Campaign 快照一致；DRAFT Campaign 的 `audience_ids`/`authorization_ids` 为空数组演示「进入 Review 前必须补全」。
- **三级结果模型**（ENG-016/017）：opp1 = SALES_ACCEPTED + PENDING MEETING outcome（7 天回写窗口，Temporal 工作流 ID 占位）；opp2 = VERIFIED MEETING outcome（`verified_by/verified_at`）；opp3 = WITHDRAWN（撤回原因回写 + 保留下一步回访）。
- **归因链**（7.10.4）：每个 Opportunity 可回溯 Campaign 与至少一个 Touchpoint；Touchpoint 带 Provider 外部事件 ID（Webhook 去重键素材，母本 11.16）。

## ID 与引用约定

- 所有实体 ID 为 `<prefix>_<26 位 Crockford Base32 ULID>`，本数据集用可读变体：`01JZ` + 4 位类型码 + 14 个 `0` + 4 位序号（如 `cam_01JZCAMP000000000000000001`），符合 `common/primitives` 的 `entity_id` 正则。
- 单一样例 Workspace：`ws_01JZW0RK000000000000000001`。**注意**：为让 M0 原型一次装载即可演示两条旅程，光伏与建材 4 家公司共享该演示 Workspace；真实环境中它们是相互隔离的独立租户（ADR-001），原型层请勿据此推断跨租户可见性。
- 有意为之的**外部引用占位**（其事实源不在本 fixtures 范围内，消费方按字符串处理即可）：
  - `usr_*`（平台用户）、`cco_*`（Data Hub CanonicalCompany）；
  - `prv_*` / `lic_*`（Provider 与 DatasetLicense 注册表标识）；
  - `cnt_*`（内容模板 ContentAsset 引用）、`pack_*`（Pack Registry）、`mkt_*`（MarketThesis）、`cnv_*`/`msg_*`（engage 域会话）、`wf_*`（Temporal 工作流运行）、`batch_*`（导入批次）；
  - `opportunities.json` 中 CommercialOutcome 的 `evidence_refs`（`evd_…0101/0102`）指向 Evidence Store 的结果证据对象，与 `companies.json` 中 knowledge 域的 ClaimEvidence（`evd_…0001-0004`）不同域、不重叠。
- 文件内跨文件引用均已对齐：`campaign.json` 的 Audience 成员/`opportunities.json` 的 lead/account/contact 指向 `leads.json`；ICP/Offering/Membership 指向 `icps.json`/`companies.json`/`workspace.json`。

## 校验

```bash
cd packages/contracts
npm run contracts:validate   # 步骤 [3/3] 会按 $schema_ref 强校验本目录全部条目
```

`leads.json` 由脚本生成（生成逻辑一次性使用，位于会话 scratchpad，非仓库资产）；手工修改后请重跑上面的校验。
