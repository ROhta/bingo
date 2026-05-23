---
description: APM (Agent Project Manager) を介した AI エージェント指示の運用ルール
applyTo: ".apm/**"
---

# APM 運用ルール

## Source of Truth

`.apm/instructions/*.instructions.md` がすべての AI エージェント向け指示の Source of Truth。
ここを編集することで、Claude Code / Codex CLI / GitHub Copilot すべてに同じ指示が届く。

## 編集後の必須作業

`.apm/instructions/` 配下のファイルを変更したら、必ず以下を実行してからコミットする。

```bash
apm install
```

これにより、以下のファイル群が再生成・更新される。

| 生成先 | 用途 | リポジトリ追跡 |
| --- | --- | --- |
| `.github/instructions/*.instructions.md` | GitHub Copilot Code Review が読む新形式 | **追跡する** |
| `.claude/rules/*.md` | Claude Code 補助 | 追跡しない (`.gitignore`) |
| `CLAUDE.md` / `AGENTS.md` (各所) | `apm compile` で生成 | 追跡しない (`.gitignore`) |

`.github/instructions/` のみコミット対象 (GitHub Copilot Code Review がリポジトリから直接読むため)。
それ以外はローカルで `apm install` / `apm compile` を実行すれば再生成可能なため追跡しない。

## ドリフト防止策

以下の三段構えで `.apm/instructions/` と `.github/instructions/` の乖離を防ぐ。

1. **このドキュメント** — 編集者への明示的な指示
2. **`.husky/pre-commit`** — `.apm/` への変更がステージされた場合に `apm install` を自動実行し、生成物を再ステージ
3. **GitHub Actions (`.github/workflows/apm-drift-check.yml`)** — PR で `apm install` 実行後にドリフトを検知すれば fail

## なぜ AGENTS.md だけでは不十分か

2026 年 5 月時点、GitHub Copilot Code Review エージェントは `AGENTS.md` を読まず、
`.github/instructions/*.instructions.md` または `.github/copilot-instructions.md` のみを読む仕様。

そのため `AGENTS.md` (gitignore 済み) ではなく `.github/instructions/` をリポジトリに含める必要がある。

参考:
- <https://docs.github.com/copilot/how-tos/configure-custom-instructions/add-repository-instructions>
- <https://github.com/orgs/community/discussions/174058>
