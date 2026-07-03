# OSS Registry（开源/外部能力注册表）

Architecture De-risking Track（交付要求 #5）的交付载体。每个项目一张 9 段交付卡（模板 `_TEMPLATE.md`）。**诚实边界：Assessment/License/Adapter/Spike Plan/Exit 可现在填（文档）；Spike Result/Production Gate 依赖 M1 真实环境，不可由文档代替。**

| 项目 | 决策 | Wave | 交付卡 | 文档段就绪 | Spike（需真跑） |
|---|---|---|---|---|---|
| Temporal | Integrate | M1 W1 | [temporal.md](temporal.md) | 1-5,8,9 | ⬜ 6,7 |
| OPA | Integrate | M1 W1 | ⬜ opa.md | — | ⬜ |
| LiteLLM | Integrate+Wrapper | M1 W1 | ⬜ litellm.md | — | ⬜ |
| Langfuse | Integrate | M1 W1 | ⬜ langfuse.md | — | ⬜ |
| Docling | Integrate | M1 W2 | ⬜ docling.md | — | ⬜ |
| Crawl4AI/Firecrawl | Integrate/Buy | M1 W2 | ⬜ crawler.md | — | ⬜ V-005 |
| Cognee/Graphiti/pgvector | Bake-off | M1 W2 | ⬜ knowledge-graph.md | — | ⬜ V-004 |
| AiToEarn | Adapt+Integrate | M1 W4 | ⬜ aitoearn.md | — | ⬜ V-002 |
| MoneyPrinterTurbo | Adapt | M1 W4 | ⬜ moneyprinterturbo.md | — | ⬜ V-003 |
| ComfyUI | Isolated | M1 W4 | ⬜ comfyui.md | — | ⬜ |
| Chatwoot | Adapt/Integrate | M1 W5 | ⬜ chatwoot.md | — | ⬜ |
| Remotion | Buy(License) | M2 | ⬜ remotion.md | — | ⬜ |

## 启动顺序（与 M0 并行，不等 M0 结束）

W1 优先级最高（Temporal/OPA/LiteLLM/Langfuse）——它们是 Foundation 运行时的一部分，Spike 结果直接影响 EPIC-FOUNDATION Dev-Ready Package。W2 知识/数据类次之。**Spike 需要可运行环境（Docker/云/真实账号），是 M1 实操，不是文档任务**；本轮先完成可文档化的段（评估/许可/契约/计划/退出），Spike Result 待 M1 环境就绪逐项回填。

## 供应链治理（母本 8.17）

CI 生成 SBOM，执行许可证/依赖漏洞/容器/Secret 扫描；镜像签名；固定 Commit/版本；Fork 仅在必要且有长期 Owner 时。
