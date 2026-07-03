# SPK-OPA Policy Spike — 结果报告与验收卡草稿

> 状态：**Spike 完成，全部验证真实运行通过**（2026-07-04）。
> 依据：`docs/program/M1_BACKEND_FOUNDATION_PLAN.md` §3 SPK-OPA 行（R1）。
> 提醒（M1 §5-F）：**Spike 批准 ≠ 生产采用**。OPA 升生产依赖仍须 OSS 九段交付卡 + License/Security Review + Production Gate；本验收卡为草稿，正式回写 `docs/oss/` 由后续 PR 执行（Spike 产物边界，M1 §2）。

---

## 1. DoD 对照（M1 计划 SPK-OPA 行）

| DoD 要求 | 结果 |
|---|---|
| 用 contracts 的 ActionProposal/ExecutionAuthorization fixtures 驱动，不依赖 BE-04 | 达成（有保留）：`ExecutionAuthorization` fixture（`auth_01JZAVTH…0001`）由脚本从 `packages/contracts/fixtures/campaign.json` **原样提取**驱动全部用例；**ActionProposal 在 contracts 中不存在**（全仓 grep 无 Proposal schema），动作输入形状以本 Spike 的 `schemas/policy-input.schema.json` 提案（§6 缺口 1） |
| Allow / Deny / RequireApproval 三态 | 达成：决策对象 `{allow, require_approval, reason_codes[]}`，三态互斥，42 个 opa test 用例 + 5 个 opa eval 演示全部通过 |
| Fail-Closed 边界明确化（清单动作/RBAC 承接/OPA 不可用全拒+readiness 红+告警） | 达成：见 §4 验收卡草稿；引擎内部 fail-closed 有测试证明，「引擎不可达=拒」为应用侧约定（引擎死了无法自测），BE-06 必须以集成测试覆盖 |
| 决策审计 | 字段建议见 §4.3（Spike 未落 PG——决策审计持久化按计划属 BE-06） |

## 2. 真实运行记录（全部实跑，无虚报）

环境：Docker Desktop（daemon 29.5.3 → 期间自动更新为 29.6.1，见 §7 备注）；镜像 **openpolicyagent/opa:1.18.2**（`sha256:cba27d3c6af2feba1e4d6e6b5e24df5b53db332420d4148a90acccd12efae6ed`，Rego v1）；Node v24 + npm（spike 独立 `package.json`，未触碰根 pnpm workspace）。

| 验证项 | 命令 | 结果 |
|---|---|---|
| fixtures 生成（contracts → 输入） | `npm run build:inputs` | `fixtures/data.json` + 5 个 eval 输入，`requested_at` 取授权窗口中点（确定性，不读墙钟） |
| 输入过真实契约校验 | `npm run validate:inputs`（ajv 2020-12） | 8/8 PASS——嵌入的 authorization 直接过 `packages/contracts/json-schema/campaign/execution-authorization.schema.json`（含 primitives/channel-plan $ref 解析） |
| 策略单元测试 | `npm run opa:test`（docker run opa test） | **PASS 42/42**（正/负向，见 §3） |
| 决策演示 | `npm run opa:eval`（docker run opa eval，逐输入断言 `_meta.expected_decision`） | **5/5 匹配** |

opa eval 实际输出（`data.ggw.policy.decision`）：

```text
input-01-outbound-in-scope-allow        → {"allow":true, "require_approval":false, "reason_codes":[]}
input-02-outbound-out-of-scope-deny     → {"allow":false,"require_approval":false,
                                           "reason_codes":["AUTHORIZATION_EXPIRED","CHANNEL_NOT_AUTHORIZED","MAX_TOTAL_ACTIONS_EXCEEDED"]}
input-03-export-no-approval             → {"allow":false,"require_approval":true,
                                           "reason_codes":["AUTHORIZATION_REQUIRED","NO_APPROVAL_TOKEN"]}
input-04-crossborder-in-boundary-allow  → {"allow":true, "require_approval":false, "reason_codes":[]}
input-05-crossborder-out-of-boundary    → {"allow":false,"require_approval":false,
                                           "reason_codes":["DATA_CLASS_NOT_AUTHORIZED","MODEL_REGION_NOT_AUTHORIZED"]}
```

## 3. 策略结构与用例覆盖

```text
policies/ggw/policy/
  main.rego      入口分派 + default deny + 治理清单外显式拒（ACTION_TYPE_NOT_GOVERNED）
  campaign.rego  OUTBOUND_SEND / CONTENT_PUBLISH ⇐ ExecutionAuthorization（CAM-008 固化范围/模板指纹/受众/计数/有效期）
  approval.rego  DATA_EXPORT / DELETE / SUPPRESSION_CHANGE ⇐ Approval Token（WSP-006 语义）
  model.rego     CROSS_BORDER_MODEL_CALL ⇐ Workspace 级授权（M1 §5-C：provider/region/data_class/task/预算边界）
  decision_test.rego  42 用例
```

语义（每条动作路径一致）：**无授权载体 → require_approval；有效授权且范围内 → allow；有授权但任一违规 → deny + 全部 reason_codes（sort 后确定性输出）**。

负向覆盖（节选）：空输入 default deny；治理清单外动作拒；跨 Workspace 复用授权拒（WORKSPACE_MISMATCH）；授权 REVOKED/过期/未生效拒；渠道/动作类型超范围拒；`max_total_actions` 达上限拒（899 允/900 拒边界）；执行计数缺失拒；模板未授权/内容指纹失配拒（CAM-008 模板变更授权失配）；受众超范围拒；`requested_at` 缺失/非法拒；多违规累积输出；审批令牌过期/动作不覆盖/资源不覆盖/跨租户拒；跨境调用 provider/region/data_class/task/预算越界拒、model 属性缺失拒。

**Spike 技术发现（对 BE-06 有直接价值）**：

1. **Rego 否定表达式的 term-hoisting 是 fail-open 陷阱**：`not is_number(ref)`、`not x in y` 中的 ref 会被编译器提升到否定之外，ref undefined 时整条违规规则静默不触发→字段缺失反而放行。已用「显式存在性违规 + helper rule 间接层」修复，并由负向测试（counter/channel/model 属性缺失）钉死。BE-06 写生产策略时必须遵循此模式，且每条比较规则配套缺失用例。
2. `object.union` 对两侧同为对象的键做**递归合并**，测试中用它构造「删除嵌套键」的输入会把键合并回来（本 Spike 测试曾因此假失败）。
3. 决策对时间的判断一律用 PEP 注入的 `requested_at`（不读墙钟），保证测试与审计重放的确定性。

## 4. 验收卡草稿（回写 docs/oss/ 用）

**OSS 候选**：Open Policy Agent（openpolicyagent/opa:1.18.2，Apache-2.0）。用途：PolicyDecision 引擎（PDP）。结论：**Spike 通过，推荐进入 BE-06 接入**；升生产前置：License/Security Review + Production Gate（M1 §5-F），部署形态（sidecar/中心化）与 bundle 分发方式在 BE-01β Permissions 段冻结。

### 4.1 Fail-closed 边界 = 经 PolicyDecision 的动作清单（默认审批集）

| # | 动作 | 授权载体 | 无载体 | 有载体且范围内 | 范围外/失效 |
|---|---|---|---|---|---|
| 1 | OUTBOUND_SEND | ExecutionAuthorization（campaign 域契约，已存在） | require_approval | allow | deny+reason |
| 2 | CONTENT_PUBLISH | 同上 | require_approval | allow | deny+reason |
| 3 | DATA_EXPORT | Approval Token（WSP-006；实体契约缺口） | require_approval | allow | deny+reason |
| 4 | DELETE | 同上 | require_approval | allow | deny+reason |
| 5 | SUPPRESSION_CHANGE | 同上 | require_approval | allow | deny+reason |
| 6 | CROSS_BORDER_MODEL_CALL | Workspace 级模型授权（§5-C 语义；契约缺口）——管理员签发边界（provider/region/data_class/task/预算），每次调用确定性 Check + 全量记录，**仅边界变化重新人工审批，不逐次弹窗** | require_approval | allow | deny+reason |

清单外：**内部读写由 RBAC（BE-04 PermissionGrant/角色）承接，不经 OPA**；若清单外动作误送 OPA → 显式 deny（`ACTION_TYPE_NOT_GOVERNED`），防边界漂移。清单扩张（如 ApprovalRule 枚举中的 CAMPAIGN_LAUNCH/DATA_PURCHASE/BUDGET_CHANGE 等是否入 OPA）属 R2 决策。

### 4.2 「OPA 不可达 = 拒」应用侧（PEP）约定 —— BE-06 必须实现并集成测试

引擎死了没有决策，Rego 无法自证此项；约定如下（对应 CLAUDE.md 硬边界 #1：Policy 前置于一切外部动作）：

```text
PEP 调用 PDP：
  连接错误 / 超时(建议 ≤500ms×2次重试) / HTTP 非 200 / 响应缺 result / 决策对象形状非法
    → 视同 {allow:false, require_approval:false, reason_codes:["POLICY_ENGINE_UNAVAILABLE"]}
    → 清单内动作全部拒绝（不降级、不缓存旧 allow、不跳过检查）
    → /readiness 亮红（policy_engine=down），编排暂停派发清单内动作
    → 结构化日志 + 告警；决策审计记录 degraded=true
```

### 4.3 决策审计字段建议（BE-06 落 PG，条目只增不改）

建议表 `policy_decision`（对齐 `audit-log-entry.schema.json`，`AuditLogEntry.policy_decision_id` 外链本表）：

| 字段 | 说明 |
|---|---|
| id | `pdc_` 前缀（primitives 前缀映射补充） |
| workspace_id | RLS 租户边界（ADR-001） |
| action_type / resource_type / resource_id | 被判定动作与对象 |
| actor_type / actor_id / on_behalf_of | 对齐 audit-log-entry 枚举 |
| authorization_id / approval_id / model_grant_id | 命中的授权载体（可空） |
| decision | ALLOW / REQUIRE_APPROVAL / DENY（由决策对象派生的单枚举，便于查询） |
| reason_codes | text[]，进 API 错误体 policy_reason_codes（母本 11.15） |
| policy_entrypoint / policy_bundle_revision / policy_git_sha | 决策可追溯到策略版本（BE-06 DoD「策略版本与决策可追溯」） |
| engine_version / engine_image_digest | 如 1.18.2 / sha256:cba27d… |
| input_digest | 规范化输入 sha256（敏感值不存明文，母本 12.11；重放校验用） |
| requested_at / evaluated_at / latency_ms | 评估时刻（PEP 注入）与性能 |
| degraded | bool：引擎不可达触发的 fail-closed 拒绝 |
| request_id / correlation_id / causation_id | 对齐 contracts envelope 关联链 |
| created_at / version=1 | 不可变条目 |

## 5. 输入契约（Spike 提案，待 R2 契约化）

`schemas/policy-input.schema.json`：`{action{type, workspace_id, requested_at, actor?, …动作特有字段}, authorization?, approval?, workspace_model_authorization?}`。授权记录由 PEP 从 PG 加载注入（OPA 不拥有状态，硬边界 #1/#4）；已用 ajv 对真实 contracts schema 校验通过。

## 6. 契约缺口登记（不得静默消失；均需 R2 PR 进 packages/contracts）

1. **ActionProposal 无 schema**：M1 计划 SPK-OPA 行所述「ActionProposal fixtures」在 contracts 中不存在；本 Spike 的 `action` 形状即其最小提案，BE-06 前需契约化。
2. **Approval Token 实体无 schema**（approval-rule.schema.json 只有规则）；且 `ApprovalRule.governed_actions` 枚举缺 `DELETE`（audit 侧叫 `DATA_DELETE`）与 `SUPPRESSION_CHANGE`——默认审批集与枚举需对齐。
3. **Workspace 级跨境模型授权对象无 schema**（建议 `workspace/model-access-grant.schema.json`，含 §5-C 边界字段 + 状态机）。
4. `WorkspacePolicy.rules`（声明式 DENY/REQUIRE_APPROVAL 规则）如何进入 OPA：建议**静态 Rego + data 文档参数化**（规则实体作 data 注入），不做 Rego 代码生成——BE-06 决策点。

## 7. 未跑通项 / 边界之外（如实记录）

- **未接 API/PEP**：HTTP PDP 调用、决策审计写 PG、readiness 集成——按计划属 BE-06，本 Spike 不做。
- **「引擎不可达=拒」未做自动化验证**：属应用侧行为，Spike 阶段无 PEP 可测；已固化为 §4.2 约定 + BE-06 集成测试要求。
- **WorkspacePolicy 声明式规则未映射进 Rego**（§6 缺口 4，超出本 Spike DoD）。
- **性能/并发未压测**（单次决策毫秒级观测值仅供参考）。
- 过程备注：验证期间 Docker Desktop 自动更新（daemon 29.5.3→29.6.1）导致一次守护进程短暂不可用与镜像重拉，恢复后全部重跑通过；期间还观测到 bind-mount 编辑后的短暂缓存滞后（一次假失败），最终以干净环境全绿为准。
- 仓库工作树中 `docs/epics/EPIC-FOUNDATION.md` 存在并行会话（BE-01α）的未提交修改，与本 Spike 无关、未触碰。

## 8. 复跑方式

```bash
cd "spikes/opa-policy"
npm install
npm test   # build:inputs → validate:inputs(ajv×真实契约) → opa:test(42) → opa:eval(5)
```
