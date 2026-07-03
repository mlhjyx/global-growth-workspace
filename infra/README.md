# infra/

部署、本地依赖与运维。

- `docker-compose.dev.yml` — 本地 PostgreSQL(pgvector) + Redis（ADR-103）。
- 部署拓扑、区域策略见母本 8.20；Runbook 见母本 14.5（各故障场景的降级/恢复）。
- 按需引入：Temporal、OPA、MinIO(S3 兼容)、OpenSearch，各自 ADR + compose 片段。

## 本地起步

```bash
docker compose -f infra/docker-compose.dev.yml up -d
cp .env.example .env   # 按需调整，.env 不入库
```
