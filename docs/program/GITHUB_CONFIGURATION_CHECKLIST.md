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

## ⛔ 待 GitHub Pro（已验证 Free 私有仓库 403，用户升级后执行）

升级路径：github.com → Settings → Billing and plans → Upgrade to Pro（需网页付款，Claude Code 不能代付）。

升级后由 Claude Code 立即执行（命令已备）：

```bash
# main 分支 Ruleset：PR 必经 + Required Check(verify) + 禁 force push/删除 + 会话必须解决 + 与 main 同步
gh api -X POST repos/mlhjyx/global-growth-workspace/rulesets --input ruleset-main.json
```

规则内容：deletion 禁止、non_fast_forward 禁止、pull_request（required_review_thread_resolution=true）、required_status_checks（verify，strict=true）。

## ⬜ 待做（不阻塞，按需）

- GitHub Project 看板（字段：Release/Wave/Epic/Priority/Status/Risk/Blocking Decision/PR）——需要 project scope，建立后状态流转 Backlog→Discovery→Dev-Ready→In Progress→In Review→Merged→Validating→Accepted
- labeler.yml 自动打标（按路径）
- CI 扩展：secret-scan、dependency-review（Free 私有仓库 dependency review 也受限，随 Pro 一并验证）；生产代码期加 integration/e2e/migration-check/schema-compatibility/license-scan/tenant-isolation-test

## 纪律（服务端保护生效前的补偿控制）

CLAUDE.md「合并纪律」+ CHANGE_CONTROL R0-R3 判定协议为强制流程；main CI 红即 revert。
