---
description: GitHub 運用 (Actions, セキュリティ対策, リリースノート, コードオーナー)
applyTo: ".github/**"
---

# GitHub 運用

## GitHub Actions

- GitHub Pages への deploy
- 外形監視
- 依存モジュールの脆弱性検査
- 放置 Issue/PR の自動削除
- CodeQL で脆弱性を含むコードの検出 (TypeScript のみ)

### ツールチェーン (node / pnpm)

CI の node / pnpm は `mise.toml` を SSoT とし、`jdx/mise-action` (コミット SHA ピン・mise 本体は `version: 2026.6.1`) で導入する (`install_args: "node pnpm"` で対象を限定)。apm は CI では使用しないため導入しない。バージョン管理方針の詳細は [`setup.instructions.md`](./setup.instructions.md) を参照。

## セキュリティ対策

- [Security Policy](https://github.com/ROhta/bingo/security/policy) を参照

## リリースノート

- GitHub の機能を利用

## コードオーナー

- すべて @ROhta
