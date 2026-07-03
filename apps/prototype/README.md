# @ggw/prototype — M0 可点击原型（一次性）

**定位（不可漂移）：**

- 这是 **M0 全模拟原型**（母本 13.2/13.3、15.11），用于验证「从目标到商机」的完整业务旅程和客户可用性，是 Gate 1 用户测试的材料。
- **不演进为生产前端。** M1 生产 App Shell 按 ADR（母本 11.2）在 `apps/web` 以 Next.js 重建；本原型只输出设计令牌、组件形态和 mock 数据形状。
- 来源：Readdy 平台生成前端（project-11645859），已通过逐页 Gap Analysis 审计——**86 项判定与改造清单见 [docs/demo-gap/Demo_Gap_Analysis_v1.md](../../docs/demo-gap/Demo_Gap_Analysis_v1.md)**，改造必须以该文档 + 母本页面规格为准，不得以 Demo 现状反推需求（母本 6.14）。

**已知与母本的关键差距（改造主线）：**

1. 治理层为零：审批/Dry Run/授权、Evidence·Cost·Policy 徽章、八态、审计——全部待建
2. 数据模型错位：mock 需全部替换为 `packages/contracts/fixtures`（三级结果链、状态机、六维评分、PDR-001 行业）
3. 整页缺口：研究页（PG-003/004）、Video Studio、Expert Workspace、Operations Console、Claim 审核台等
4. 需求级错误已判定不得沿用：D-019 违规文案、OPEN DECISION #3 平台预设、CRM 主库颠倒、广告口径

**运行：**

```bash
pnpm --filter @ggw/prototype dev     # http://localhost:3000
pnpm --filter @ggw/prototype build
```
