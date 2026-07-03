# 开发路线图（v2.1 母本的执行拆分）

## 当前状态（滚动更新）

```text
Product Baseline:            v2.1 Approved（Approved for Dev Planning，非 All Epics Dev-Ready）
P0 Contracts:                Core Batch 1 完成（五域 46 Schema；CRT/PUB/ENG 等域待补 = M1 前置）
Demo Gap Analysis (V-001):   完成
EPIC-M0-01 数据与术语:        ✅ MERGED（PR #1，main CI 通过 752e499）
EPIC-M0-02 治理组件:          ✅ MERGED（PR #2，main CI 通过 4e1df03）
Development Operating System: ✅ MERGED（PR #3，79638f7）；PDR-003 不升级 Pro 已登记（PR #7）
EPIC-M0-03:                  ✅ MERGED（PR #13，main CI 通过 5ba076c）；Codex 审查修正 PR #14 已合并
EPIC-M0-04:                  ✅ MERGED（PR #15，main CI 通过）
EPIC-M0-05..06:              M0-05 下一个
架构去风险线（并行 Spike）:     文档就绪（OSS registry+Temporal 卡）；Spike 真跑需 M1 环境
Foundation 状态:              设计/契约/校验基线已立；运行时实现（PG/RLS/Outbox/OPA/Temporal/认证）属 M1
GitHub 治理:                  仓库已公开（PDR-004）；main ruleset 生效（PR 必经+verify 必绿+仅 squash+禁 force push）；
                             Codex 自动代码审查已启用；Actions 升级 #4/5/6 已合并
```

- **本文性质：** 母本 v2.1 的开发执行拆分与状态追踪，随开发滚动更新。产品真相以母本为准，本文只回答"什么顺序、拆成哪些 PR、现在做到哪了"。
- **交付纪律（CLAUDE.md）：** 每个 Epic 先 plan mode 经 Owner 批准；一个 PR 一个清晰问题；合并前 `/code-review` + `/security-review`；受保护路径改动走审批。
- **主开发方式：** Claude Code 开发，feature 分支 → PR → 审查 → 合并 main。

## 总节奏（母本 13.2 Release × 13.8 Wave × 15.10/附录 N Epic）

```
M0 原型（当前）→ Gate 1 用户验证 → M1 全域 Alpha（开源接入主战场）→ Gate 2-4 → M2 真实试点 → Gate 5 → M3 商业化
```

## M0：可点击原型（全模拟，apps/prototype）

来源：Readdy 前端经 Gap Analysis 审计后改造（docs/demo-gap/Demo_Gap_Analysis_v1.md，86 项判定）。

按业务评审重切为六个 Epic（初始包见 docs/epics/EPIC-M0-*.md）：

| Epic | 内容 | 状态 |
|---|---|---|
| EPIC-M0-01 数据与术语 | fixtures/结果链/枚举/合规清理/导航 | ✅ [PR #1](https://github.com/mlhjyx/global-growth-workspace/pull/1) MERGED |
| EPIC-M0-02 治理组件 | Evidence/Approval/DryRun/Badges/八态 + Today 接入 + 治理体系骨架 | ✅ [PR #2](https://github.com/mlhjyx/global-growth-workspace/pull/2) MERGED |
| EPIC-M0-03 研究与知识页面 | PG-003/004 研究页（最大件）、Claim 审核台、ICP 回测/查询预览 | ✅ [PR #13](https://github.com/mlhjyx/global-growth-workspace/pull/13) MERGED |
| EPIC-M0-04 客户/Campaign/执行 | Score Explain+四队列+Suppression、Campaign DryRun 接入（M0-02 遗留）、Today 目标启动器+系统健康区、Content/Video/Publish 占位升级 | ✅ [PR #15](https://github.com/mlhjyx/global-growth-workspace/pull/15) MERGED |
| EPIC-M0-05 Engage/Opportunity/Insight | Inbox Context 面板、三级结果链视图、成本/归因补强、Expert/Ops 低保真占位 | ⬜ 下一个 |
| EPIC-M0-06 旅程与验证基础 | J-A/J-B 串线、埋点、Preview 部署、UAT 脚本、Gate 1 Report 模板 | ⬜ |

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

## 架构去风险线（与 M0 并行，不进入 M0 界面；决定 M1 是否需要重新设计）

独立 Spike Epic，每个产出验收卡（母本附录 L）并回写 OSS Registry 状态：

| Spike | 验证什么 | 对应验证项 |
|---|---|---|
| Temporal Runtime | 本地起集群、审批等待 Signal、Workflow 版本化、故障恢复 | ADR-002 落地确认 |
| OPA Policy | Policy Contract 编译执行、Fail-Closed、决策审计 | 9.9/12.10 |
| LiteLLM Model Gateway | 多模型路由、故障切换、预算、自有 Contract 封装 | ADR-007 |
| Langfuse Trace/Eval | 脱敏 Trace、Prompt 版本、Golden Set 数据集 | 9.10 |
| Docling 解析 | 中英 PDF/官网解析准确率、隔离部署 | V-004 前置 |
| AiToEarn Capability Matrix | OAuth/发布成功率/评论回流/多租户/限流 | **V-002** |
| MoneyPrinterTurbo 视频 | 三类视频/三比例/权利元数据/失败恢复 | **V-003** |
| Crawler Bake-off | Crawl4AI vs Firecrawl API vs Playwright 基线，50 站点 | **V-005** |
| 知识层 Bake-off | Cognee/Graphiti/pgvector 按 10.5.5 数据集对比 | **V-004** |

## M2：真实试点（6-10 家 Design Partner，光伏/建材 × 东南亚/非洲，PDR-001）

- 过 Gate 的开源组件升生产；数据供应商合同与 Bake-off（V-006，附录 H 尽调）；邮件基础设施（V-007）；平台 App Review（V-008）
- 真实受控执行：小规模、可暂停、Kill Switch
- **退出条件（13.6）：** ≥50% 试点 30 天内产生 SAO；未授权外部动作=0；成本可解释

## M3：商业化

计费/套餐/毛利、SSO/SCIM、SLA/灾备、Pack Studio、专属部署。

## 阻塞项追踪（业务负责人决策，命中即停）

对应 Epic 编码前必须关闭（不阻塞基础工程；含业务评审补充的细化项）。**每项决策标注最晚关闭点，过点未关则对应 Epic 停止进入编码**：

| 决策 | 最晚关闭点 |
|---|---|
| 外联只做草稿 vs 试点真发送 | M1 Outreach Dev-Ready 前 |
| 首批发布平台（M2 四个） | Publish Adapter Spike 前 |
| 首批互动回流平台（M2 两个） | Engage Spike 前 |
| 首批数据源组合（贸易+企业/联系人+邮箱验证） | Data Hub M1 实现前 |
| 首批 3 个 Market Pack 国家 | M0 用户测试前 |
| 试点商务模式 | M2 客户招募前 |
| 代理商多 Workspace 模式是否首批 | Workspace M1 Schema 冻结前 |
| 私有化是否进入 M3 | M2 架构冻结前 |


| # | 决策 | 阻塞什么 | 状态 |
|---|---|---|---|
| 1/2 | 首批行业/区域（含首批 2 个 Industry Pack） | fixtures、Pack、试点画像 | ✅ PDR-001 |
| 2a | 首批 3 个深度 Market Pack（国家级，区域内收敛） | M1 W2 研究/Pack Epic | 开放（由 Market Scan+试点客户定） |
| 2b | 首批 3 个 Growth Motion Pack | M1 W3 Campaign Epic | 开放（候选：GM-TRD/GM-DIST/GM-ABO） |
| 3 | M2 的 4 个发布平台 + 2 个互动回流平台、邮件基础设施 | M1 W4 Adapter 选型与 App Review | 开放 |
| 4 | 外联草稿 vs 真实发送 | M2 发信基础设施与合规链路（工作量差一倍） | 开放 |
| 5 | 试点商务模式 + 首批 Design Partner 与成功阈值 | M2 协议与成功口径 | 开放 |
| 9 | 数据供应商：首个贸易/行业源 + 首个企业/联系人源 + 邮箱验证源 | M1 W2 后期 Bake-off（V-006） | 开放（架构已多源可替换） |
| 10 | AiToEarn 实际复用模块范围 | M1 W4 EPIC-EXEC-001（V-002 Spike 后定） | 开放 |
| 11 | Temporal 正式进入 M1 确认；Cognee/Graphiti/pgvector Bake-off 方案 | M1 W1/W2 | 开放（ADR-002 已 Approved，落地时确认） |

## 已完成记录

- ✅ 契约地基：五域 46 Schema + 5 AsyncAPI + 5 OpenAPI + 11 状态机（含 SAO 断链修复）+ 195 条 fixtures + Company Understanding Task 打样（commit 72b83bf）
- ✅ 开发底座：monorepo + CLAUDE.md + hooks + ADR-100~104 + CI + GitHub 私有仓库
- ✅ PDR-001 试点范围决策；v2.1 母本一致性修订
- ✅ Readdy Demo Gap Analysis（V-001 主体关闭）+ apps/prototype 导入（commit a78bf5f）
