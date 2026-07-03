# Dev-Ready Package：<EPIC-ID> <标题>

> 每个 Epic 编码前必须完成本包并经评审（交付要求 #2 / 母本 15.13.6 / Gate 3）。未完成不进入编码。
>
> **本模板分两档，标题必须注明用的哪档**（外部审计 2026-07-04 采纳，防"初始包"被当成完整 Dev-Ready）：
> - **Production Dev-Ready（M1 起强制）**：11 段全部必填，不适用写"N/A + 理由"，不减免。
> - **Prototype-Ready（仅 M0 原型可用，标题注明「原型减免」）**：最低必含——用户任务、页面、UI 状态、
>   Mock 来源与契约映射、验收场景、任务拆分、不进入生产的边界；其余段可省。

- **Epic ID / Release / Wave：**
- **覆盖需求 ID（母本第 7 部分）：**
- **Owner（业务/技术）：**
- **依赖的 Open Decision（须先关闭）：**

## 1. Product Requirements
用户价值、范围、明确不做项（Non-goals）、验收结果。

## 2. User Flow
主流程 + 分支 + 异常路径（引用母本第 5 部分闭环阶段）。

## 3. UI States
涉及页面（PG-xxx）与母本 6.10 八态逐一：Empty/Loading/Error/Permission/Partial/NeedsReview/NeedsAction/Blocked。

## 4. Domain Model
实体、字段、状态机、关系、租户范围、PII 分级（引用/新增 packages/contracts）。

## 5. API / Event Contract
OpenAPI 端点 + AsyncAPI 事件 payload + 错误码 + 幂等 + 乐观锁（落 packages/contracts，受保护路径）。

## 6. Permissions
角色×动作×字段矩阵、Policy 动作、审批要求、审计事件。

## 7. Tests
Given/When/Then 验收用例、契约测试、集成、E2E、边界/负向样本。

## 8. AI Eval（若含 AI Task）
Task Contract、Prompt、输入输出 Schema、Golden Set、上线阈值（落 packages/evals）。

## 9. Threat Model
数据流、信任边界、多租户隔离、SSRF/注入/越权、Secret、数据权利风险与对策。

## 10. Rollout / Rollback
Feature Flag、灰度、迁移（可回滚）、回滚步骤、监控与告警。

## 11. Task Breakdown
拆成 Claude Code 可独立执行的 PR 级任务，每个含允许/禁止修改目录、验收、关联需求 ID。
