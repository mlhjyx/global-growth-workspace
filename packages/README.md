# packages/

共享库。

| 包 | 用途 |
|---|---|
| `contracts` | OpenAPI / AsyncAPI 事件 / JSON Schema / Adapter 接口 —— 跨域契约单一事实源（**受保护**，ADR-102） |
| `policy` | OPA 策略与测试（**受保护**，母本 9.9/8.12） |
| `evals` | Golden Set 与评估器（母本 14.2） |
| `domain-*` | 各领域模型与应用服务（M1 起按域建：domain-workspace / domain-knowledge / domain-campaign / domain-lead …）。Domain 包不依赖 Provider SDK。 |
| `ui` | 设计系统与结构化 AI 组件（Evidence Drawer、Cost/Policy Badge、Approval 等，母本 6.13） |
| `observability` | Trace/日志/指标封装（OpenTelemetry + Langfuse，母本 11.2/10.10） |

`domain-*`、`ui`、`observability` 在对应 Epic 启动时建包（加 `package.json` 即纳入 workspace）。
