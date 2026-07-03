# M1 Backend Foundation 启动计划（双轨并行，Sprint 0）

> **状态：PENDING APPROVAL——业务负责人批准前，本计划不生效，后端运行时编码不启动。**
> 依据：业务负责人 2026-07-04 指令（转发外部审计并确认）："不要停止 EPIC-M0-05/06，从现在开始改为两条并行主线……先提交计划供我批准。"
> 批准后：本文件状态改 APPROVED，ROADMAP 增加 Track B 行，BE-01 开工。

## 1. 后端就绪度审计（事实盘点，2026-07-04）

**结论：后端的契约与架构设计资产已完成第一批；后端运行时代码 0 行，未开始。**
Schema/ADR/fixtures/Mock/原型页面均不构成"后端已完成"的任何部分。

### 1a. 已完成——设计/契约资产（可复用为运行时的输入）

| 资产 | 位置 | 状态 |
|---|---|---|
| 五域 JSON Schema ×46（workspace/knowledge/lead/campaign/opportunity + common envelope/field-evidence/primitives） | packages/contracts/schemas | ✅ Ajv 全编译 |
| OpenAPI 3.1 ×5（Idempotency-Key/乐观锁/统一错误/cursor 分页） | packages/contracts/openapi | ✅ |
| AsyncAPI 事件 ×5（含 correlation/causation/workspace_id envelope） | packages/contracts/asyncapi | ✅ |
| 状态机 ×11（含 SAO 链修复、ExecutionAuthorization 生命周期） | packages/contracts/state-machines | ✅ |
| fixtures ×195（$schema_ref 强校验，光伏/建材×东南亚/非洲） | packages/contracts/fixtures | ✅ CI 校验 |
| AI Task 打样 1/14（Company Understanding：Contract+Prompt+Golden Set） | packages/evals | ✅ 模板 |
| ADR-100~104 + 架构薄文档（C4/bounded-contexts/data-ownership/event/deployment/integration） | docs/architecture | ✅ 基线 |
| 本地依赖编排（pgvector/pg16 + Redis） | infra/docker-compose.dev.yml | ✅ 仅 dev |
| 工程治理（R0-R3、ruleset、Codex 独立审查、CI verify 含真实 typecheck+build） | docs/program + .github | ✅ 运行中 |
| EPIC-FOUNDATION Dev-Ready 包 | docs/epics/EPIC-FOUNDATION.md | ⬜ 骨架（11 段大部分未填）|

### 1b. 未开始——后端运行时（0 行代码）

apps/api（NestJS）· Prisma Schema/迁移 · Workspace/Tenant Context · RLS 及其测试 · 认证/Session/JWT · RBAC/ABAC · OPA Policy Runtime · Approval Runtime · Transactional Outbox/事件消费者/DLQ · Temporal Worker · Model Gateway（LiteLLM 内核）· Langfuse Trace · Object Storage · 真实 API Contract Test · 运行时审计日志。packages/policy 目前仅 README 占位。

## 2. 双轨模型与后端依赖图

```text
Track A 产品验证（不停）：EPIC-M0-05 → EPIC-M0-06 → Preview 部署 → 用户测试 → Gate 1
Track B 后端去风险（新启）：BE-01 → BE-02 → BE-03 → BE-04 → BE-05 → {BE-06, BE-07, BE-08 可并行} → BE-09

依赖关系：
BE-01 Foundation Dev-Ready（R2 批准）
  └─ BE-02 apps/api 骨架
       └─ BE-03 PG/Prisma/Workspace/RLS ──┬─ BE-04 Auth/RBAC/审计
                                          ├─ BE-05 Outbox/事件运行时
                                          └─ BE-06 OPA Spike（依赖 BE-04 的动作模型）
BE-07 Temporal Spike（仅依赖 BE-02 + docker-compose，可提前并行）
BE-08 Model Gateway Spike（仅依赖 BE-02，可提前并行）
BE-09 第一条纵向切片（依赖 BE-03/04/05 + BE-06/07 的 Spike 结论）
```

**执行方式（单执行体的"并行"= 小单元穿插）**：同一时段两轨都有可合并产出；默认节奏为一个 M0 单元 + 一个 BE 单元交替。**冲突时 Track A 优先**——Gate 1 用户测试时间不因后端推迟。

## 3. 后端 PR 计划

| PR | 内容 | 前置 | R 级 | 完成定义（DoD 摘要） |
|---|---|---|---|---|
| BE-01 | 补全 EPIC-FOUNDATION 至 **Production Dev-Ready 档**（C4 落细/Bounded Context/Core ERD/Tenant+Auth+RBAC 模型/API·Error·Versioning/Outbox·幂等/OPA/Temporal/Model Gateway/可观测/测试策略/威胁模型/迁移回滚/部署拓扑） | 本计划批准 | **R2** | 11 段无 ⬜；业务负责人评审通过才进 BE-02 |
| BE-02 | apps/api NestJS 骨架：health/readiness、/api/v1、request-id+correlation-id、统一错误模型（对齐 contracts）、ValidationPipe、结构化日志、OpenAPI 输出、Config 校验、优雅停机；**不含业务** | BE-01 批准 | R1 | 本地起服务过冒烟；CI 纳入 api 的 lint/typecheck/build/test |
| BE-03 | Prisma + PostgreSQL：Organization/Workspace/User/Membership/Role/AuditEvent/FeatureFlag/Budget/Quota；全表 workspace_id；Tenant Context 服务端解析（不信任前端）；唯一键含租户；Repository 默认 Workspace Scope；**RLS 策略 + 双租户隔离测试**；迁移可回滚 | BE-02 | **R2**（迁移） | 隔离测试红→绿证明 RLS 生效；迁移 up/down 均验证 |
| BE-04 | 认证/授权/审计：Auth Adapter（本地 dev IdP，先不定最终供应商）、Session/JWT 校验、Workspace 切换、RBAC、PolicyDecision 接口（先规则内置）、AuditContext、敏感动作审计、统一 403 模型 | BE-03 | **R2**（Auth） | 权限矩阵测试；审计事件落 PG |
| BE-05 | Transactional Outbox：业务事务→outbox 表→Publisher→Consumer→重试→DLQ；envelope 按 contracts（schema_version/correlation/causation/workspace_id/idempotency_key）；consumer checkpoint + replay。**不上 Kafka**，PG Outbox + Worker | BE-03 | **R2**（迁移+事件契约） | 事件消费幂等测试；DLQ 重放演示 |
| BE-06 | OPA Policy Spike：ActionProposal/ExecutionAuthorization/导出/对外发送/发布/删除/跨境模型调用的 Allow·Deny·RequireApproval；**Fail-Closed**；决策审计。产出 Spike 验收卡回写 OSS Registry | BE-04 | **R2**（packages/policy） | 默认审批集全部 RequireApproval；OPA 宕机=全拒 |
| BE-07 | Temporal Runtime Spike：docker-compose 起集群；首个 Workflow = `Campaign Draft→Dry Run→ActionProposal→Policy→人工审批(Signal)→ExecutionAuthorization→Mock 执行→Result`；验证 Retry/Timeout/补偿/Worker 重启恢复/版本化/Activity 幂等 | BE-02（可与 03-05 并行） | R1（Spike，不入生产路径） | 杀 Worker 后 Workflow 恢复并完成；验收卡回写 |
| BE-08 | Model Gateway Spike：自有 ModelGateway 接口 + TaskRegistry/PromptRegistry/路由策略/BudgetGuard/脱敏/StructuredOutput/Fallback/Trace（LiteLLM 为内核候选、Langfuse 为 Trace 候选，业务代码只依赖自有 Contract） | BE-02（可并行） | R1（Mock/本地模型）；**接真实模型 API=触发跨境模型调用审批（OD-13）** | Mock Provider 全链路 Trace；预算超限熔断测试 |
| BE-09 | **第一条真实纵向切片**（见 §4） | BE-03/04/05 + 06/07 结论 | **R2** | §4 验收全过 |

每个 BE Epic 编码前按 CHANGE_CONTROL 完成 **Production Dev-Ready 档**包（BE-01 即 Foundation 的；BE-09 单独出包）。禁止事项沿用硬边界：不过早微服务化、不直连 Provider SDK、PG 为业务事实源、不跳过 RLS/审计/幂等/测试/回滚。

## 4. 第一条纵向切片设计（BE-09）

```text
Workspace → Company(Claim/Evidence) → ICP → Lead → Campaign → Dry Run → ExecutionAuthorization → Opportunity
```

| 层 | 真实 or Mock |
|---|---|
| 数据库/迁移/RLS/审计/幂等 | **真实**（PG，按 contracts Schema） |
| API（NestJS，OpenAPI 契约） | **真实**，响应必须通过 packages/contracts 对应 Schema 校验（契约测试） |
| 状态机（lead/campaign/execution-authorization/opportunity） | **真实**，非法迁移必须被拒 |
| 审批（Dry Run→授权） | **真实**运行时（BE-06/07 结论决定 OPA+Temporal 或先规则+队列） |
| 数据 Provider / AI / 外部执行 | **Mock Adapter / Sandbox Adapter**（接口按 contracts，随时可换真） |
| 前端 | M0 原型不改造（继续 mock 演示）；切片验收走 API 级 E2E + seed 脚本；M1 apps/web（Next.js）才接真实 API |

**验收**：① 两个 Workspace 数据完全隔离（RLS 测试）；② 从建 Workspace 到 Opportunity 全链 API 打通且每步过契约校验；③ Dry Run 未授权时执行接口被 Policy 拒绝（Fail-Closed）；④ 每个外部动作有 ActionProposal+审计记录；⑤ Campaign 与 Opportunity 仅以 ID/事件关联（D-009 验证）；⑥ 迁移全部可回滚。
**切片要回答的问题**：契约是否可实现、实体是否过重、隔离是否完整、Campaign/Opportunity 是否真解耦、前后端是否说同一种语言。

## 5. 需要业务负责人拍板的事项

| # | 事项 | 建议 | 阻塞什么 |
|---|---|---|---|
| A | **批准本计划**（双轨 + BE-01..09 序列） | 批准 | Track B 启动 |
| B | OD-11 代理商多 Workspace | **不阻塞方案**：按契约现状实现（Organization→Workspace→Membership 已支持一人多 Workspace），商业打包后置 | BE-03 Schema 冻结 |
| C | OD-13 默认审批集确认（对外发送/发布、数据导出、跨境模型调用、删除/Suppression） | 按默认集编 OPA | BE-06 |
| D | M1 运行环境 | 本地 docker-compose（零成本），云部署 M2 前再定 | BE-02+ |
| E | 认证最终 IdP 供应商 | M1 用本地 dev IdP，最终供应商登记为新 Open Decision（不阻塞） | 仅 M2 前 |
| F | Temporal/OPA/LiteLLM/Langfuse 按既有 ADR 候选直接 Spike | 确认（无新决策，结果回写 OSS Registry） | BE-06/07/08 |
| G | 节奏：冲突时 M0 优先、Gate 1 不推迟 | 确认 | 排期 |

—— 批准方式：回复"批准计划"（可附对 B-G 的单项修改）。批准后我将：合并本 PR → ROADMAP 增加 Track B 状态行 → 开始 BE-01。
