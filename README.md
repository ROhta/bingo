# Bingo Machine

パーティ向けビンゴ抽選機。

## ドキュメント

プロジェクトに関するすべてのドキュメント (環境構築・開発フロー・機能仕様・技術スタック・運用ルール・PR レビュー方針) は AI エージェント向け指示と共通化しており、[`.apm/instructions/`](https://github.com/ROhta/bingo/tree/main/.apm/instructions) 配下に集約されています。

| ファイル | 内容 |
| --- | --- |
| [`setup`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/setup.instructions.md) | 本番環境・ローカル環境構築手順 |
| [`dev-workflow`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/dev-workflow.instructions.md) | 開発フロー (開発者向け・リポジトリ管理者向け) |
| [`feature-spec`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/feature-spec.instructions.md) | 機能仕様 (状態遷移図・操作別挙動) |
| [`typescript`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/typescript.instructions.md) | TypeScript 実装の責務分担と履歴永続化方針 |
| [`styling`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/styling.instructions.md) | スタイリング方針 (Bootstrap5 / Google Fonts) |
| [`lint`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/lint.instructions.md) | Lint・整形ツールと `tsconfig` 方針 |
| [`github-ops`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/github-ops.instructions.md) | GitHub Actions・セキュリティ・リリースノート・コードオーナー |
| [`pr-review`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/pr-review.instructions.md) | PR レビュー時のコミュニケーション方針 |

これらは [microsoft/apm](https://github.com/microsoft/apm) によって管理され、`apm compile` で Claude Code / Codex / GitHub Copilot 向けファイル (`CLAUDE.md` / `AGENTS.md` / `.claude/rules/` / `.github/instructions/`) に展開されます。
