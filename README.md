# Bingo Machine

## 使用方法

- git clone
- `npm ci`
- `npm run build`
- ブラウザでindex.htmlを開く

## 機能

- startを押す
  - ドラムロールが鳴る
  - 左上部の数字が一定間隔でランダム表示される
  - start/stopボタンは`stop`となる
  - ドラムロールが鳴り終わると自動的に数字が選択され、`stop`表示になる
- stopを押す
  - ドラムロールが止まる
  - シンバルが鳴る
  - 左上部の数字のランダム表示が止まる
  - 止まった=選択された数字がHistoriesに加わる
  - start/stopボタンは`start`となる
- resetを押す
  - confirmを出す
  - Historiesに表示されている数字を全消去する
  - 左上部の数字は00となる
  - confirm中、画面の変動は無い
    - 数字選択中にresetを押下した場合、ドラムロールは鳴り続けるが、数字のランダム表示は停止する
- reload時
  - start/stopボタンは`start`となる
  - 左上部の数字は00となる
  - Historiesはresetされず、表示されたままとなる

## 技術

### styling

- cssファイルは存在しない
- bootstrap4に完全依存
- bootstrapで賄えない部分のみ、style要素で指定

### TypeScript

- LocalStorageによる履歴機能を実装
- dom.tsでは、DOMに依存するeventを管理
- numberList.tsでは、DOMに依存しないメソッドをclassに紐づけて管理

## copyright

- Copyright 2019 ROhta
- apache2.0
- ./LiCENSEに記載
