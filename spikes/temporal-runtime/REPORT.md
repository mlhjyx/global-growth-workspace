# SPK-TMP Temporal Runtime Spike — 验证报告 + 验收卡草稿

- **Spike 编号**：SPK-TMP（M1 计划 §3，R1；对应 BE-01β Temporal 段与后续执行链 Epic）
- **执行日期**：2026-07-04（本地 Windows 11 / Docker 29.5.3 / Node v24.14.1）
- **产物位置**：`spikes/temporal-runtime/**`（未触碰 packages/**、apps/**、.github/**、docs/**）
- **结论**：**PASS（DoD 核心「杀 Worker 后 Workflow 恢复完成」已真实验证）**；版本化仅做基线验证（patched 标记 + replay），完整新旧代码矩阵为 TODO。验收卡回写 `docs/oss/` 由后续 PR 完成。
- **约束提醒（M1 计划 F 项）**：Spike 批准 ≠ 生产采用。Temporal 上生产仍须 License/Security Review + Production Gate。

## 1. 环境与版本（全部真实运行）

| 组件 | 版本 | 说明 |
|---|---|---|
| temporalio/auto-setup | 1.25.2 | Temporal Server，gRPC 127.0.0.1:7233 |
| postgres | 16-alpine | Temporal 持久化专用库，127.0.0.1:5433（避开仓库 dev compose 的 5432） |
| temporalio/ui | 2.31.2 | http://localhost:8233 |
| @temporalio/{client,worker,workflow,activity} | 1.19.0 | TS SDK，tsx 直跑，独立 package.json（未入 pnpm workspace） |

起停：

```bash
docker compose -f spikes/temporal-runtime/docker-compose.yml up -d
npm --prefix spikes/temporal-runtime install
npm --prefix spikes/temporal-runtime run health    # 等待就绪
npm --prefix spikes/temporal-runtime run worker    # Worker
# 场景 CLI：start-wf / query / signal / describe / result / replay
docker compose -f spikes/temporal-runtime/docker-compose.yml down   # 清理
```

## 2. Workflow 骨架：CampaignDryRunApproval

链路（activities 全 mock）：
`DryRun → 生成 ActionProposal → PolicyCheck → 等待人工审批 Signal 'approvalDecision'（Timer 超时 = RETURNED）→ 签发 ExecutionAuthorization → Mock 执行 → Result`；执行永久失败走 Saga 补偿 `revokeAuthorization → COMPENSATED`。

设计对齐硬边界 #1：审批决定来自外部 Signal（人），workflow 只做确定性编排；所有对外动作先有 Proposal → Policy → Authorization 才执行。

## 3. 已真实跑通的验证（含证据）

### V1 集群启动（compose 起集群）— PASS
`docker compose up -d` 后三容器 Up（postgres healthy），`health.ts` 确认 `describeNamespace(default)` 返回 state=1（Registered）。

### V2 Worker 运行 — PASS
Worker 连接 localhost:7233，workflow bundle（webpack）编译成功，taskQueue=`spk-tmp-campaign` 进入 RUNNING。

### V3 Signal 审批 Happy Path — PASS
`spk-tmp-happy-1`：query 得 `AWAITING_APPROVAL` → 发 Signal `approvalDecision{approved:true}` → 结果 `status="AUTHORIZED"`，含 dryRunId/proposalId/authorizationId/execution 全链 ID。

### V4 审批超时 = RETURNED — PASS
`spk-tmp-timeout-1`（approvalTimeoutMs=5000，不发 Signal）：`wf.condition(..., timeout)` 到期，结果 `status="RETURNED"`，reason=`approval timeout after 5000ms`。

### V5 Activity Retry + 幂等 — PASS
`spk-tmp-flaky-1`（--flaky）：policyCheck 在「副作用已落幂等存储之后」抛瞬时异常，Temporal 按 retry policy（1s 起、指数退避、上限 5 次）自动重试；attempt=2 命中幂等存储直接返回缓存决策。结果 `policyAttempts=2, policyIdempotentHit=true`；`state/idempotency-store.json` 中该 key 只有一条副作用记录。
幂等模式：所有 activity 携带确定性 `idempotencyKey = {workflowId}:{step}`，副作用先写存储（spike 用本地 JSON 文件模拟「PG 表 + 唯一键」，生产应换 PG + workspace_id + 唯一约束）。

### V6 杀 Worker 后恢复（DoD 核心）— PASS
`spk-tmp-recover-1` 全程：
1. 启动后 query=`AWAITING_APPROVAL`（前 3 个 activity 在 Worker pid=1476 执行）；
2. `taskkill /F /PID 1476` 强杀 Worker，tasklist 确认进程消失；
3. Worker 宕机期间：`describe` 服务端状态仍 `RUNNING`（historyLength=23），**发 approve Signal 成功被服务端接收**（historyLength→25）；
4. 重启新 Worker（pid=40292）：workflow 从 event history 重放恢复，继续执行 authz + exec 两个 activity（日志证实在 pid=40292 上执行，且 dryRun/proposal/policy **未被重复执行**——幂等存储各 key 仅一条记录）；
5. 最终结果 `status="AUTHORIZED"`，服务端 `COMPLETED`（historyLength=45）。

### V7 Saga 补偿 — PASS
`spk-tmp-comp-1`（--exec-fail）：mockExecute 抛 `ApplicationFailure.nonRetryable`（不触发重试），workflow 捕获后执行补偿 activity `revokeAuthorization`（worker 日志证实执行），结果 `status="COMPENSATED"` 且带被撤销的 authorizationId。

### V8 确定性 Replay（版本化基线）— PASS
`replay.ts` 用 `fetchHistory + Worker.runReplayHistory` 把 `spk-tmp-happy-1` 与 `spk-tmp-recover-1` 的**真实服务端历史**在当前 workflow 代码上重放，均通过（无 NDE 非确定性错误）。代码中已埋 `wf.patched('spk-tmp-authz-v2')` 版本标记，两条历史均含 marker（结果 `authzVersion="v2"`），replay 兼容。

## 4. 未验证 / TODO（如实记录）

| 项 | 状态 | 说明 |
|---|---|---|
| 版本化完整矩阵 | **TODO** | 未做「旧代码产生历史 → 部署含 patched 新代码 → 旧历史 replay 走 v1 分支、新执行走 v2」的双版本演练；本次只验证了 marker 写入 + 同代码 replay 兼容。Worker Versioning（Build ID）完全未测。 |
| Temporal Server 重启后 Workflow 存活 | **TODO** | 只杀了 Worker，未做 `docker restart spk-tmp-temporal` 后等待中 Workflow 继续的验证（PG 持久化理论保证，未实测）。 |
| 杀 Worker 时机 = activity 执行中 | **TODO** | 本次在 AWAITING_APPROVAL（Timer/Signal 等待）时杀；未覆盖「activity 运行到一半杀 Worker → startToClose 超时 → 重试到新 Worker + 幂等吸收」的时序。 |
| 幂等存储生产形态 | **TODO** | spike 用本地 JSON 文件；生产需 PG 表（workspace_id + idempotency_key 唯一约束），随 Outbox/执行链 Epic 落地。 |
| 多 Worker 并发 / Sticky Queue 行为 | **TODO** | 单 Worker 验证；未测多 Worker 抢占与 sticky cache 失效路径。 |
| Signal 与超时竞态 | **TODO** | 未构造「Signal 恰好在 Timer 到期同 tick 到达」的边界用例。 |
| 安全基线 | 部分 | compose 端口全部绑 127.0.0.1（对齐安全评审 #8 口径）；未配 TLS/认证（本地 spike 可接受，生产 Gate 项）。 |

## 5. 验收卡草稿（回写 docs/oss/ 用，后续 PR）

```yaml
acceptance_card:
  id: OSS-ACC-TEMPORAL-001        # 编号由 docs/oss/ 注册表统一分配，此处为草稿占位
  spike: SPK-TMP
  component: Temporal (Server temporalio/auto-setup:1.25.2 + TypeScript SDK 1.19.0)
  role: 长时执行编排运行时（Campaign 执行链：Proposal→Approval→Authorization→Execution）
  verdict: PASS-WITH-TODOS
  verified:
    - compose 单机集群（postgres 持久化）启动即用，端口 127.0.0.1 绑定
    - Workflow 骨架 CampaignDryRunApproval 全链路（activities mock）
    - Signal 等待：人工审批 approvalDecision Signal 驱动状态推进
    - Timeout：wf.condition 超时 → RETURNED（审批超时退回语义）
    - Retry：activity 瞬时故障按策略自动重试（指数退避）
    - Activity 幂等：确定性 idempotencyKey + 副作用先落存储，重试/恢复不重复副作用
    - 补偿：非重试性执行失败 → Saga 撤销授权 → COMPENSATED
    - Worker 崩溃恢复（DoD 核心）：等待 Signal 期间强杀 Worker；宕机期 Signal 由
      Server 暂存；新 Worker 从 history 重放恢复并完成，前序 activity 不重复执行
    - 确定性 replay：真实历史 runReplayHistory 通过；patched() 版本标记落 history
  todos:
    - 版本化双版本矩阵（旧历史 × 新代码）与 Worker Build ID versioning
    - Temporal Server 重启存活实测；activity 执行中杀 Worker 的时序
    - 幂等存储换 PG（workspace_id + 唯一约束）；多 Worker 并发；TLS/认证
  production_gate: 未过。License(MIT)/Security Review + Production Gate 仍必需（F 项）。
  evidence: spikes/temporal-runtime/REPORT.md §3（workflowId：spk-tmp-happy-1 /
    timeout-1 / flaky-1 / recover-1 / comp-1，历史可在本地 UI http://localhost:8233 复查）
```

## 6. 对 BE-01β / 后续 Epic 的输入

1. **审批等待就该建模为 Signal + Timer**：RETURNED 语义天然映射「审批超时退回」，无需自建轮询。
2. **Worker 完全无状态**成立：恢复只依赖 Server history + 幂等存储，Worker 可随意滚动重启——部署形态可以是普通无状态容器。
3. **Activity 幂等必须是一等公民**：Temporal 的 at-least-once 语义要求每个有副作用的 activity 都带确定性幂等键；建议把 `{workflowId}:{step}` 模式定为契约字段。
4. **workflow 代码改动必须过 replay 门**：建议 CI 对存量 golden histories 跑 runReplayHistory，配合 patched() 做版本演进。
