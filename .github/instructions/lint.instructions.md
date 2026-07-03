---
description: Lint・整形ツール (eslint, prettier, husky, lint-staged) と tsconfig 方針
applyTo: "**/{package.json,tsconfig.json,*.ts}"
---

# Lint と整形ツール

- eslint と prettier が git commit 時に発火する
  - husky と lint-staged で設定
- eslint と prettier の設定は `package.json` に集約
  - 設定ファイルを作成せず、一覧性を追求
  - eslint は独自設定せず、recommend のルールに準拠
- `tsconfig` は、[@tsconfig/strictest](https://github.com/tsconfig/bases/blob/main/bases/strictest.json) のルールをさらに厳格にして適用
