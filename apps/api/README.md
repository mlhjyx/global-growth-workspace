# @ggw/api —— NestJS 模块化单体（BE-02 骨架）

执行规格：`docs/epics/EPIC-FOUNDATION.md`（BE-01α 冻结版）§0.2 目录骨架、§0.3 禁依赖规则、§5 API 约定、§7.3 冒烟清单。

## 目录约定（§0.2，禁依赖方向：modules → infrastructure → common，反向即 CI 失败）

```text
src/
  common/          # 无业务横切：统一错误体过滤器、request-id/correlation-id、Idempotency-Key、
                   #   分页/DTO 基类——只依赖 contracts 类型，禁止依赖下两层
  infrastructure/  # health、config（启动校验）、logging、otel；BE-03 起 persistence/prisma、
                   #   BE-04 起 audit、BE-05 起 outbox
  modules/         # 一个 Bounded Context 一个模块（workspace/knowledge/lead/campaign/opportunity），
                   #   BE-09A..D 逐个启用；此前仅 README 占位，不预留空壳代码
```

## 工程约定

- **注入一律显式 `@Inject(TOKEN)`**：vitest 走 esbuild 不产出 decorator metadata，不靠构造参数类型反射做 DI。
- 业务代码禁止直接 import 厂商/Provider SDK（硬边界 2；ESLint denylist 维护在本包 eslint 配置）。
- Tenant Context 仅可源自已验证 JWT（BE-04 起）；BE-03 过渡期只允许测试夹具注入。
- 本包脚本名必须是 `typecheck`（不是 type-check），否则 turbo/CI 静默跳过——仓库踩过的坑。

## 运行

```bash
pnpm --filter @ggw/api dev    # 本地 127.0.0.1:3001
pnpm --filter @ggw/api test   # vitest（真实起应用的 e2e 冒烟）
```
