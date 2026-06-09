---
description: Bingo Machine の本番環境とローカル環境構築手順
applyTo: "**/{mise.toml,package.json,pnpm-lock.yaml,tsconfig.json}"
---

# 環境構築

## 本番環境

- [GitHub Pages](https://rohta.github.io/bingo/) で公開

## ローカル環境構築

- [mise](https://mise.jdx.dev/) (>= 2026.6.1) を導入する (node / pnpm / apm のバージョン管理に使用)
  - Linux ホストでは、pnpm (Node SEA バイナリ) が `libatomic.so.1` を要求するため `libatomic1` を導入しておく (例: `sudo apt-get install -y libatomic1`)。GitHub Actions の `ubuntu-latest` 等には標準装備のため CI では不要。
- `git clone`
- `mise trust && mise install` で `mise.toml` に固定された node / pnpm / apm を導入する
- `pnpm i --frozen-lockfile`
- `pnpm run dev`

## バージョン管理 (mise)

node / pnpm / apm CLI 本体のバージョンは `mise.toml` を唯一の真実源 (SSoT) とする。バージョンを上げる際は `mise.toml` を編集して `mise install` する (apm の `apm self-update` や `apm doctor` の更新催促には従わない)。CI も `jdx/mise-action` (mise 本体は `version: 2026.6.1` にピン) 経由で同じ `mise.toml` を消費する。mise 本体は最低 2026.6.1 を要する (これ未満では pnpm 11.5.2 の aqua アセット解決に失敗する)。
