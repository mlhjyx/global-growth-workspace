# OSS 交付卡：Temporal

- **用途 / 决策：** Durable Workflow 引擎；**Integrate**（母本 ADR-002 APPROVED）
- **接入 Adapter Contract：** WorkflowProvider（packages/contracts/adapters-workflow，M1 建）
- **进入 Release / 验证项：** M1 W1；无独立 V-xxx（ADR-002 已批准，落地时确认 HA/备份）

## 1. Assessment
解决：市场研究、多 Provider 补全、视频生产、审批等待、Campaign 执行、邮件序列、数据删除、专家 SLA 等跨分钟/小时/天、需恢复和补偿的流程（母本 8.9.1）。不解决：短时可重建任务（归 BullMQ/Redis）。成熟度高，CNCF 生态。与架构无冲突：业务主状态仍在 PostgreSQL，Temporal 只存编排状态。

## 2. License Review
Temporal Server：MIT。SDK（TS/Go）：MIT。无企业目录强制。商业 SaaS 使用合规。CLM-012（母本附录 F）。

## 3. Security Review
自托管需隔离 namespace + mTLS；Web UI 鉴权；Worker 到 Server 的连接加密。无重大已知 CVE 阻断项（实施时重查）。Secret 不入 Workflow History。

## 4. Adapter Contract
```
WorkflowProvider: start(workflowId, input, idempotencyKey) / signal / query / cancel / getStatus
```
Workflow Code 确定性；Activity 幂等+重试+错误分类；人工审批用 Signal；版本用 Workflow Versioning；Workflow ID 稳定关联 Campaign/Job/Request（母本 8.9.3）。

## 5. Spike Plan
用例：① Campaign 多步执行 + 审批等待 Signal；② 多 Provider Waterfall 补全 + 部分失败恢复；③ 数据删除跨 Provider 编排；④ SAO 7/30/90 天定时回写（补母本 9.8）。通过阈值：故障注入后可恢复、幂等无重复副作用、Workflow 版本升级兼容运行实例。

## 6. Spike Result ⬜
待 M1 Docker 环境执行。

## 7. Production Gate ⬜
待 Spike 通过 + HA/备份/重放演练 + Runbook（母本 8.9.4）。

## 8. Upgrade
锁定 Server/SDK 版本；升级先过 Compatibility 环境 + 契约测试；运行中 Workflow 排空或迁移策略。

## 9. Exit Plan
替代：自建状态机（简单流程）或其他 Durable 引擎。业务主状态在 PG，退出不丢业务数据；先完成运行中 Workflow 排空。
