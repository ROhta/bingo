---
description: TypeScript 実装の責務分担と履歴永続化方針
applyTo: "src/ts/**"
---

# TypeScript 実装方針

## 処理の責務分担

- `localStorage` による履歴機能を実装
- `domManipulation.ts` では、DOM に依存するメソッドを class に紐づけて管理
- `numberList.ts` では、DOM に依存しないメソッドを class に紐づけて管理
  - 固定想定の値はこちらで管理
- `index.ts` で可変値を設定
