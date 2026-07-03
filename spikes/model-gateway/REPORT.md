# SPK-MGW Model Gateway Spike — REPORT

> 对应计划：`docs/program/M1_BACKEND_FOUNDATION_PLAN.md` §3 SPK-MGW 行。
> DoD 原文：**「Mock 全链路 Trace + 预算熔断测试。真实 Key 路径：仅 gitignored env 注入、Config 校验拒缺失/占位值、gitleaks 秘密扫描先进 CI、Key 登记 INT-001；接真实模型 API 前须完成 §5-C 的 Workspace 级跨境授权。同 F 项 Gate 约束」**
> R 级：R1（Mock Provider）。本 Spike **不接任何真实模型 API**，真实 Key 路径只落为本文第 4 节的文档约定。

执行日期：2026-07-04。环境：Windows 11 / node v24.14.1 / npm 11.11.0。独立 `package.json` + `npm install`（不进仓库 pnpm workspace；`pnpm-workspace.yaml` 只含 `apps/*`、`packages/*`，spikes 天然隔离）。

---

## 1. 真实运行结果（如实记录）

### 1.1 真跑通了什么

| 命令 | 结果 |
| --- | --- |
| `npm install --no-fund --no-audit` | added 60 packages（ajv 8.17.x、ajv-formats 3.x、vitest 3.2.6、typescript 5.x） |
| `npx vitest run` | **6 个测试文件 / 24 个测试全部通过**（~0.5s） |
| `npx tsc --noEmit` | 通过（strict + noUncheckedIndexedAccess） |

验证矩阵（任务要求 → 测试 → 断言要点）：

| 验证项 | 测试文件 | 关键断言 |
| --- | --- | --- |
| 自有 Contract：`complete(taskRef, input, opts) → {output, trace}` | 全部测试经 `src/contract.ts` 的 `ModelGateway` 接口调用 | 业务侧只见接口，Provider 在 `providers` Map 之后（ADR-007/CLAUDE.md 硬边界 2） |
| TaskRegistry 注册 Company Understanding **真实契约 Schema** | `test/registry.test.ts` | 直接从 `packages/contracts/json-schema/ai-tasks/company-understanding/{input,output}.schema.json` 加载；`$id` 断言 = `ggw://contracts/ai-tasks/company-understanding/{input,output}`；依赖 `common/primitives.schema.json`（`ggw://contracts/common/primitives`）一并注册进 ajv；正/负例均验 |
| PromptRegistry 版本化 | `test/registry.test.ts`、`test/trace.test.ts` | v1 系统指令从真实 `prompt.v1.md`「系统指令」代码块解析；缺省=最新、`opts.promptVersion` 可钉住 v1；同版本重复注册被拒（版本不可变） |
| RoutingPolicy（primary/fallback 列表） | `test/routing-fallback.test.ts` | taskRef → model policy（`structured_extraction.default`，取自 prompt.v1.md 登记值）→ primary 目标模型下发 |
| 故障切换 fallback | `test/routing-fallback.test.ts` | primary 抛 `PROVIDER_UNAVAILABLE` → fallback 成功；Trace 记录两次尝试；全部失败 → `ALL_PROVIDERS_FAILED` + Trace 状态 `PROVIDER_EXHAUSTED` |
| BudgetGuard 预算熔断 | `test/budget.test.ts` | 工作区**日**预算；预检超限抛 `BudgetExceededError(code=BUDGET_EXCEEDED)` 且**不触达 Provider**；预算按 workspace 隔离（ADR-001）；UTC 跨日重置（clock 注入） |
| Redaction 钩子（email/电话正则演示） | `test/redaction.test.ts` | Provider 收到的请求中原始 email/手机号不存在，替换为 `[REDACTED_EMAIL]/[REDACTED_PHONE]`；Trace 含脱敏统计；小数字（年份/MOQ）不误伤 |
| StructuredOutput 校验失败重试一次后 fail | `test/structured-output.test.ts` | ajv 按真实 output Schema 校验；首次违例 → 带 `[SCHEMA_VALIDATION_FEEDBACK]` 重试一次 → 合规则成功（validation.attempts=2）；两次均违例 → `STRUCTURED_OUTPUT_INVALID`，恰好 2 次 Provider 调用，**不透传不合规响应、不做 Provider 切换**（输出质量问题 ≠ 可用性问题） |
| 每次调用产出 Trace | `test/trace.test.ts` | 成功与失败**均恰好一条**（失败挂在 `GatewayError.trace` 并推给 `onTrace` sink）；含 provider、model、逐次尝试 latency、**cost 估算**（单价×usage）、**prompt 版本**、输入/输出 Schema `$id`、脱敏统计、校验尝试数、correlation_id |
| 两个 MockProvider | `src/providers/mock-stable.ts`、`mock-faulty.ts` | mock-stable 恒返回合规输出；mock-faulty 按脚本注入 `FAIL / INVALID_JSON / SCHEMA_VIOLATION / OK` |

### 1.2 没跑什么（及原因）

- **真实模型 API 调用**：任务与 DoD 明确禁止（R1 Mock Provider）；真实 Key 路径见第 4 节前置清单。
- **LiteLLM**：未引入——定位为**未来内核候选**（§5 拍板 F 项：进 Spike ≠ 生产采用）。本 Spike 验证的是自有 Contract 的形状；若未来引入，LiteLLM 作为 `ModelProvider` 适配层成员（或路由执行器内层）挂在 Contract 之下，`ModelGateway`/`GatewayTrace` 形状不变。
- **Langfuse**：未引入——Trace 落地候选。Spike 用 `onTrace` sink 验证「每次调用恰好一条 Trace」的形状；真实落盘随 BE 阶段决策。
- **并发/跨进程预算原子性**：`InMemoryBudgetGuard` 是进程内存实现，未验证并发竞态；生产须 PG `Budget/Quota` 表（BE-03 表集）+ 事务内原子记账。
- **跨境模型调用 Policy Check**：属 SPK-OPA fail-closed 清单（「跨境模型调用」在列）与 BE-06 接入范围，本 Spike 不重复验证。
- **一次调用触发的中途取消/超时、流式输出、tool use**：不在 `complete` 最小形状内，留待 BE-01β Model Gateway 段冻结时决定是否入 v1 Contract。
- **正则脱敏的覆盖率**：只演示 email/电话两类；生产须字段感知策略（按 `privacy_classification`/`allowed_actions`，DAT-005/006），正则仅兜底。

### 1.3 发现的问题（对后续实现有用）

1. **ajv `strict: true` 会误拒真实契约**：显式 `strict: true` 连带开启 `strictRequired`，拒绝 `input.schema.json` 合法的 `anyOf: [{required:[...]}]` 分支（website_url/uploaded_source_ids 二选一）。已改用 ajv 默认 strict 档并在 `src/structured-output.ts` 注释固化。**生产 Gateway 的 ajv 配置必须以全部 46 个契约 Schema 可编译为回归基线。**
2. 跨 Schema `$ref`（`ggw://contracts/common/primitives`）必须先 `addSchema` 注册原语 Schema，否则编译失败——Schema Registry（母本 9.6）加载顺序要显式管理。
3. 校验失败的重试也要计费（真实 Provider 同样收费）：Spike 已把失败尝试的 usage 计入 Trace 成本并向 BudgetGuard 记账，避免「重试成本黑洞」。

---

## 2. 产物清单

```
spikes/model-gateway/
  package.json / package-lock.json     独立 npm 包（不进 pnpm workspace）
  .gitignore                           node_modules/dist/.env 等
  tsconfig.json / vitest.config.ts
  src/
    contract.ts            ModelGateway/CompleteOptions/GatewayTrace/Provider 接口 + 错误码族
    task-registry.ts       TaskRegistry；注册 company-understanding@1（Schema 从 packages/contracts 真实文件加载）
    prompt-registry.ts     PromptRegistry（版本化）；v1 从真实 prompt.v1.md 提取系统指令
    routing-policy.ts      RoutingPolicy（primary/fallback + 单价）+ 成本估算
    budget-guard.ts        BudgetGuard 接口 + InMemoryBudgetGuard（工作区日预算，UTC 日界，clock 可注入）
    redaction.ts           Redaction 钩子（email/电话正则演示）
    structured-output.ts   ajv(draft2020) SchemaValidator（含 primitives 注册）
    gateway.ts             ModelGatewayImpl：校验→脱敏→预算预检→路由/故障切换→输出校验重试→记账→Trace
    providers/fixtures.ts  合法输入/输出/违例输出夹具（ID 满足 primitives 前缀 ULID 形状）
    providers/mock-stable.ts / mock-faulty.ts
  test/
    harness.ts             装配器
    registry.test.ts       5 tests · routing-fallback.test.ts 5 · budget.test.ts 3
    redaction.test.ts      3 · structured-output.test.ts 4 · trace.test.ts 4
  REPORT.md                本文件
```

复现：`cd spikes/model-gateway && npm install && npm test`。

---

## 3. 验收卡草稿（SPIKE-CARD-MGW-001，正式回写 docs/oss/ 由后续 PR 做）

> 供 BE-01β「Model Gateway 段」逐段引用（计划 §3 BE-01β DoD：每个 Spike 依赖段必须引用验收卡编号）。
> 格式对齐 `docs/oss/_TEMPLATE.md` 九段的第 5/6/7 段口径。

- **卡号**：SPIKE-CARD-MGW-001（草稿；回写 docs/oss/ 时定稿）
- **对象**：自有 Model Gateway Contract（非某个 OSS 项目本身；LiteLLM/Langfuse 为候选内核/Trace 落地，各自另有 OSS 交付卡义务）
- **决策建议**：**Build（自有 Contract）+ 未来可 Integrate（LiteLLM 作 Provider 适配层内核候选）**

### 5. Spike Plan（已执行）

用例 = 第 1.1 节验证矩阵 9 项；数据集 = Company Understanding 真实契约 Schema + 最小合法/违例夹具；通过阈值 = 全部用例绿 + typecheck 绿；失败判定 = 任一 DoD 行为（熔断/切换/重试/Trace）无法在测试中复现。

### 6. Spike Result

**通过。** 24/24 测试绿（vitest 3.2.6），tsc 严格模式绿。结论：

1. `complete(taskRef, input, opts)→{output, trace}` 的最小 Contract 足以承载路由、故障切换、预算熔断、脱敏、结构化输出重试、全链路 Trace 六类横切；业务代码无需感知 Provider。
2. 真实契约（packages/contracts）可直接作为 TaskRegistry 的 Schema 源，无需复制——Schema Registry 加载顺序与 ajv 配置是仅有的两个坑（第 1.3 节）。
3. 失败路径同样产出 Trace 并可统一 sink，满足「每次调用产出 Trace」的审计口径。

### 7. Production Gate（未过，显式列缺口）

- [ ] 真实 Provider 适配（Anthropic/OpenAI/…或 LiteLLM 内核）——先过第 4 节前置清单
- [ ] LiteLLM/Langfuse 各自的 License/Security Review + OSS 九段卡（F 项：Spike 批准 ≠ 生产采用）
- [ ] BudgetGuard 落 PG（BE-03 Budget/Quota 表）+ 并发原子性
- [ ] 跨境模型调用 Policy Check 接入（SPK-OPA 清单动作、BE-06）
- [ ] Trace 持久化（Langfuse 或 PG）+ 敏感字段落盘前脱敏复核（母本 9.10）
- [ ] 字段感知脱敏策略（DAT-005/006），正则降级为兜底
- [ ] 超时/取消/流式是否入 Contract v1 —— BE-01β Model Gateway 段冻结时拍板

---

## 4. 接真实模型 API 前置清单（全部完成前，禁止配置任何真实 Key）

对应 DoD「真实 Key 路径」句 + 计划 §5-C 拍板 + 安全评审 #5：

1. **仅 gitignored env 注入**：Key 只经环境变量/gitignored `.env` 注入（本目录 `.gitignore` 已含 `.env`/`.env.*`；仓库 `.claude/hooks/guard-protected-paths.mjs` 硬阻断 `.env`/secrets 入仓）。环境变量命名约定（文档约定，不建 `.env.example` 实值文件）：`MGW_PROVIDER_<NAME>_API_KEY`、`MGW_PROVIDER_<NAME>_BASE_URL`、`MGW_PROVIDER_<NAME>_REGION`。
2. **Config 校验拒缺失/占位值**：进程启动 fail-fast——Key 缺失、空串、或占位形状（`changeme`、`xxx`、`sk-000…`、`your-api-key` 等）一律拒绝启动（对齐 BE-02 DoD「Config 校验拒占位密钥」）。
3. **gitleaks 秘密扫描先进 CI**：按计划 §2 Spike 产物边界，CI workflow 变更**不随本 Spike**，随 BE-02 或单独 R2 PR 实施；gitleaks 绿之前不配真实 Key。
4. **Key 登记 INT-001**：Provider、API Key、Secret 统一管理，Secret 加密且不回显（母本 INT-001；`docs/security/SECRET_MANAGEMENT.md` / ADR-015）。
5. **Workspace 级跨境授权（计划 §5-C）**：接真实模型 API 前完成——Workspace 管理员级授权（Provider/Region/Data Class/Task/预算边界）+ **每次调用确定性 Policy Check**（跨境模型调用在 SPK-OPA fail-closed 清单内，OPA 不可用即全拒）+ 全量记录；仅授权边界变化时重新人工审批，不得每次调用弹人工确认。
6. **F 项 Gate**：以上全部 ≠ 生产采用；LiteLLM/Langfuse 升生产依赖仍须 OSS 九段交付卡 + License/Security Review + Production Gate（R2 人工批准）。

---

## 5. 距离 DoD 的差距

DoD 两个可执行项——**Mock 全链路 Trace** 与 **预算熔断测试**——已真实跑通（第 1.1 节）；「真实 Key 路径」按 DoD 要求落为文档约定（第 4 节）。剩余动作均在 Spike 边界之外：

1. 验收卡从本 REPORT 正式回写 `docs/oss/`（后续 PR；Spike 产物边界禁止本次写 docs/**）。
2. BE-01β Model Gateway 段引用 SPIKE-CARD-MGW-001 冻结（含超时/取消/流式入不入 v1 的拍板）。
3. gitleaks 进 CI（随 BE-02 或单独 R2 PR）。
4. 生产化缺口见第 3 节 Production Gate 列表。
