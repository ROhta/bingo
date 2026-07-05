# Bingo Machine

パーティ向けビンゴ抽選機。

## ドキュメント

AI エージェント向け指示と人間用ドキュメントを共通化しており、ディレクトリ単位に適用する開発方針は[`instructions/`](https://github.com/ROhta/bingo/tree/main/.apm/instructions) に、 仕様書等の意思決定履歴は[`context/`](https://github.com/ROhta/bingo/tree/main/.apm/context) に集約しています。

### instructions

| ファイル                                                                                              | 内容                                                         |
| ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [`setup`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/setup.instructions.md)           | 本番環境・ローカル環境構築手順                               |
| [`typescript`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/typescript.instructions.md) | TypeScript 実装の責務分担と履歴永続化方針                    |
| [`styling`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/styling.instructions.md)       | スタイリング方針 (Bootstrap5 / Google Fonts)                 |
| [`lint`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/lint.instructions.md)             | Lint・整形ツールと `tsconfig` 方針                           |
| [`github-ops`](https://github.com/ROhta/bingo/blob/main/.apm/instructions/github-ops.instructions.md) | GitHub Actions・セキュリティ・リリースノート・コードオーナー |

### context

| ファイル                                                                                        | 内容                              |
| ----------------------------------------------------------------------------------------------- | --------------------------------- |
| [`feature-spec`](https://github.com/ROhta/bingo/blob/main/.apm/context/feature-spec.context.md) | 機能仕様 (状態遷移図・操作別挙動) |

他リポジトリ共通の指示 は共通パッケージ [`ROhta/apm-config`](https://github.com/ROhta/apm-config) から `apm install` で配信され、ローカルの `.apm/instructions/` には保持しません。共通指示を変更したい場合は apm-config を編集します。

これらは [microsoft/apm](https://github.com/microsoft/apm) によって管理され、`apm compile` で Claude Code / Codex / GitHub Copilot 向けファイル (`CLAUDE.md` / `AGENTS.md` / `.claude/rules/` / `.github/instructions/`) にローカルで展開されます。ローカルでのみAIエージェントに読ませる想定のため、apmの成果物はgit管理しません。

## MCP

共通 MCP サーバー (context7 / serena / deepwiki / chrome-devtools) も apm-config/mcp-toolkit から配信されます。うち chrome-devtools は transitive なプラグイン参照のため、導入時は `apm install --trust-transitive-mcp` が必要です (初回は解決のみで、2 回目の実行で設定が完了することがあります)。
