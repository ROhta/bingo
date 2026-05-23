---
description: APM (Agent Project Manager) を介した Claude Code プラグインの運用ルール
applyTo: "apm.yml"
---

# APM プラグイン管理ルール

## Source of Truth

`apm.yml` の `dependencies.apm` がこのリポジトリで使う Claude Code プラグイン (Skills / commands / prompts / hooks 等のバンドル) の Source of Truth。
`apm install` を実行すると、ここに宣言されたプラグインが `apm_modules/` にダウンロードされ、各成果物 (`.claude/skills/`, `.claude/commands/`, `.agents/skills/`, `.github/prompts/` 等) に展開される。

## 配信されるプラグイン

| プラグイン | リポジトリ | 用途 |
| --- | --- | --- |
| `code-review` | [anthropics/claude-code](https://github.com/anthropics/claude-code) (path: `plugins/code-review`) | PR の自動コードレビュー (複数の専門エージェントが confidence ベースで採点) |
| `superpowers` | [obra/superpowers](https://github.com/obra/superpowers) | TDD・デバッグ・コラボレーションの汎用スキル群 (brainstorming, systematic-debugging, writing-plans 等 14 スキル) |

## SHA ピン

`dependencies.apm` のエントリは **必ず `#<sha>` でピンする**。`apm install` で `unpinned -- add #tag or #sha to prevent drift` という警告が出るため気付ける。

```yaml
dependencies:
  apm:
  - anthropics/claude-code/plugins/code-review#39e853e4074d90f27afdfb7ea601e0fc378bd0c5
  - obra/superpowers#f2cbfbefebbfef77321e4c9abc9e949826bea9d7
```

理由: ピンしないと `apm install` 毎に上流の `main` を引いてしまい、各メンバーの開発体験が静かにドリフトする ([[apm_workflow]] のドリフト防止方針)。

## プラグインの追加

### marketplace 経由 (推奨。検索用)

```bash
# 1. marketplace を一時的に register (global config のみ。apm.yml には影響しない)
apm marketplace add <owner>/<repo>
# 2. plugin を install (apm.yml に追記される)
apm install <plugin>@<marketplace-name>
# 3. unpinned 警告が出るので apm.lock.yaml の resolved_commit を見て #sha でピン
```

### 直接 GitHub から (marketplace 未登録のプラグイン)

```bash
apm install <owner>/<repo>#<sha>
# または path 指定
apm install <owner>/<repo>/<path>#<sha>
```

`apm.yml` に `<owner>/<repo>[/<path>]#<sha>` 形式が直接書ければ、global の marketplace 登録は **不要**。
チームメイトは `git clone` 後 `apm install` だけで同じプラグインを取得できる。

## プラグインの削除

`apm.yml` の `dependencies.apm` 配下から該当行を削除した後、`apm install` を再実行する。
`apm_modules/<owner>/<repo>/` と展開済みファイルが残った場合は手動で掃除する。
(`apm uninstall <package>` の動作は本リポジトリでは未検証)

## 生成物の場所

`apm install` がプラグインを展開する先。すべて `.gitignore` 対象。

| パス | 由来 |
| --- | --- |
| `apm_modules/<owner>/<repo>/` | プラグインのソースコピー (cache) |
| `.claude/skills/` | Claude Code Skills (SKILL.md) |
| `.agents/skills/` | クロスクライアント Skills (Cursor / Codex / Gemini 等が読む) |
| `.claude/commands/` | Claude Code スラッシュコマンド |
| `.claude/hooks/` | Claude Code フックスクリプト |
| `.claude/apm-hooks.json` | APM がフック登録に用いる索引 |
| `.claude/settings.json` | フック有効化等のクライアント設定 |
| `.github/prompts/` | GitHub Copilot プロンプト |
| `.github/hooks/` | GitHub 用フック (Copilot CLI 等) |

`.claude/settings.json` を ignore しているのは、APM がプラグインのフック有効化のために絶対パスを書き込むため (リポジトリで共有しても各環境でパスが食い違って意味がない)。
個人の Claude Code 設定はユーザースコープ (`~/.claude/settings.json`) または `.claude/settings.local.json` (Claude Code の慣習で per-user 扱い) に置くこと。
