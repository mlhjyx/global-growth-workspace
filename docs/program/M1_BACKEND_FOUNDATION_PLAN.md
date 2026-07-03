# M1 Backend Foundation 启动计划（双轨并行）v2

> **状态：APPROVED（2026-07-04 业务负责人批准合并，PR #19）。** Track B 生效：BE-01α 与 SPK-TMP/OPA/MGW 并行开工。
> 批准链：业务负责人批准双轨方向并附 **11 项修订**（v2 全部吸收，对照见 §6）→ 四方评审发现全部处置（§0）→ 批准合并。后续 PR 按 GDR-003 由 Claude Code 检查后自主合并（**GDR-003 全部红线除外**：R3、对外发送/发布授权、数据权利与导出、跨境模型调用授权的建立、删除与 Suppression、OPEN DECISIONS 关闭）。

## 0. 评审与批准记录

| 评审方 | 结论 | 发现 | 处置 |
|---|---|---|---|
| 业务负责人（最终授权） | 批准附 11 项修订 | 11 | 全部吸收（§6 对照） |
| 内部架构一致性 Agent | REQUEST_CHANGES | 1 BLOCKER / 2 MAJOR / 4 MINOR | 全部修复（§6） |
| 内部安全与交付 Agent | REQUEST_CHANGES | 6 MAJOR / 2 MINOR | 全部修复或登记（§6） |
| Codex 行级评审（PR #19） | 4 × P2 | Spike 顺序 / 身份表租户化 / Outbox envelope / 策略实体持久化 | 全部修复（§6） |
| 内部治理与流程 Agent（对 v2 复审） | APPROVE_WITH_CHANGES | 3 MAJOR / 4 MINOR / 1 NOTE，无 BLOCKER，无一阻塞 BE-01α | 全部修复于本版（§6 末行） |

## 1. 后端就绪度审计（2026-07-04，结论维持）

**已完成的是设计/契约资产；后端运行时代码 0 行、未开始。** Schema/ADR/fixtures/Mock/原型页面不构成"后端已完成"的任何部分。

- **已完成（设计层）**：五域 46 JSON Schema + 5 OpenAPI + 5 AsyncAPI + 11 状态机 + 195 fixtures（CI 强校验）；AI Task 打样 1/14；ADR-100~104 + 架构薄文档；infra/docker-compose.dev.yml（pgvector/pg16 + Redis，仅 dev）；工程治理（R0-R3、ruleset、Codex 审查、CI 真实 typecheck+build）；EPIC-FOUNDATION 包骨架。
- **未开始（运行时）**：apps/api（NestJS）· Prisma Schema/迁移 · Tenant Context · RLS 及其负向测试 · 认证/RBAC · OPA Runtime · Approval Runtime · Outbox/消费者/DLQ · Temporal Worker · Model Gateway · Langfuse Trace · Secret 注入基线 · OTel · 真实契约测试 · 运行时审计。packages/policy 仅占位。
- **显式后置、不得静默消失**：Backup/RPO/RTO、生产 CI/CD → 随云化决策在 M2 前落地（已登记 ROADMAP 阻塞表）；共享 Dev/Staging 环境 → 最晚 BE-09 开始前建立（§5-D）。

## 2. 双轨模型、依赖图、最低节奏与 WIP 限制

```text
Track A 产品验证（不停）：EPIC-M0-05 → EPIC-M0-06 → Preview → 用户测试 → Gate 1
Track B 后端去风险（新启）：

  即刻可启动（互不依赖，仅需 docker-compose，与 BE-01 并行）：
    SPK-TMP Temporal Spike · SPK-OPA OPA Spike（contracts fixtures 驱动，不依赖 BE-04）· SPK-MGW Model Gateway Spike

  主链：BE-01α（不依赖 Spike 的段冻结，R2 批准 = BE-02..05 启动门，GDR-002）
        → BE-02 API 骨架 → BE-03 租户地基 → BE-04 认证授权 → BE-05 Outbox → BE-06 OPA 接入
  终审：BE-01β（Permissions/Temporal/Gateway/任务分解段，随三张 Spike 验收卡终审）——最晚 BE-04 开始前完成
  切片：BE-09 纵向切片 Epic（5 个 PR，§4）依赖 BE-03/04/05/06 + BE-01β
```

- **最低推进节奏（防 Track B 饥饿，业务负责人 G 项）**：`BE-01α → M0-05 → BE-02 → M0-06 → BE-03 → M0 Gate 1 → BE-04/05 → BE-06 → BE-09A..E`。冲突时 Track A 优先，但**每完成一个 M0 Epic 必须至少推进一个 BE 单元**——「推进」的判定标准：**对应 BE PR 已合并，或已 Ready 并提请 R2 批准且评审证据落盘**；在启动下一个 M0 Epic 前判定。
- **WIP 上限（安全评审，治理评审精确化）**：**BE-xx 运行时 PR 同一时刻最多 1 个开放**；SPK-*/文档 PR 不计入上限，**但数据库迁移仍只允许出现在唯一开放的 BE PR 中**（防迁移顺序冲突与批准积压）。
- **Spike 产物边界（治理评审）**：Spike 产物一律置于 `spikes/**` + 验收卡回写 `docs/oss/`，**不得写入 packages/**（含 packages/policy）与 .github/workflows**；gitleaks 等 CI 变更随 BE-02 或单独 R2 PR 实施。
- Outbox（BE-05）不依赖 Auth（BE-04）：envelope 的 workspace_id 来自业务事务而非会话（架构评审确认）；两者都依赖 BE-03，可按节奏先后。

## 3. 后端 Epic/PR 计划 v2

| 编号 | 内容 | 前置 | R 级 | DoD 要点 |
|---|---|---|---|---|
| **BE-01α** | Foundation 包阶段一：冻结不依赖 Spike 的段——C4 落细、Bounded Context、Core ERD、Tenant/Auth/RBAC 模型、API·Error·Versioning、幂等、迁移/回滚、测试策略、威胁模型、环境阶梯 | 本计划合并 | **R2** | 业务负责人批准 = BE-02..05 启动门（GDR-002 取代「过 Gate 3」表述，EPIC-FOUNDATION 已同步修订） |
| **BE-01β** | Foundation 包阶段二：第 6 段 Permissions（OPA）、Temporal/Model Gateway 相关段、Task Breakdown 终审 | 三张 Spike 验收卡 | **R2** | 最晚 BE-04 开始前完成；**每个 Spike 依赖段必须逐段引用对应验收卡编号，无验收卡的段不得冻结** |
| **SPK-TMP** | Temporal Runtime Spike：compose 起集群；首个 Workflow = `Campaign Draft→DryRun→Proposal→Policy→人工审批(Signal)→授权→Mock 执行→Result`；Retry/Timeout/补偿/Worker 重启恢复/版本化/Activity 幂等 | 无 | R1 | 杀 Worker 后 Workflow 恢复完成；验收卡回写 OSS Registry。**Spike 批准 ≠ 生产采用：仍须 License/Security Review + Production Gate（业务负责人 F 项）** |
| **SPK-OPA** | OPA Policy Spike：用 contracts 的 ActionProposal/ExecutionAuthorization fixtures 驱动（不依赖 BE-04）；Allow/Deny/RequireApproval；决策审计 | 无 | R1 | **Fail-Closed 边界明确化：仅覆盖经 PolicyDecision 的动作清单（对外发送/发布/数据导出/删除/Suppression/跨境模型调用）；内部读写由 RBAC 承接；OPA 不可用 → 清单动作全拒 + readiness 亮红 + 告警**。验收卡回写；同 F 项 Gate 约束 |
| **SPK-MGW** | Model Gateway Spike：自有 ModelGateway Contract + TaskRegistry/PromptRegistry/路由/BudgetGuard/脱敏/StructuredOutput/Fallback/Trace（LiteLLM 内核候选、Langfuse Trace 候选） | 无 | R1（Mock Provider） | Mock 全链路 Trace + 预算熔断测试。**真实 Key 路径：仅 gitignored env 注入、Config 校验拒缺失/占位值、gitleaks 秘密扫描先进 CI、Key 登记 INT-001；接真实模型 API 前须完成 §5-C 的 Workspace 级跨境授权**。同 F 项 Gate 约束 |
| **BE-02** | apps/api NestJS 骨架：health/readiness、/api/v1、request-id+correlation-id、统一错误体（对齐 contracts 错误模型）、ValidationPipe、结构化日志、**OTel 骨架**、OpenAPI 输出、Config 校验（拒占位密钥）、优雅停机；**不含业务** | BE-01α 批准 | **R2（含 CI workflow 变更）** | 本地起服务过冒烟；CI 纳入 api 各任务；**供应链基线：新依赖受 minimumReleaseAge 约束、onlyBuiltDependencies 显式白名单（Prisma 引擎等）、lockfile diff 审查**；compose 端口改绑 127.0.0.1（PG/Redis） |
| **BE-03** | Prisma/PG 租户地基。表集（按契约命名与所有权）：**Organization（组织级，无 workspace_id）、User（平台级身份）、Workspace（租户边界）、Membership（User×Workspace 关联）**、Role、AuditLogEntry、FeatureFlag、Budget、Quota | BE-02 | **R2（迁移）** | **数据边界规则：所有 Workspace 所属业务表必须带 workspace_id；平台/组织级实体按明确所有权建模，禁止一刀切**。RLS 硬口径全进 CI：应用连接角色非表 owner、无 BYPASSRLS、FORCE ROW LEVEL SECURITY、tenant GUC 未设置=零行（fail-closed）、写路径 WITH CHECK（拒伪造他租户 workspace_id）、跨租户 ID 枚举=404、事务级 Tenant Context、连接池归还前清理、后台 Worker 显式设置 Workspace、双 Workspace 负向测试；迁移 up/down 双向验证；pgvector 扩展**不启用**（留待 W2 知识层 Bake-off） |
| **BE-04** | 认证/授权/审计：**IdentityProviderAdapter**（Dev IdP 仅允许 Local/CI 启用；禁自研生产认证；禁 Dev Token/固定用户进 Staging+）；Session/JWT 校验；Workspace 切换；RBAC；PolicyDecision 接口（先内置规则）；AuditContext + 敏感动作审计 | BE-03 | **R2（Auth）** | **Tenant Context 仅可源自已验证 JWT 声明，移除测试注入路径；JWT 篡改/缺失/过期/跨 Workspace 切换负向测试通过**（并列为 BE-09 显式前置）；本 PR 迁移补策略实体持久化：**PermissionGrant/WorkspacePolicy/ApprovalRule/ControlSwitch**（BE-06/09 的依赖；Brand 随 BE-09A 内容链）；权限矩阵测试；**OD-14 生产 IdP 已登记（最晚 M1 外部 Alpha 前关闭）** |
| **BE-05** | Transactional Outbox：业务事务→outbox 表→Publisher→Consumer→重试→DLQ→replay | BE-03 | **R2（迁移+事件）** | **事件 envelope 严格按 packages/contracts envelope.schema（schema_version/correlation_id/causation_id/workspace_id 等），不含 idempotency_key——幂等由 event_id + consumer checkpoint 去重实现，不做破坏性契约变更**（Codex 发现）；纯 PG 轮询 Worker，**Redis 不承担投递语义**（不变相引入第二 broker）；**DLQ 深度进 health/readiness + 结构化日志告警阈值**；消费幂等测试 + DLQ 重放演示 |
| **BE-06** | OPA 接入 API：PolicyDecision 切换 OPA 后端；决策审计落 PG；fail-closed 按 SPK-OPA 已定边界 | BE-04 + SPK-OPA + BE-01β | **R2（policy）** | 默认审批集动作在无授权时全拒；策略版本与决策可追溯 |
| **BE-09** | **纵向切片 Epic（5 个 PR，禁止单一大 PR）** | BE-03/04/05/06 + BE-01β + BE-04 认证负向测试通过 | 见 §4 | 见 §4 |

## 4. 第一条纵向切片（BE-09 Epic）

**业务链（修订 #9：补齐互动到商机，Opportunity 不得从 Authorization 直接生成）：**

```text
Workspace → Company(Claim/Evidence) → ICP → Lead → Campaign → Dry Run → ActionProposal → ExecutionAuthorization
→ Mock/Sandbox Execution → Execution Result → Reply/Interaction（模拟回流）→ Opportunity Candidate
→ Sales Acceptance（接受/拒绝+原因）→ SAO →（Commercial Outcome 验证属 M2，不在本切片）
```

| PR | 覆盖 | R 级 |
|---|---|---|
| BE-09A | Workspace 上下文接线 + Company + Claim/Evidence（含 Brand 持久化） | R2（迁移） |
| BE-09B | ICP + Lead（matched_icp、六维评分骨架、Suppression 硬约束） | R2（迁移） |
| BE-09C | Campaign + Dry Run + ActionProposal + ExecutionAuthorization（授权即冻结快照） | R2（迁移） |
| BE-09D | Mock Execution + Interaction 回流 + Opportunity Candidate + **Sales Acceptance + SAO** | R2（迁移） |
| BE-09E | 全链验证：**OpenAPI 生成客户端**做 E2E（三类契约语义断言：Idempotency-Key 重放、If-Match/VERSION_CONFLICT、Policy 拒绝统一错误体）+ fixtures↔API 响应往返一致性 + RLS 负向 + 审计完整性 | R1 |

| 层 | 真实 or Mock |
|---|---|
| 数据库/迁移/RLS/审计/幂等/状态机 | **真实**（PG，按 contracts；非法状态迁移必须被拒） |
| API（NestJS + OpenAPI 契约测试） | **真实** |
| 审批链（DryRun→Proposal→Policy→授权） | **真实**运行时（OPA + BE-01β 确认的编排方式） |
| 数据 Provider / AI / 外部执行 / 回复 | **Mock/Sandbox Adapter**（接口按 contracts，回复由 Sandbox 注入模拟） |
| 前端 | M0 原型不改造；**API E2E = 后端完成标准，不是产品完成标准**——产品级完成以 **FE-M1-02** 为准（见下） |

**验收**：① 双 Workspace 完全隔离（含 BE-03 全部负向口径）；② 全链 API 打通且每步过契约校验；③ 未授权执行被 Policy 拒绝（fail-closed）；④ 每个外部动作有 ActionProposal+审计；⑤ Campaign 与 Opportunity 仅以 ID/事件关联（D-009）；⑥ 迁移全部可回滚；⑦ **SAO 必须由 Sales Acceptance 产生，拒绝路径含原因与后续跟进状态**。

**M1 Web 真实接入（修订 #11，已登记 ROADMAP）**：`FE-M1-01 Production Web Shell（Next.js apps/web 骨架）`、`FE-M1-02 First Vertical Slice Integration（真实前端接真实 API 走通切片）`。

## 5. 拍板结果（2026-07-04 业务负责人，逐项）

| # | 事项 | 拍板 |
|---|---|---|
| A | 双轨 + BE 序列 | **批准**（附 11 项修订，本 v2 已吸收） |
| B | OD-11 代理商多 Workspace | 不阻塞 BE-03：**只实现通用 Organization→Workspace→Membership 与一人多 Workspace**；不实现代理商商业模式/跨客户委派/代理计费；**OD-11 保持开放，不得标记关闭** |
| C | OD-13 审批集 | 默认集成立，**分类处理**：对外发送/发布/批量导出/删除/Suppression = 逐动作或逐批人工审批；**跨境模型调用 = Workspace 管理员级授权（Provider/Region/Data Class/Task/预算边界）+ 每次调用确定性 Policy Check + 全量记录，仅授权边界变化时重新人工审批**——不得每次调用弹人工确认 |
| D | 环境 | 本地 docker-compose + **CI Ephemeral（service containers/Testcontainers）即刻建立**；**共享 Development/Staging 最晚 BE-09 开始前建立**；生产云架构 M2 前决策（Backup/RPO/RTO、生产 CI/CD 随之，已登记不消失） |
| E | 认证 | Dev IdP 仅经 IdentityProviderAdapter、仅 Local/CI；**禁自研生产认证**；Subject ID/Membership/Claims/Workspace 切换/Session 生命周期/MFA·SSO 扩展边界在 BE-01α 定死；**新增 OD-14 Production Identity Provider，最晚 M1 外部 Alpha/首个 Design Partner 登录前关闭** |
| F | 开源 Spike | 批准 Temporal/OPA/LiteLLM/Langfuse **进入 Spike**；**不等于生产采用**——仍须 OSS 九段交付卡 + Spike Result + License/Security Review + Production Gate 才能升级生产依赖 |
| G | 节奏 | M0 优先 + **最低推进节奏**（§2）+ WIP 上限，防 Track B 永久饥饿 |

## 6. 修订与评审发现对照（处置登记）

| 来源 | 项 | 落点 |
|---|---|---|
| 业务负责人 #1-7 | A-G 拍板 | §5 |
| 业务负责人 #8 | BE-09 拆 Epic 五 PR | §4 |
| 业务负责人 #9 | 补 Mock Execution→Interaction→Sales Acceptance→SAO | §4 业务链 + BE-09D |
| 业务负责人 #10 | workspace_id 精确规则 + RLS/连接池/Worker/负向测试 | BE-03 DoD |
| 业务负责人 #11 | FE-M1-01/02 | §4 + ROADMAP |
| 架构评审 #1（BLOCKER）/ Codex #1 | Spike 排序使 BE-01 DoD 不可满足 | §2：SPK-* 即刻启动 + BE-01 两阶段（α/β） |
| 架构评审 #2 | EPIC-FOUNDATION「过 Gate 3」门与本计划矛盾 | EPIC-FOUNDATION 同 PR 修订 + GDR-002 登记 |
| 架构评审 #3 | Secret/OTel/Backup/生产 CI/CD 无落点 | BE-02（OTel+Secret 基线）+ §1 显式后置登记 |
| 架构评审 #4 / Codex（同 #8） | BE-09 单 PR 过大 | §4 五 PR |
| 架构评审 #5 | BE-02 R1 与触及 workflows 矛盾 | BE-02 升 R2 |
| 架构评审 #6 | Redis/pgvector 角色未定义 | BE-05（纯 PG 轮询、Redis 非 broker）+ BE-03（pgvector 待 Bake-off） |
| 架构评审 #7 | 请求语义盲区 | BE-09E 生成客户端 E2E 三类断言 + 往返一致性 |
| 安全评审 #1 | RLS 测试口径不足 | BE-03 DoD 硬口径全进 CI |
| 安全评审 #2 | Tenant Context 来源接缝 | BE-04 DoD（JWT-only + 负向测试）+ BE-09 前置 |
| 安全评审 #3 | fail-closed 边界未定义 | SPK-OPA DoD |
| 安全评审 #4 | 供应链引入策略 | BE-02 DoD 供应链基线 |
| 安全评审 #5 | 真实 Key 路径 | SPK-MGW DoD |
| 安全评审 #6 | 无 WIP 上限 | §2 WIP 规则 |
| 安全评审 #7 | DLQ 可见性 | BE-05 DoD |
| 安全评审 #8 | compose 端口全网卡绑定 | BE-02 DoD（127.0.0.1） |
| Codex #2 | 身份表不得一刀切租户化 | BE-03 表集所有权注记 |
| Codex #3 | Outbox envelope 与契约不符 | BE-05 DoD（不含 idempotency_key，checkpoint 去重） |
| Codex #4 | 策略实体缺持久化 | BE-04 迁移补 PermissionGrant/WorkspacePolicy/ApprovalRule/ControlSwitch；Brand→BE-09A |
| 治理评审（v2 复审）#1-8 | Gate 3 残余矛盾 / GDR-001 适用范围 / OD 状态图例 / Spike 产物边界 / WIP 精确化 / 「推进」定义 / ROADMAP 旧行 / DoD 含糊 | RELEASE_GATES+_TEMPLATE 补例外注；GDR-001 补范围条款；OPEN_DECISIONS 加图例；§2 Spike 产物边界与 WIP/推进判定标准；ROADMAP 去风险线行更新；BE-01β DoD 精确化 |

—— **合并条件**：治理评审 Agent 对本 v2 出具结论且无未处置 BLOCKER → 业务负责人回复批准合并。合并后：BE-01α 开工（R2）；SPK-TMP/OPA/MGW 可并行启动。
