---
description: ローカル開発時のフロー (実装完了から PR 作成、PR レビュー応答ループ) を superpowers 系スキルで定義
applyTo: "**"
---

# ローカル開発ワークフロー (AI エージェント向け)

このプロジェクトでローカル開発を進める AI エージェントは、以下のワークフローに従う。

## 前提: superpowers の存在確認

本ワークフローは [superpowers](https://github.com/anthropics/superpowers) 系スキル
(`verification-before-completion` / `requesting-code-review` / `receiving-code-review`
/ `finishing-a-development-branch`) が利用可能であることを前提とする。

- **Claude Code**: 上記 4 つのスキルが `Skill` ツールから呼び出せることを起動時に確認する
- **Codex CLI / GitHub Copilot 等**: 同等のスキル集が読み込まれているかを確認する

利用できない場合は、ユーザーに次のように案内し、本ワークフローの実行をその場で中断する。

> superpowers が見つかりません。
> 当プロジェクトのローカル開発フローを実行するには superpowers のインストールが必要です。
> インストール後に再度同じ指示をお願いします。

## 1. 実装完了から PR 作成まで

実装が完了したと判断した時点で、以下を順に実行する。**前ステップが完了するまで次に進まない。**

1. `verification-before-completion` を起動し、検証 (lint / typecheck / 実機動作) を完遂する
2. 検証が通ったら `requesting-code-review` を起動し、レビュー依頼側ワークフローを開始する
3. レビュー結果が返ってきたら `receiving-code-review` を起動してフィードバックに対応する
4. 対応が完了したら `finishing-a-development-branch` を起動し、選択肢「2」を選んで PR を作成する

各ステップで失敗した場合は次に進まず、失敗の根本原因を解決してから再実行する。

## 2. PR レビュー応答ループ (git push 毎)

PR に対してコミットを push した後、AI エージェント (GitHub Copilot Review 等) からの
レビュー指摘が付いた場合、push の度に以下を繰り返す。**すべてのスレッドが resolve
されるまでループを継続する。**

### 2.1 検知

`gh api graphql` で未 resolve なレビュースレッドを列挙する。
`gh pr view --json reviews,comments` は thread の `isResolved` を返さないので利用しない。

レビュースレッド数が 100 を、または各スレッドのコメント数が 50 を超える可能性がある
場合は、`pageInfo { hasNextPage endCursor }` を取得し、`hasNextPage: true` の間は
`after: $cursor` を渡してカーソル送りで全件取得すること (下記は初回ページの取得例)。

```bash
gh api graphql -f query='
query($owner: String!, $repo: String!, $pr: Int!, $threadsCursor: String, $commentsCursor: String) {
  repository(owner: $owner, name: $repo) {
    pullRequest(number: $pr) {
      reviewThreads(first: 100, after: $threadsCursor) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id            # GraphQL Node ID — resolveReviewThread mutation の threadId に渡す
          isResolved
          comments(first: 50, after: $commentsCursor) {
            pageInfo { hasNextPage endCursor }
            nodes {
              id          # GraphQL Node ID
              databaseId  # 数値 ID — REST API /pulls/comments/{comment_id}/replies の comment_id に渡す
              author { login }
              body
              path
              line
            }
          }
        }
      }
    }
  }
}' -F owner=<owner> -F repo=<repo> -F pr=<number>
```

対象は `isResolved: false` かつ author が bot (例: `copilot-pull-request-reviewer[bot]`) の
スレッドのみとする。

### 2.2 妥当性判断

各指摘について次のいずれかに分類する。

- **妥当**: 反映すべき具体的かつ正当な指摘
- **不当**: 文脈を踏まえると採用すべきでない、誤読、二重指摘 等

### 2.3 対応

#### 妥当な指摘

1. 指摘に従ってコードを修正する
2. 修正をコミットする (このリポジトリでは Co-Authored-By トレーラは付与しない)
3. 該当インラインコメントに返信する。本文に対応コミットの SHA を **前後に半角空白を入れて**
   記載し、GitHub UI でコミットへのリンクとして描画させる。

   ```bash
   gh api repos/<owner>/<repo>/pulls/<pr>/comments/<comment_database_id>/replies \
     -f body='対応しました abc1234 '
   ```

   - `<comment_database_id>` は上記クエリの `databaseId` フィールド (**数値 ID**) を指す。
     GraphQL Node ID (`PRRC_...`) は REST API では受け付けられない点に注意。
   - 本文は日本語で記述 (`pr-review.instructions.md` 参照)
   - SHA の前後を必ず半角空白で挟む
4. スレッドを resolve する。

   ```bash
   gh api graphql -f query='
   mutation($id: ID!) { resolveReviewThread(input: {threadId: $id}) { thread { isResolved } } }
   ' -F id=<thread_node_id>
   ```

#### 不当と判断した場合

1. コードは変更しない
2. インラインコメントで「不当と判断した理由」を日本語で具体的に記載する
3. スレッドを resolve する (上記 mutation 参照)

### 2.4 繰り返し

- 全スレッドを resolve するまで 2.1〜2.3 をループする
- 次の `git push` が発生したら、再度 2.1 から実行する

## 関連ルール

- レビュー応答の文章ルールは [`pr-review.instructions.md`](./pr-review.instructions.md) に従う
- 開発フローの高レベル順序は [`dev-workflow.instructions.md`](./dev-workflow.instructions.md) を参照
