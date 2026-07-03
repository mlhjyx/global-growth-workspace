# GitHub 配置清单（诚实状态：已配 / 待 Pro / 待做）

## ✅ 已配置（2026-07-03，Free 层可用，已验证生效）

| 项 | 值 |
|---|---|
| 合并策略 | 仅 Squash（merge commit/rebase 已禁）→ Linear History |
| 合并后删除分支 | 开启 |
| Milestones | M0 原型 / M1 Alpha / M2 试点 / M3 商业 |
| Labels | risk:R0-R3、release:M0-M3、type:epic/spike/decision、status:blocked/dev-ready |
| PR 模板 | .github/pull_request_template.md（强制关联字段） |
| Issue 模板 | .github/ISSUE_TEMPLATE/（epic/feature/bug/spike/decision） |
| CODEOWNERS | .github/CODEOWNERS（单人阶段全部映射 @mlhjyx，结构保留） |
| Dependabot | .github/dependabot.yml（npm + actions 每周） |
| CI Required 候选 | verify（format/type-check/build/contracts） |

## ✅ 分支保护：已启用（PDR-004，2026-07-04 仓库转公开后免费可用）

Ruleset `main-protection`（id 18488074，enforcement=active，作用于默认分支）：

| 规则 | 值 |
|---|---|
| pull_request | 仅 PR 可合入；必需审查人 0（单人模式，自审依赖 Codex + 自查协议）；评论 thread 必须解决；仅允许 squash |
| required_status_checks | verify 必须通过（strict=false：不强制与 main 同步，dependabot 串行合并靠协议） |
| non_fast_forward | 禁 force push |
| deletion | 禁删除 main |

效果：直推 main、检查未绿合并、未解决评论合并，均被服务端拒绝；CLAUDE.md 合并纪律降为第二道防线（PDR-004）。

## ⬜ 待做（不阻塞，按需）

- GitHub Project 看板（字段：Release/Wave/Epic/Priority/Status/Risk/Blocking Decision/PR）——需要 project scope，建立后状态流转 Backlog→Discovery→Dev-Ready→In Progress→In Review→Merged→Validating→Accepted
- labeler.yml 自动打标（按路径）
- CI 扩展：secret-scan、dependency-review（Free 私有仓库 dependency review 也受限，随 Pro 一并验证）；生产代码期加 integration/e2e/migration-check/schema-compatibility/license-scan/tenant-isolation-test

## 纪律（服务端保护生效前的补偿控制）

CLAUDE.md「合并纪律」+ CHANGE_CONTROL R0-R3 判定协议为强制流程；main CI 红即 revert。
