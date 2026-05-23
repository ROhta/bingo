---
description: APM (Agent Project Manager) を介した MCP サーバーの運用ルール
applyTo: "apm.yml"
---

# MCP サーバー管理ルール

## Source of Truth

`apm.yml` の `dependencies.mcp` がこのリポジトリで使う MCP サーバーの Source of Truth。 `apm install` を実行すると、ここに宣言された MCP サーバーが Claude Code / Codex CLI / GitHub Copilot (in VS Code) の各 IDE 設定に展開される。

## 配信される MCP サーバー

| 名前              | 起動コマンド                                                                         | 用途                                                     | 必要な前提                             |
| ----------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------- | -------------------------------------- |
| `semgrep`         | `uvx semgrep-mcp`                                                                    | 静的解析 (SAST) によるコード品質・セキュリティ検査       | `uv`                                   |
| `chrome-devtools` | `npx -y chrome-devtools-mcp@1.0.1`                                                   | Chrome DevTools 経由のブラウザ自動化・パフォーマンス計測 | `node` (Chrome は実行時にダウンロード) |
| `serena`          | `uvx --from git+https://github.com/oraios/serena@c3a8d5a9c5 serena start-mcp-server` | LSP ベースのシンボル指向コード探索・編集                 | `uv`                                   |
| `context7`        | `npx -y @upstash/context7-mcp`                                                       | ライブラリ公式ドキュメントの最新版を取得                 | `node`                                 |

## バージョン固定方針

再現性確保のため、`@latest` や git ブランチ HEAD ではなく **具体バージョン or コミット SHA でピン** する ([[apm_workflow]] のドリフト防止方針)。

- npm 系: `<package>@<semver>` (例: `chrome-devtools-mcp@1.0.1`)
- git 系: `git+<url>@<sha>` (例: `git+https://github.com/oraios/serena@c3a8d5a9...`)
- 例外: `semgrep-mcp` / `@upstash/context7-mcp` は API が安定しているため固定省略 (将来必要に応じて固定)

更新するときは PR でレビュー可能な形に。`npm view <package> dist-tags` と `git ls-remote --tags <url>` で最新を確認。

## npx の非対話起動

`npx` は未インストールパッケージを実行する際に確認プロンプトを表示するため、`-y` (auto-yes) を必ず付ける。これがないと CI など非対話環境でハング・失敗する可能性がある。

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

APM 公式レジストリ (`apm mcp search` / `apm mcp install <registry-name>`) は 2026 年 5 月時点で解決結果が不正なケースがある (例: `oraios/serena` が `uvx ide-assistant` という別物に展開される)。このリポジトリでは **すべて self-defined (`-- <command> [args...]` 指定)** で登録する。

## サーバーの削除

`apm.yml` の `dependencies.mcp` 配下から該当エントリを手で削除した後、`apm install` を再実行する。

## 生成物の場所

`apm install` が以下のファイルを生成する。すべて `.gitignore` 対象。

| パス                 | 対応 IDE                    |
| -------------------- | --------------------------- |
| `.mcp.json`          | Claude Code (project scope) |
| `.vscode/mcp.json`   | GitHub Copilot in VS Code   |
| `.codex/config.toml` | Codex CLI                   |

## APM の他のプリミティブとの違い

APM は MCP サーバーのほかに、以下のプリミティブも扱える。

- **APM パッケージ (`dependencies.apm`)**: Skills / commands / prompts / hooks / instructions 等を含む APM プラグイン (またはその中の単一プリミティブファイル) を GitHub から取得する。このリポジトリでは `github/awesome-copilot/instructions/code-review-generic.instructions.md` (汎用コードレビュー指示) と `obra/superpowers` (汎用スキル群) を採用 → [`apm-plugins.instructions.md`](./apm-plugins.instructions.md)
- **APM スキル (`--skill` フラグ)**: SKILL_BUNDLE から個別の SKILL.md を選択的にインストール

MCP サーバー / APM パッケージ / APM スキル はそれぞれ独立したプリミティブなので、用語を混同しないこと。
