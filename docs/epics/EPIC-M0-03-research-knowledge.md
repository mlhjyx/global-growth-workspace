# EPIC-M0-03 研究与知识页面（Dev-Ready 初始包·原型减免）
- Release/Wave：M0；Requirement：MKT-001~013、KNW-001~011、LED-001~005；风险 R1
- 阻塞决策：无（Market Pack 国家收敛 OD-02 不阻塞原型，用候选国家演示）

## 范围
1. **PG-003 Global Market Scan**（新建，本 Epic 最大件）：市场候选卡（分维度评分+证据，禁单一黑盒分）、区分事实/供应商自述/推断/未知、选择进入深度研究
2. **PG-004 Market Research Workspace**（新建）：Research Brief、问题树（状态+证据）、Evidence Panel（复用 EvidenceDrawer）、市场对比、Action Outputs（一键转 ICP/Campaign 草案）
3. **PG-002 Claim 审核台**（重做 knowledge 页）：来源列表→候选 Claim 审核（INGESTED→APPROVED 生命周期）→冲突解决→有效期；现文档库降级为帮助中心
4. **ICP Builder 升级**：补 Sample Backtest 与 Query Preview 区（LED-004/005）
## 不做
真实数据源/爬虫；研究任务真实执行（全 mock，来自 fixtures.claims/icpDefinitions + 新增研究 mock）
## UI 状态
每页 Empty/Loading（分阶段）/Partial/NeedsReview 必做（PageState 组件）
## 数据
mock 派生自 contracts fixtures；研究对象（MarketCandidate/Thesis）按母本 7.3.2 形状造 mock（M1 建正式契约）
## 任务拆分
T1 市场扫描页 → T2 研究工作台 → T3 Claim 审核台 → T4 ICP 升级 → 每 T 一次提交，合计一个 PR
