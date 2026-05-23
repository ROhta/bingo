---
description: APM (Agent Project Manager) を介した MCP サーバーの運用ルール
applyTo: "apm.yml"
---

# MCP サーバー管理ルール

## Source of Truth

`apm.yml` の `dependencies.mcp` がこのリポジトリで使う MCP サーバーの Source of Truth。
`apm install` を実行すると、ここに宣言された MCP サーバーが Claude Code / Codex CLI / GitHub Copilot (in VS Code) の各 IDE 設定に展開される。

## 配信される MCP サーバー

| 名前 | 起動コマンド | 用途 | 必要な前提 |
| --- | --- | --- | --- |
| `semgrep` | `uvx semgrep-mcp` | 静的解析 (SAST) によるコード品質・セキュリティ検査 | `uv` |
| `chrome-devtools` | `npx chrome-devtools-mcp@latest` | Chrome DevTools 経由のブラウザ自動化・パフォーマンス計測 | `node` (Chrome は実行時にダウンロード) |
| `serena` | `uvx --from git+https://github.com/oraios/serena serena start-mcp-server` | LSP ベースのシンボル指向コード探索・編集 | `uv` |
| `context7` | `npx -y @upstash/context7-mcp` | ライブラリ公式ドキュメントの最新版を取得 | `node` |

## 開発者の前提条件

上記表の通り、以下のランタイムが PATH にあれば全 MCP サーバーが動作する。

- [uv](https://docs.astral.sh/uv/) (`uvx` を経由して PyPI / git ソースの Python パッケージを実行)
- [Node.js](https://nodejs.org/) (`npx` 経由)

## サーバーの追加

`apm install --mcp <name> -- <command> [args...]` で `apm.yml` に追記される。

```bash
# 例: 新しい MCP サーバーを追加
apm install --mcp my-server -- npx -y @example/my-mcp
```

### APM レジストリは使わないこと

APM 公式レジストリ (`apm mcp search` / `apm mcp install <registry-name>`) は 2026 年 5 月時点で
解決結果が不正なケースがある (例: `oraios/serena` が `uvx ide-assistant` という別物に展開される)。
このリポジトリでは **すべて self-defined (`-- <command> [args...]` 指定)** で登録する。

## サーバーの削除

`apm.yml` の `dependencies.mcp` 配下から該当エントリを手で削除した後、`apm install` を再実行する。

## 生成物の場所

`apm install` が以下のファイルを生成する。すべて `.gitignore` 対象。

| パス | 対応 IDE |
| --- | --- |
| `.mcp.json` | Claude Code (project scope) |
| `.vscode/mcp.json` | GitHub Copilot in VS Code |
| `.codex/config.toml` | Codex CLI |

## APM の `--skill` プリミティブとの違い

APM には `--skill` フラグで扱う SKILL.md バンドル (Claude Code Skills) という別プリミティブが存在する。
このリポジトリで管理しているのは **MCP サーバー** であり、APM の `--skill` プリミティブとは別概念。
両者を混同しないこと。
