# apps/

可部署应用。阶段 0 只放占位说明；各 app 在 M1 按需 scaffold（scaffold 时加 `package.json` 后自动纳入 pnpm workspace）。

| 应用 | 技术 | 职责（母本 11.1/11.5） |
|---|---|---|
| `web` | Next.js（App Router） | 新 App Shell，目标式交互、结构化 AI 组件、审批 |
| `api` | NestJS | BFF/API、鉴权、聚合、限流、OpenAPI |
| `worker-ai` | Python | 领域 AI Task、检索、Model Gateway 调用 |
| `worker-data` | Python | Provider、身份解析、公开情报采集（隔离沙箱） |
| `worker-media` | Python/TS | 图像/视频合成（VideoCompositionProvider 等） |
| `worker-integrations` | TS | Webhook、CRM/渠道同步 |

约束：Web/API 不直连 Provider SDK；Worker 经 Adapter/Contract；爬虫与媒体 Worker 与主库网络隔离（母本 ADR-013、8.20）。
