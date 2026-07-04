# Bingo Machine

パーティ向けビンゴ抽選機。

## ドキュメント

プロジェクト固有のドキュメント (環境構築・機能仕様・技術スタック・スタイリング・Lint・GitHub 運用) は AI エージェント向け指示と共通化しており、[`.apm/instructions/`](https://github.com/ROhta/bingo/tree/main/.apm/instructions) 配下に集約されています。

| ファイル                                                                                                  | 内容                                                         |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [`setup`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/setup.instructions.md)               | 本番環境・ローカル環境構築手順                               |
| [`feature-spec`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/feature-spec.instructions.md) | 機能仕様 (状態遷移図・操作別挙動)                            |
| [`typescript`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/typescript.instructions.md)     | TypeScript 実装の責務分担と履歴永続化方針                    |
| [`styling`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/styling.instructions.md)           | スタイリング方針 (Bootstrap5 / Google Fonts)                 |
| [`lint`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/lint.instructions.md)                 | Lint・整形ツールと `tsconfig` 方針                           |
| [`github-ops`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/github-ops.instructions.md)     | GitHub Actions・セキュリティ・リリースノート・コードオーナー |

全リポジトリ共通の指示 (開発・リリースフロー / PR レビュー方針 / APM 運用・プラグイン管理 / ローカル開発ワークフロー / MCP 運用 / 言語ルール) は共通パッケージ [`ROhta/apm-config`](https://github.com/ROhta/apm-config) から `apm install` で配信され、ローカルの `.apm/instructions/` には保持しません。共通指示を変更したい場合は apm-config を編集します。

これらは [microsoft/apm](https://github.com/microsoft/apm) によって管理され、`apm compile` で Claude Code / Codex / GitHub Copilot 向けファイル (`CLAUDE.md` / `AGENTS.md` / `.claude/rules/` / `.github/instructions/`) に展開されます。
