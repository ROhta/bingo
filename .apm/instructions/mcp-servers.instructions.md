---
description: APM (Agent Project Manager) を介した MCP サーバーの運用ルール
applyTo: "apm.yml"
---

# MCP サーバー管理ルール

## Source of Truth

共通の MCP サーバーセット（semgrep / chrome-devtools / serena / context7）は、共有パッケージ
[`ROhta/apm-config/mcp-toolkit`](https://github.com/ROhta/apm-config) が Source of Truth。
本リポジトリは `apm.yml` の `dependencies.apm` からこれを参照する。`apm install` を実行すると、
mcp-toolkit に宣言された MCP サーバーが直接依存として自動信頼され、Claude Code / Codex CLI /
GitHub Copilot (in VS Code) の各 IDE 設定に展開される。

リポジトリ固有の MCP サーバーが必要な場合のみ、`apm.yml` の `dependencies.mcp` に個別に追記する。

## 配信される MCP サーバー

| 名前              | 用途                                                     | 必要な前提                             |
| ----------------- | -------------------------------------------------------- | -------------------------------------- |
| `semgrep`         | 静的解析 (SAST) によるコード品質・セキュリティ検査       | `uv`                                   |
| `chrome-devtools` | Chrome DevTools 経由のブラウザ自動化・パフォーマンス計測 | `node` (Chrome は実行時にダウンロード) |
| `serena`          | LSP ベースのシンボル指向コード探索・編集                 | `uv`                                   |
| `context7`        | ライブラリ公式ドキュメントの最新版を取得                 | `node`                                 |

## バージョン固定方針

再現性確保のため、各サーバーの具体バージョン / コミット SHA によるピンは
**mcp-toolkit 側で一元管理**する（`@latest` や git ブランチ HEAD は使わない）。
pin を更新するときは本リポジトリではなく apm-config を編集し、`apm update` で取り込む。
これにより、従来リポジトリごとに pin がドリフトしていた問題を解消する。

## 開発者の前提条件

上記表の通り、以下のランタイムが PATH にあれば全 MCP サーバーが動作する。

- [uv](https://docs.astral.sh/uv/) (`uvx` を経由して PyPI / git ソースの Python パッケージを実行)
- [Node.js](https://nodejs.org/) (`npx` 経由)

## サーバーの追加・削除・pin 更新

共通セットの変更は apm-config/mcp-toolkit で行い、本リポジトリで `apm update` を実行する。
リポジトリ固有サーバーを足す場合は `apm.yml` の `dependencies.mcp` を編集して `apm install` する。

### APM レジストリは使わないこと

APM 公式レジストリ (`apm mcp search` / `apm mcp install <registry-name>`) は 2026 年 5 月時点で解決結果が不正なケースがある (例: `oraios/serena` が `uvx ide-assistant` という別物に展開される)。このため **すべて self-defined (`-- <command> [args...]` 指定)** で登録する（mcp-toolkit 側も同方針）。

## 生成物の場所

`apm install` が以下のファイルを生成する。すべて `.gitignore` 対象。

| パス                 | 対応 IDE                    |
| -------------------- | --------------------------- |
| `.mcp.json`          | Claude Code (project scope) |
| `.vscode/mcp.json`   | GitHub Copilot in VS Code   |
| `.codex/config.toml` | Codex CLI                   |

## APM の他のプリミティブとの違い

APM は MCP サーバーのほかに、以下のプリミティブも扱える。

- **APM パッケージ (`dependencies.apm`)**: Skills / commands / prompts / hooks / instructions 等を含む APM プラグイン (またはその中の単一プリミティブファイル) を GitHub から取得する。このリポジトリでは共通設定 `ROhta/apm-config`（base / mcp-toolkit）、`github/awesome-copilot/instructions/code-review-generic.instructions.md` (汎用コードレビュー指示)、`obra/superpowers` (汎用スキル群) を採用 → [`apm-plugins.instructions.md`](./apm-plugins.instructions.md)
- **APM スキル (`--skill` フラグ)**: SKILL_BUNDLE から個別の SKILL.md を選択的にインストール
