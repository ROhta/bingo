---
description: 開発フロー (開発者向け・リポジトリ管理者向け) のステップ定義
applyTo: "**"
---

# 開発の流れ

## 開発者

1. ブランチ作成
2. 開発
3. PR 作成
   - **必ず `.github/release.yml` の `changelog.categories` に対応するラベルを付与** (例: `bug-3 改善`, `enhance-2 新機能`, `enhance-1 破壊的変更`, `bug-1 重大バグ`, `bug-2 バグ`, `enhance-3 ドキュメント`, `dependencies`, `refactor`)
   - ラベル未付与の PR はリリースノートに出てこない (GitHub auto-generated changelog の挙動)
4. PR レビュー
5. PR マージ
6. 自動デプロイ

## リポジトリ管理者のみ

7. 必要と判断した場合、main ブランチでセマンティックバージョンによるタグ付け
   - 署名必須
   - annotation は 1 行目に件名 `メジャー・マイナー・パッチバージョンアップの理由`、2 行目を空行、3 行目以降にバージョンアップ理由を bullet (`- ` 始まり) で列挙
   - heredoc で annotation を `-F -` (stdin) に渡してコマンド実行:

     ```bash
     git tag -s -a v*.*.* -F - <<'EOF'
     メジャー・マイナー・パッチバージョンアップの理由

     - <バージョンアップ理由>
     EOF
     git push origin v*.*.*
     ```

8. 自動生成機能を用いてリリースノート作成 → ヘッダ表記を `変更点` に揃える

   ```bash
   # 8-1. release を作成 (notes は --generate-notes で auto-generate)
   gh release create v*.*.* --title 'v*.*.*' --generate-notes --latest --verify-tag

   # 8-2. デフォルトヘッダ "What's Changed" を "変更点" に置換
   #      (GitHub の release.yml は header field の上書きを公式サポートしないため自前で sed)
   gh release view v*.*.* --json body --jq '.body' \
     | sed 's/^## What.s Changed$/## 変更点/' > /tmp/release-notes.md
   gh release edit v*.*.* --notes-file /tmp/release-notes.md
   ```

   ラベル未付与の PR がリリースに出なかったことに後で気付いた場合は、PR にラベルを付けてから以下で再生成可能:

   ```bash
   gh api repos/<owner>/<repo>/releases/generate-notes -X POST \
     -f tag_name=v*.*.* -f previous_tag_name=v<prev>.<prev>.<prev> \
     --jq '.body' | sed 's/^## What.s Changed$/## 変更点/' > /tmp/release-notes.md
   gh release edit v*.*.* --notes-file /tmp/release-notes.md
   ```
