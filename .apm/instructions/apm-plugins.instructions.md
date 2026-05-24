---
description: APM (Agent Project Manager) を介した依存パッケージ (プラグイン bundle / 単一プリミティブ) の運用ルール
applyTo: "apm.yml"
---

# APM プラグイン管理ルール

## Source of Truth

`apm.yml` の `dependencies.apm` がこのリポジトリで使う APM 依存パッケージの Source of Truth。扱える形態は 2 種類:

- **プラグイン bundle**: Skills (SKILL.md) / commands / prompts / hooks / instructions / agents 等を 1 リポジトリにまとめたもの (例: `obra/superpowers`)
- **単一プリミティブ (virtual file)**: 既存リポジトリ内の特定の `*.instructions.md` / `*.prompt.md` / `SKILL.md` などを 1 ファイル単位で取り込むもの (例: `github/awesome-copilot/instructions/code-review-generic.instructions.md`)

`apm install` を実行すると、ここに宣言された依存が `apm_modules/` にダウンロードされ、各ターゲット向けに `.claude/rules/`, `.claude/skills/`, `.claude/commands/`, `.claude/hooks/`, `.agents/skills/`, `.github/instructions/`, `.github/prompts/`, `.github/hooks/` 等へ展開される (内容に応じて配信先が変わる)。Codex 向けには専用の配信先を持たない代わりに、`apm compile` 時に instructions / skills 内容が `AGENTS.md` に組み込まれる。

## 配信されるプラグイン

| 依存                                  | リポジトリ                                                                                                                     | 種別                            | 用途                                                                                                                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code-review-generic.instructions.md` | [github/awesome-copilot](https://github.com/github/awesome-copilot) (path: `instructions/code-review-generic.instructions.md`) | 単一プリミティブ (virtual file) | 汎用コードレビュー指示 (ベンダー・言語・プロジェクト非依存)。Claude (`.claude/rules/`) と Copilot (`.github/instructions/`) に展開、Codex は `AGENTS.md` 経由で受け取る |
| `superpowers`                         | [obra/superpowers](https://github.com/obra/superpowers)                                                                        | marketplace plugin              | TDD・デバッグ・コラボレーションの汎用スキル群 (brainstorming, systematic-debugging, writing-plans 等 14 スキル)                                                         |

### vendor-neutral 方針

`dependencies.apm` には特定 AI ベンダー (anthropics 等) 組織配下のリポジトリを直接指定せず、コミュニティ curated marketplace (`github/awesome-copilot`) や中立 OSS 作者リポジトリ (`obra/superpowers`) を経由する。理由: ベンダー組織のプラグインは「そのベンダーのランタイム前提」 (例: Claude Code の Stop hook + subagent 機構) で書かれていることが多く、Codex などのターゲットに同等機能が配信されないため。

## インストール手順 (`pnpm apm-install`)

APM CLI v0.14.1 には `apm install` 後の `apm.lock.yaml` の `deployed_files:` 配列に同一パスが 2 回ずつ記録される既知の不具合がある (例: `obra/superpowers` 由来の `run-hook.cmd` 等が重複)。差分ノイズや整合性チェック誤検知の原因になるため、本リポジトリでは `apm install` を直接呼ばず以下のラッパー経由で実行する。

```bash
pnpm apm-install   # = apm install && node scripts/dedupe-apm-lock.mjs
```

`scripts/dedupe-apm-lock.mjs` は隣接した同一 `- <path>` 行を 1 行に畳む後処理 (YAML パーサ非依存・新規 devDep 不要)。`deployed_file_hashes:` (mapping) は配列ではないため影響を受けない。upstream ([microsoft/apm](https://github.com/microsoft/apm)) で fix され次第、このラッパーと dedupe スクリプトは撤去する。

## SHA ピン

`dependencies.apm` のエントリは **必ず `#<sha>` でピンする**。`apm install` で `unpinned -- add #tag or #sha to prevent drift` という警告が出るため気付ける。

```yaml
dependencies:
  apm:
    - github/awesome-copilot/instructions/code-review-generic.instructions.md#5b049e4e196c10aab8ddfd9e492323d08cf985b0
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
# または path 指定 (プラグイン bundle のサブディレクトリ)
apm install <owner>/<repo>/<path>#<sha>
# または単一プリミティブファイル (instructions / prompts / skills など 1 ファイル指定)
apm install <owner>/<repo>/<path-to-file>.<ext>.md#<sha>
```

`apm.yml` に `<owner>/<repo>[/<path>]#<sha>` 形式が直接書ければ、global の marketplace 登録は **不要**。チームメイトは `git clone` 後 `apm install` だけで同じプラグインを取得できる。

`<path-to-file>.instructions.md` のように **末尾がファイル名** の場合、APM は単一プリミティブ (virtual file) として取り込む。プラグイン全体を取り込まずに必要な 1 ファイルだけを依存にしたい時 (例: 汎用 instructions のみが欲しいケース) に使う。

## プラグインの削除

`apm.yml` の `dependencies.apm` 配下から該当行を削除した後、`apm install` を再実行する。 `apm_modules/<owner>/<repo>/` と展開済みファイルが残った場合は手動で掃除する。(`apm uninstall <package>` の動作は本リポジトリでは未検証)

## 生成物の場所

`apm install` がプラグインを展開する先。すべて `.gitignore` 対象。

| パス                          | 由来                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `apm_modules/<owner>/<repo>/` | 依存のソースコピー (cache)                                                   |
| `.claude/rules/`              | Claude Code 用 instructions (virtual file の `*.instructions.md` 等の展開先) |
| `.claude/skills/`             | Claude Code Skills (SKILL.md)                                                |
| `.agents/skills/`             | クロスクライアント Skills (Cursor / Codex / Gemini 等が読む)                 |
| `.claude/commands/`           | Claude Code スラッシュコマンド                                               |
| `.claude/hooks/`              | Claude Code フックスクリプト                                                 |
| `.claude/apm-hooks.json`      | APM がフック登録に用いる索引                                                 |
| `.claude/settings.json`       | フック有効化等のクライアント設定                                             |
| `.github/instructions/`       | GitHub Copilot 用 instructions (`*.instructions.md`)                         |
| `.github/prompts/`            | GitHub Copilot プロンプト (`*.prompt.md`)                                    |
| `.github/hooks/`              | GitHub 用フック (Copilot CLI 等)                                             |

`.claude/settings.json` を ignore しているのは、APM がプラグインのフック有効化のために絶対パスを書き込むため (リポジトリで共有しても各環境でパスが食い違って意味がない)。個人の Claude Code 設定はユーザースコープ (`~/.claude/settings.json`) または `.claude/settings.local.json` (Claude Code の慣習で per-user 扱い) に置くこと。
