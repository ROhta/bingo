---
description: Bingo Machine の本番環境とローカル環境構築手順
applyTo: "**/{package.json,pnpm-lock.yaml,tsconfig.json}"
---

# 環境構築

## 本番環境

- [GitHub Pages](https://rohta.github.io/bingo/) で公開

## ローカル環境構築

- `git clone`
- node と pnpm を `package.json` で指定されたバージョンに設定
- `pnpm i --frozen-lockfile`
- `pnpm run dev`
