# OSS 交付卡：<项目名>

> 每个开源/外部能力必须交付 9 段（交付要求 #6 / 母本附录 L）。标 ⬜ 的段依赖 Spike 真实环境（M1），不能由文档代替。

- **用途 / 决策（Build/Adapt/Integrate/Buy/Avoid）：**
- **接入 Adapter Contract：**
- **进入 Release / 对应验证项 V-xxx：**

## 1. Assessment（评估）
解决什么问题、不解决什么、成熟度、与现有架构重叠、社区活跃度。

## 2. License Review（许可证）
仓库许可证、企业目录、模型权重/素材版权分别审查；商业 SaaS 使用是否合规。

## 3. Security Review（安全）
已知 CVE、网络隔离要求、Secret、沙箱、供应链（SBOM/固定版本）。

## 4. Adapter Contract（契约）
统一接口定义（落 packages/contracts/adapters-*），业务代码不依赖项目内部模型。

## 5. Spike Plan（计划）
验证用例、数据集、通过阈值、失败判定。 ⬜ 待执行=M1

## 6. Spike Result（结果）⬜
实测数据、是否通过、发现问题。**依赖真实环境，M0 不可得。**

## 7. Production Gate（生产门）⬜
许可证批准 + 安全 Gate + 数据边界 + 契约测试 + 故障恢复 + Owner + Exit Plan，全过方可 M1 Spike→M2 生产。

## 8. Upgrade（升级）
上游版本策略、兼容环境、Fork Patch 记录、安全更新 SLA。

## 9. Exit Plan（退出）
替代项目、迁移方式、数据导出、许可证变化触发条件。
