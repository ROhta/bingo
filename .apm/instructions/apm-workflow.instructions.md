---
description: APM (Agent Project Manager) を介した AI エージェント指示の運用ルール
applyTo: ".apm/**"
---

# APM 運用ルール

## Source of Truth

`.apm/instructions/*.instructions.md` がすべての AI エージェント向け指示の Source of Truth。
ここを編集することで、Claude Code / Codex CLI / GitHub Copilot すべてに同じ指示が届く。

## ファイルの管理方針

| パス | 役割 | リポジトリ追跡 |
| --- | --- | --- |
| `.apm/instructions/*.instructions.md` | **Source of Truth (人間が編集する)** | ✅ 追跡する |
| `.github/copilot-instructions.md` | Copilot Code Review に SoT への参照を伝えるスタブ | ✅ 追跡する |
| `.github/instructions/*.instructions.md` | `apm install` で生成 (Copilot 新形式) | ❌ 追跡しない |
| `.claude/rules/*.md` | `apm install` で生成 (Claude Code 補助) | ❌ 追跡しない |
| `CLAUDE.md` / `AGENTS.md` (各所) | `apm compile` で生成 | ❌ 追跡しない |
| `apm.lock.yaml` | `apm install` で生成 | ❌ 追跡しない |

## ローカルでの作業

`.apm/instructions/` を編集後、ローカルで以下を実行することで生成物が更新される (任意)。

```bash
apm install   # .github/instructions/ と .claude/rules/ を更新
apm compile   # CLAUDE.md / AGENTS.md を更新
```

ただし、生成物はすべて `.gitignore` 対象のためコミットには含まれない。

## GitHub Copilot Code Review への指示伝達

2026 年 5 月時点、GitHub Copilot Code Review エージェントは `AGENTS.md` を読まず、
`.github/copilot-instructions.md` または `.github/instructions/*.instructions.md` のみを読む仕様。

このリポジトリでは `.github/copilot-instructions.md` をスタブとして配置し、
SoT である `.apm/instructions/pr-review.instructions.md` を参照する形式で
Copilot Code Review に指示の所在を伝えている。

参考:
- <https://docs.github.com/copilot/how-tos/configure-custom-instructions/add-repository-instructions>
- <https://github.com/orgs/community/discussions/174058>
