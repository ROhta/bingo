# mise によるバージョン管理 (node / pnpm / apm) 設計

- 作成日: 2026-06-09
- ブランチ: `chore/mise-version-management`

## 背景 / 動機

- 現状 node/pnpm は mise のグローバル設定 (`~/.config/mise/config.toml` の `node = "lts"`
  → 24.14.0) で動作しており、リポジトリ内にバージョン固定が存在しない。
- 結果として **ローカル node 24.14.0 が、package.json `engines.node >=24.16.0` および
  CI (`node-version: [24.16.0]`) を満たさずドリフトしている。**
- pnpm はローカル 11.2.2 / CI 11.1.2 / engines `>=11.1.2` と各所でバラついている。
- apm CLI は `/usr/local/bin/apm` (→ `/usr/local/lib/apm/`) に手動グローバルインストールされ、
  mise 管轄外。更新は `apm self-update` / `apm doctor` の催促任せ。
- バージョン情報の真実源が「package.json engines」「CI matrix」「各自の環境」に分散している。

## ゴール

- **`mise.toml` を node / pnpm / apm のバージョン情報の唯一の真実源 (SSoT) とする。**
- `package.json` の `engines` を削除し、それに依存していた処理 (CI) とドキュメントを
  mise ベースへ移行する。
- ローカルと CI の双方が `mise.toml` に追従する状態にする。

## 非ゴール / スコープ外

- `scripts/dedupe-apm-lock.mjs` 等の apm **v0.14.1** lock 重複ワークアラウンド
  (バージョン管理とは別件。0.18.0 で fix 済みかの撤去判断は別 PR とする)。
- `apm.yml` の依存プラグイン (`dependencies.apm`) の SHA ピン運用 (現状維持)。

## 確定バージョン

| ツール | バージョン | 根拠 |
| --- | --- | --- |
| node | `24.16.0` | 24 系最新。旧 `engines.node` / CI matrix と一致 |
| pnpm | `11.5.2` | 最新。lockfileVersion `9.0` (pnpm 11.x) 互換 |
| apm  | `0.18.0` | 最新リリース |

浮動指定 (`"24"` / `"latest"` 等) ではなく **exact ピン**とする。更新は `mise.toml` を編集して
行う。理由: 本リポジトリの「ドリフト防止 / frozen-lockfile / SHA ピン」文化と整合させ、
マシン間・時間経過での patch ブレを排除するため。

## 設計

### 1. `mise.toml` (新規・リポジトリ直下・git 追跡)

```toml
[tools]
node = "24.16.0"
pnpm = "11.5.2"
"github:microsoft/apm" = { version = "0.18.0", exe = "apm", extract_all = "true" }
```

- apm は mise の **`github` バックエンド**で [microsoft/apm](https://github.com/microsoft/apm)
  の GitHub Release (`apm-{os}-{arch}.tar.gz`) を取得する。
- apm は PyInstaller の **onedir** 形式 (実行ファイル `apm` が隣接する `_internal/` を必須とする)。
  `extract_all = "true"` でアーカイブ全体を展開し `apm` と `_internal/` を兄弟配置、
  `exe = "apm"` で起動エントリを指定する。
- **検証済み (実機)**: `github` バックエンドは deprecation 警告なしでインストールでき、
  SLSA provenance / GitHub Artifact Attestations を自動検証し、`apm --version` が
  正しく動作する (0.17.0 / 0.18.0 とも tarball 構造同一)。`ubi` バックエンドでも動作するが
  deprecated 警告が出るため不採用。

### 2. `package.json`

- `engines` (node / pnpm) ブロックを削除する。
- `.npmrc` の `engine-strict` は存在しないため、削除による pnpm 実行時の挙動変化は無い。

### 3. CI — `jdx/mise-action` で SSoT 追従

対象: `.github/workflows/deploy.yml`, `.github/workflows/dependency-review.yml`

- `actions/setup-node` と `pnpm/action-setup` のステップを `jdx/mise-action`
  (コミット SHA ピン + バージョンコメント、本リポジトリの action ピン規約に従う) に置換する。
- `node-version` の matrix を撤去する (バージョンは `mise.toml` が決定)。
- apm は CI で不要 (apm 生成物は `apm.lock.yaml` を除き gitignore 対象) なため、
  mise-action の導入対象を node / pnpm に限定する (`install_args: "node pnpm"` 相当)。
  実装時に mise-action の入力名・挙動を公式ドキュメントで確認する。
- 既存の `pnpm i --frozen-lockfile` / `pnpm run build` 等のステップは維持する。
- mise-action は新規 `mise.toml` を自動 trust する。

### 4. ドキュメント

- `.apm/instructions/setup.instructions.md`: 「node と pnpm を `package.json` で指定された
  バージョンに設定」を **mise ベース手順**へ書き換える。
  例: `mise trust` (初回) → `mise install` (node/pnpm/apm 導入) → `pnpm i --frozen-lockfile`
  → `pnpm run dev`。apm も mise 管理になった旨を追記。
- `.apm/instructions/github-ops.instructions.md`: CI が mise-action 経由になった旨を反映する。
- `.apm/instructions/apm-plugins.instructions.md` (または `apm-workflow.instructions.md`):
  apm CLI 本体の版は `mise.toml` で管理する旨を追記。`apm self-update` や doctor の更新催促では
  なく、`mise.toml` の版を上げて `mise install` する運用に変更する。
- `README.md`: バージョン番号の直書きは無いため編集不要 (要確認のみ)。

## 検証 (実装時に `verification-before-completion` で完遂)

1. `mise trust && mise install` → node 24.16.0 / pnpm 11.5.2 / apm 0.18.0 が導入される。
2. `which node pnpm apm` が mise 管理下を指す (特に pnpm が node install 配下でなく
   mise tool であること)。`apm --version` = 0.18.0。
3. `pnpm i --frozen-lockfile` (lockfileVersion 9.0 / pnpm 11.x 互換) → `pnpm run build` 成功。
4. workflow を push 後、deploy(Build) / dependency-review が green、actionlint パス。

## リスク / 留意点

- pnpm 11.1.2 → 11.5.2 は同 lockfileVersion 9.0 のため `--frozen-lockfile` 互換見込み。
  万一不整合なら別途 `pnpm-lock.yaml` の再生成が必要。
- mise-action 導入は、慎重に組まれた CI に新規 pinned action を 1 つ追加する。
  SHA ピン + actionlint で担保する。
- apm の github バックエンドは provenance 検証にネットワーク / gh を用いるが、
  CI では apm を導入しないため CI への影響は無い。

## ロールアウト

- 新規ブランチ `chore/mise-version-management` で実装する。
- 本リポジトリの `local-dev-workflow` (検証 → `requesting-code-review` →
  `receiving-code-review` → `finishing-a-development-branch` で PR 作成) に従う。
- コミットに `Co-Authored-By` トレーラは付与しない (本リポジトリ方針)。
