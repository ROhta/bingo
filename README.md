# Bingo Machine

## 本番環境

- [github pages](https://rohta.github.io/bingo/)で構築

## local環境構築

- git clone
- `npm ci`
- `npm run watch`
- ブラウザでindex.htmlを開く

## 機能

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

### styling

- cssファイルは存在しない
- bootstrap5に完全依存
    - レスポンシブ対応
- bootstrapで賄えない部分のみ、style要素で指定

### TypeScript

- localStorageによる履歴機能を実装
- domManipulation.tsでは、DOMに依存するメソッドをclassに紐づけて管理
- numberList.tsでは、DOMに依存しないメソッドをclassに紐づけて管理
    - 固定想定の値はこちらで管理
- index.tsで可変値を設定

### GitHub

#### GitHub actions

- GitHub Pagesへのdeploy
- 外形監視
- CodeQLで脆弱性を含むコードの検出（TypeScriptのみ）

#### 脆弱性対応

- dependabot.yml
  - module updateのPull Requestが週一で最大10件作成されるように設定

#### 各種テンプレート

- issue
- pull requests
- security policy

#### リリースノート

- GitHubの機能を利用

#### コードオーナー

- すべて @ROhta
