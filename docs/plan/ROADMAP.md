# 开发路线图（v2.1 母本的执行拆分）

- **本文性质：** 母本 v2.1 的开发执行拆分与状态追踪，随开发滚动更新。产品真相以母本为准，本文只回答"什么顺序、拆成哪些 PR、现在做到哪了"。
- **交付纪律（CLAUDE.md）：** 每个 Epic 先 plan mode 经 Owner 批准；一个 PR 一个清晰问题；合并前 `/code-review` + `/security-review`；受保护路径改动走审批。
- **主开发方式：** Claude Code 开发，feature 分支 → PR → 审查 → 合并 main。

## 总节奏（母本 13.2 Release × 13.8 Wave × 15.10/附录 N Epic）

```
M0 原型（当前）→ Gate 1 用户验证 → M1 全域 Alpha（开源接入主战场）→ Gate 2-4 → M2 真实试点 → Gate 5 → M3 商业化
```

## M0：可点击原型（全模拟，apps/prototype）

来源：Readdy 前端经 Gap Analysis 审计后改造（docs/demo-gap/Demo_Gap_Analysis_v1.md，86 项判定）。

| PR | 内容 | 状态 |
|---|---|---|
| M0-1 数据与术语层 | mock 全换 contracts/fixtures；三级结果链/状态机/六维评分/意图枚举对齐；删 D-019 违规文案；品牌清理；导航 7→6 | **进行中** |
| M0-2 治理组件 | Evidence Drawer、Cost/Policy Badge、ApprovalCard（差异对比）、Dry Run→授权流（模拟）、八态骨架 | 待开始 |
| M0-3 补缺页面 | 研究页 PG-003/004（最大件）、Claim 审核台、Today 目标启动器+系统健康区、Score Explain+四类队列、Opportunity 三级链视图、Expert/Ops 低保真占位 | 待开始 |
| M0-4 旅程串线 | J-A（光伏→东南亚找客户）、J-B（建材→非洲招经销商）两条旅程全程可点击 | 待开始 |

**M0 退出条件（Gate 1）：** 用户能从目标走完到 Opportunity 全流程；作为 Design Partner 用户测试材料。

## M1：全域 Alpha（生产代码 + 开源接入，沙箱执行）

前置：补 CRT/PUB/ENG 域契约（受保护路径，plan mode）；apps/web（Next.js）与 apps/api（NestJS+Prisma+PG）落地，M0 原型只迁移设计令牌与组件形态。

| Wave | 产品 Epic | 开源/资产 Epic（附录 N，各过 13.7.1 Gate） | 验证项 |
|---|---|---|---|
| W1 底座 | Workspace/权限/审批/预算（WSP，EPIC-001 级） | **EPIC-WFL-001 Temporal、EPIC-POL-001 OPA、EPIC-AI-001 Model Gateway（LiteLLM 内核）、EPIC-AI-002 Langfuse、EPIC-OSS-001 注册表/SBOM** | — |
| W2 知识与数据 | 企业知识 Claim/Evidence（KNW）、研究（MKT）、Data Hub（DAT） | **EPIC-KNW-001 Docling、EPIC-WEB-001 爬虫平台（Crawl4AI/Firecrawl Spike）、EPIC-KNW-002 Cognee/Graphiti/pgvector Bake-off** | V-004、V-005 |
| W3 客户与战役 | ICP/Lead 六维评分/身份解析（LED）、Campaign/Dry Run/授权（CAM） | — | — |
| W4 内容与执行 | Create/Video（CRT）、Publish/Outbound 沙箱（PUB） | **EPIC-EXEC-001 AiToEarn Adapter Spike、EPIC-VID-001/002 Video Gateway + MoneyPrinterTurbo 改造、EPIC-MED-001 ComfyUI 隔离、EPIC-MED-002 Remotion（先取得商业许可）** | V-002、V-003 |
| W5 互动与专家 | Engage/Inbox/Opportunity（ENG）、Pack 引擎（PAK）、专家流程（EXP） | **EPIC-ENG-001 Chatwoot Connector Spike、EPIC-CON-001 Activepieces（可选）** | — |
| 贯穿 | Analytics 事件/归因（ANA）、AI Task 逐个实例化（Company Understanding 模板已打样） | 每个 AI 功能同交 Task Contract+Prompt+Golden Set | — |

**M1 退出条件：** 测试数据跑通闭环，权限/事件完整；外部执行全部 Sandbox/Dry Run。

## M2：真实试点（6-10 家 Design Partner，光伏/建材 × 东南亚/非洲，PDR-001）

- 过 Gate 的开源组件升生产；数据供应商合同与 Bake-off（V-006，附录 H 尽调）；邮件基础设施（V-007）；平台 App Review（V-008）
- 真实受控执行：小规模、可暂停、Kill Switch
- **退出条件（13.6）：** ≥50% 试点 30 天内产生 SAO；未授权外部动作=0；成本可解释

## M3：商业化

计费/套餐/毛利、SSO/SCIM、SLA/灾备、Pack Studio、专属部署。

## 阻塞项追踪（业务负责人决策，命中即停）

| # | 决策（母本 15.12） | 阻塞什么 | 状态 |
|---|---|---|---|
| 1/2 | 首批行业/区域 | fixtures、Pack、试点画像 | ✅ PDR-001 |
| 3 | 首批发布/邮件平台 | M1 W4 Adapter 选型、M0 原型平台清单标注"待定" | 开放 |
| 4 | 外联草稿 vs 真实发送 | M2 发信基础设施与合规链路（工作量差一倍） | 开放 |
| 5 | 试点商务模式 | M2 Design Partner 协议与成功口径 | 开放 |
| 9 | 数据供应商选择 | M1 W2 后期 Bake-off 范围 | 开放（架构已多源可替换） |

## 已完成记录

- ✅ 契约地基：五域 46 Schema + 5 AsyncAPI + 5 OpenAPI + 11 状态机（含 SAO 断链修复）+ 195 条 fixtures + Company Understanding Task 打样（commit 72b83bf）
- ✅ 开发底座：monorepo + CLAUDE.md + hooks + ADR-100~104 + CI + GitHub 私有仓库
- ✅ PDR-001 试点范围决策；v2.1 母本一致性修订
- ✅ Readdy Demo Gap Analysis（V-001 主体关闭）+ apps/prototype 导入（commit a78bf5f）
