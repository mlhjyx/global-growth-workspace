# Dependency Map（依赖地图）

外部/开源/Provider 依赖、进入 Release 的 Gate、替换与退出。开源项目详细交付卡见 [docs/oss/](../oss/)；本文件是总览与依赖关系。

## 开源/现有资产（母本第 10 部分 + 附录 D）

| 依赖 | 用途 | 决策 | 接入方式（Adapter） | 进入 Release | 交付卡 |
|---|---|---|---|---|---|
| AiToEarn | Create/Publish/Engage 执行内核 | Adapt+Integrate | ContentExecution/ChannelPublish/EngagementProvider | M1 Spike→M2（V-002） | docs/oss/aitoearn.md |
| Temporal | Durable Workflow | Integrate | WorkflowProvider | M1 W1 | docs/oss/temporal.md |
| OPA | 确定性策略 | Integrate | PolicyProvider | M1 W1 | docs/oss/opa.md |
| LiteLLM | Model Gateway 内核 | Integrate+Wrapper | ModelProvider（自有 Contract） | M1 W1 | docs/oss/litellm.md |
| Langfuse | AI Trace/Eval | Integrate | ObservabilityProvider | M1 W1 | docs/oss/langfuse.md |
| Docling | 文档解析 | Integrate | DocumentParserProvider | M1 W2 | docs/oss/docling.md |
| Crawl4AI / Firecrawl | 公开情报采集 | Integrate(隔离) / Buy(API) | WebCrawlerProvider | M1 W2 Spike（V-005） | docs/oss/crawler.md |
| Cognee / Graphiti / pgvector | 知识关系/记忆 | Spike/Bake-off | KnowledgeMemoryProvider | M1 W2（V-004） | docs/oss/knowledge-graph.md |
| MoneyPrinterTurbo | 视频合成流水线 | Adapt | VideoCompositionProvider | M1 W4 Spike（V-003） | docs/oss/moneyprinterturbo.md |
| ComfyUI | 开源媒体模型 | Isolated Integrate | GenerativeMediaProvider | M1 W4 | docs/oss/comfyui.md |
| Chatwoot | 会话连接器参考 | Adapt/Integrate | ConversationProvider | M1 W5 Spike | docs/oss/chatwoot.md |
| Remotion | 模板视频 | Buy(License) | TemplateVideoProvider | M2（需商业许可） | docs/oss/remotion.md |
| Activepieces | 长尾连接器 | Integrate(可选) | — | M3 | docs/oss/activepieces.md |

## Provider（数据/邮件/媒体，Buy/Partner）

| 类别 | 候选 | 决策 | 状态 |
|---|---|---|---|
| 贸易/行业数据 | 非腾道来源（腾道仅竞品，D-015） | Buy/Partner | OD-07 待选，Bake-off（V-006） |
| 企业/联系人 | Apollo/PDL 等 | Buy/Partner | Bake-off |
| 邮箱验证 | 待选 | Buy | OD-07 |
| 邮件发送 | Gmail/Outlook API 或合规发信 | Buy/授权 | OD-06 依赖外联决策 |

## 硬约束

- 业务代码不得直连厂商/Provider SDK，一律经 Adapter（CLAUDE.md 硬边界 2）。
- 任一开源/Provider 必须有 Exit Plan 和替代（母本 8.18）；候选未过 Gate 不得作生产依赖。
- 依赖变更影响字段/权限/成本/用户承诺时触发产品与合同评审（母本 12.8）。
