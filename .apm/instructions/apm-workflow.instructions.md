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
| `.apm/instructions/*.instructions.md` | **Source of Truth (instructions 用、人間が編集する)** | ✅ 追跡する |
| `apm.yml` の `dependencies.mcp` | **Source of Truth (MCP サーバー用、人間が編集する)** | ✅ 追跡する |
| `apm.yml` の `dependencies.apm` | **Source of Truth (Claude Code プラグイン用、人間が編集する)** | ✅ 追跡する |
| `.github/copilot-instructions.md` | Copilot Code Review に SoT への参照を伝えるスタブ | ✅ 追跡する |
| `.github/instructions/*.instructions.md` | `apm install` で生成 (Copilot 新形式) | ❌ 追跡しない |
| `.claude/rules/*.md` | `apm install` で生成 (Claude Code 補助) | ❌ 追跡しない |
| `CLAUDE.md` / `AGENTS.md` (各所) | `apm compile` で生成 | ❌ 追跡しない |
| `apm.lock.yaml` | `apm install` で生成 (整合性検証・オーファン検出・厳密な再現性のため例外的に追跡) | ✅ 追跡する |
| `.mcp.json` | `apm install` で生成 (Claude Code MCP 設定) | ❌ 追跡しない |
| `.vscode/mcp.json` | `apm install` で生成 (GitHub Copilot in VS Code MCP 設定) | ❌ 追跡しない |
| `.codex/config.toml` | `apm install` で生成 (Codex CLI MCP 設定) | ❌ 追跡しない |
| `apm_modules/`, `.agents/skills/`, `.claude/skills/`, `.claude/commands/`, `.claude/hooks/`, `.claude/settings.json`, `.claude/apm-hooks.json`, `.github/prompts/`, `.github/hooks/` | `apm install` で生成 (APM プラグイン展開先) | ❌ 追跡しない |

## ローカルでの作業

`.apm/instructions/` または `apm.yml` を編集後、ローカルで以下を実行することで生成物が更新される (任意)。

```bash
apm install   # 全プリミティブを再デプロイ (.github/instructions/, .claude/rules/, .mcp.json, .vscode/mcp.json, .codex/config.toml)
apm compile   # CLAUDE.md / AGENTS.md を更新
```

ただし、`apm.lock.yaml` を除く生成物は `.gitignore` 対象のためコミットには含まれない。

MCP サーバーの追加・運用手順は [`mcp-servers.instructions.md`](./mcp-servers.instructions.md) を参照。
APM プラグイン (Skills / commands 等) の追加・運用手順は [`apm-plugins.instructions.md`](./apm-plugins.instructions.md) を参照。

## GitHub Copilot Code Review への指示伝達

2026 年 5 月時点、GitHub Copilot Code Review エージェントは `AGENTS.md` を読まず、
`.github/copilot-instructions.md` または `.github/instructions/*.instructions.md` のみを読む仕様。

このリポジトリでは `.github/copilot-instructions.md` をスタブとして配置し、
SoT である `.apm/instructions/pr-review.instructions.md` を参照する形式で
Copilot Code Review に指示の所在を伝えている。

参考:
- <https://docs.github.com/copilot/how-tos/configure-custom-instructions/add-repository-instructions>
- <https://github.com/orgs/community/discussions/174058>
