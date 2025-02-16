# Bingo Machine

## 本番環境

- [GitHub Pages](https://rohta.github.io/bingo/)で構築

## ローカル環境構築

- git clone
- nodeとpnpmをpackage.jsonで指定されたバージョンに設定
- `pnpm i --frozen-lockfile`
- `pnpm run dev`

## 開発の流れ

### 開発者

1. ブランチ作成
2. 開発
3. PR作成
4. PRレビュー
5. PRマージ
6. 自動デプロイ

### リポジトリ管理者のみ

7. 必要と判断した場合、mainブランチでセマンティックバージョンによるタグ付けa. 署名必須b. コメントにバージョンアップ理由を記載c. git-tag-message.txtを編集後、-Fオプションを用いてコマンド実行 `git tag -s -a v*.*.* -F git-tag-message.txt`
8. 自動生成機能を用いて、リリースノート作成

## 機能図

```mermaid
flowchart LR
RESET-->|確認ポップアップ/履歴消去|START-->|ドラムロール/数字ルーレット|STOP-->|シンバル/ランダム数字取得/履歴追加|START
```

## 機能詳細

- startを押す
  - ドラムロールが鳴る
  - 左上部の数字が一定間隔でランダム表示される
  - start/stopボタンは`stop`となる
  - ドラムロールが鳴り終わると自動的に数字が選択され、`stop`表示になる
- stopを押す
  - ドラムロールを停止する
  - シンバルが鳴動する
  - 左上部の数字のランダム表示を停止する
  - 止まった=選択された数字をHit Numbersに追加する
  - start/stopボタンは`start`となる
- resetを押す
  - confirmを出す
  - Hit Numbersに表示されている数字を全消去する
  - 左上部の数字は00となる
  - confirm中、画面の変動はない
    - 数字選択中にresetを押下した場合、ドラムロールは鳴り続けるが、数字のランダム表示は停止する
- reload時
  - start/stopボタンは`start`となる
  - 左上部の数字は00となる
  - Hit Numbersはresetされず、表示されたままとなる

## 技術

### Styling

- cssファイルは存在しない
- [Bootstrap5](https://getbootstrap.jp)に完全依存
  - レスポンシブ対応
  - Bootstrap5で賄えない部分のみ、style要素で指定
- fontは[Google Fonts](https://fonts.google.com)を使用

### TypeScript

#### 処理

- localStorageによる履歴機能を実装
- domManipulation.tsでは、DOMに依存するメソッドをclassに紐づけて管理
- numberList.tsでは、DOMに依存しないメソッドをclassに紐づけて管理
  - 固定想定の値はこちらで管理
- index.tsで可変値を設定

#### lint

- esLintとprettierがgit commit時に発火する
  - huskyとlint-stagedで設定
- esLintとprettierの設定はpackage.jsonに集約
  - 設定ファイルを作成せず、一覧性を追求
  - esLintは独自設定せず、recommendのルールに準拠
- tsconfigは、[@tsconfig/strictest](https://github.com/tsconfig/bases/blob/main/bases/strictest.json)のルールをさらに厳格にして適用

### GitHub

#### GitHub Actions

- GitHub Pagesへのdeploy
- 外形監視
- 依存モジュールの脆弱性検査
- 放置Issue/PRの自動削除
- CodeQLで脆弱性を含むコードの検出（TypeScriptのみ）

#### モジュールアップデート

- dependabot.yml
  - module updateのPull Requestが週一で最大10件作成されるように設定

#### 各種テンプレート

- Issue
- Pull Requests
- Security Policy

#### リリースノート

- GitHubの機能を利用

#### コードオーナー

- すべて@ROhta
