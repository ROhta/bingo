# mise によるバージョン管理 (node / pnpm / apm) 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `mise.toml` を node / pnpm / apm のバージョン情報の唯一の真実源 (SSoT) とし、`package.json` の `engines` を撤去、ローカルと CI を mise ベースに統一する。

**Architecture:** リポジトリ直下の `mise.toml` に node/pnpm/apm を exact ピン。ローカルは `mise install`、CI は `jdx/mise-action` (SHA ピン) で同じ `mise.toml` を消費する。apm は mise の `github` バックエンドで microsoft/apm の Release を取得 (PyInstaller onedir を `extract_all` で展開、`exe` で起動エントリ指定)。

**Tech Stack:** mise, jdx/mise-action, GitHub Actions, pnpm, TypeScript ビルド (`tsc`)。

**前提:** これはインフラ/設定の変更であり、ユニットテスト対象コードは無い。各タスクの「テスト」は**検証コマンド + 期待出力**で表現する。作業は既存ブランチ `chore/mise-version-management` (PR #383) 上で行い、各タスクごとにコミットする。`Co-Authored-By` トレーラは付与しない。

**確定バージョン:** node `24.16.0` / pnpm `11.5.2` / apm `0.18.0`

---

## File Structure

| ファイル | 操作 | 責務 |
| --- | --- | --- |
| `mise.toml` | 新規 | node/pnpm/apm の SSoT |
| `package.json` | 修正 | `engines` ブロック削除 |
| `.github/workflows/deploy.yml` | 修正 | `Build` ジョブを mise-action 化 |
| `.github/workflows/dependency-review.yml` | 修正 | `Build-Check` ジョブを mise-action 化 |
| `.apm/instructions/setup.instructions.md` | 修正 | ローカル構築手順を mise ベースへ |
| `.apm/instructions/github-ops.instructions.md` | 修正 | CI が mise-action 経由になった旨 |
| `.apm/instructions/apm-workflow.instructions.md` | 修正 | apm CLI 本体の版は mise.toml 管理 |
| `README.md` | 確認のみ | バージョン直書き無しを確認 (変更なし想定) |

---

## Task 1: `mise.toml` を作成 (SSoT)

**Files:**
- Create: `mise.toml`

- [ ] **Step 1: `mise.toml` を作成**

ファイル全文 (リポジトリ直下):

```toml
[tools]
node = "24.16.0"
pnpm = "11.5.2"
"github:microsoft/apm" = { version = "0.18.0", exe = "apm", extract_all = "true" }
```

> 補足: `extract_all = "true"` は mise 公式ドキュメント (ubi/github backend) の正準表記であり、クォート付き文字列が正しい (PR #383 で検証・確定済み)。`true` に変更しないこと。

- [ ] **Step 2: 設定を trust**

Run: `mise trust mise.toml`
Expected: `mise trusted /home/ore/codes/bingo/mise.toml` (またはそれに準ずる trusted メッセージ)

- [ ] **Step 3: ツールを導入**

Run: `mise install`
Expected: node 24.16.0 / pnpm 11.5.2 / github:microsoft/apm 0.18.0 がインストールされ、apm は SLSA provenance / artifact attestation 検証を通過して `✓ installed` となる。

- [ ] **Step 4: 解決バージョンを検証**

Run: `mise current`
Expected (順不同):
```
node 24.16.0
pnpm 11.5.2
github:microsoft/apm 0.18.0
```

Run: `mise exec -- node --version && mise exec -- pnpm --version && mise exec -- apm --version`
Expected:
```
v24.16.0
11.5.2
Agent Package Manager (APM) CLI version 0.18.0 (c393f33)
```

- [ ] **Step 5: pnpm が mise tool として解決されることを検証**

Run: `mise which pnpm`
Expected: `/home/ore/.local/share/mise/installs/pnpm/11.5.2/...` 配下のパス (node install ディレクトリ配下ではないこと)

- [ ] **Step 6: 既存のインストール/ビルドが通ることを検証**

Run: `mise exec -- pnpm i --frozen-lockfile`
Expected: lockfile 不整合エラーなく完了 (lockfileVersion 9.0 / pnpm 11.x 互換)

Run: `mise exec -- pnpm run build`
Expected: `tsc -b` が成功し終了コード 0

- [ ] **Step 7: コミット**

```bash
git add mise.toml
git commit -m "feat: mise.toml を追加し node/pnpm/apm を SSoT 管理"
```

---

## Task 2: `package.json` の `engines` を削除

**Files:**
- Modify: `package.json`

- [ ] **Step 1: `engines` ブロックを削除**

`package.json` の以下のブロック (タブインデント) を**丸ごと削除**する。位置は `scripts` ブロック直後・`husky` ブロック直前。

削除対象 (この4行):
```json
	"engines": {
		"node": ">=24.16.0",
		"pnpm": ">=11.1.2"
	},
```

削除後、`scripts` の閉じ `},` の直後に `"husky": {` が続く形になること。

- [ ] **Step 2: JSON が壊れていないことを検証**

Run: `mise exec -- node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('ok')"`
Expected: `ok`

Run: `mise exec -- node -e "const p=require('./package.json'); console.log('engines' in p ? 'STILL PRESENT' : 'removed')"`
Expected: `removed`

- [ ] **Step 3: engines 撤去後もインストールが通ることを検証**

Run: `mise exec -- pnpm i --frozen-lockfile`
Expected: engine 関連の警告/エラーなく完了 (`.npmrc` に engine-strict 無し)

- [ ] **Step 4: コミット**

`prepare`/husky の pre-commit (lint-staged → prettier) が `package.json` を整形する場合があるため、整形結果ごとコミットする。

```bash
git add package.json
git commit -m "chore: package.json の engines を削除 (mise.toml に一本化)"
```

---

## Task 3: `deploy.yml` の `Build` ジョブを mise-action 化

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: `Build` ジョブを書き換え**

`jobs.Build` の (a) `strategy.matrix` ブロックを削除し、(b) `actions/setup-node` と `pnpm/action-setup` の2ステップを `jdx/mise-action` の1ステップに置換する。他ステップ (permissions monitor / Confirm Check / checkout / actionlint / Install / Build / Clean Up / Upload) は維持する。

置換前 (該当部分):
```yaml
  Build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [24.16.0]
    timeout-minutes: 5
    permissions: {}
    steps:
```
置換後:
```yaml
  Build:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions: {}
    steps:
```

置換前 (該当部分):
```yaml
      - uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
        with:
          node-version: ${{ matrix.node-version }}
          check-latest: true
      - uses: pnpm/action-setup@0e279bb959325dab635dd2c09392533439d90093 # v6.0.8
        with:
          version: 11.1.2
```
置換後:
```yaml
      # node / pnpm のバージョンは mise.toml を SSoT とする。mise 本体は最新を使用 (各ツールは exact ピンのため解決結果は不変)。apm は CI で不要なので install 対象外。
      - uses: jdx/mise-action@dba19683ed58901619b14f395a24841710cb4925 # v4.1.0
        with:
          install_args: "node pnpm"
```

- [ ] **Step 2: actionlint で検証**

Run:
```bash
docker run --rm -v "$(pwd):$(pwd)" -w "$(pwd)" rhysd/actionlint:1.7.4
```
Expected: 終了コード 0、エラー出力なし。

> docker が使えない環境の場合はこのローカル検証をスキップし、CI の "Run actionlint in workflow Directory" ステップ (deploy.yml 内) と push 後の Actions 実行に委ねる旨をコミットメッセージ/PR に明記すること。

- [ ] **Step 3: コミット**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy.yml の node/pnpm 導入を mise-action に置換"
```

---

## Task 4: `dependency-review.yml` の `Build-Check` ジョブを mise-action 化

**Files:**
- Modify: `.github/workflows/dependency-review.yml`

- [ ] **Step 1: `Build-Check` ジョブを書き換え**

`jobs.Build-Check` のみ変更する (`jobs.Dependency-Review` は node 不使用のため変更しない)。

置換前:
```yaml
  Build-Check:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [24.16.0]
    timeout-minutes: 3
    permissions: {}
    steps:
```
置換後:
```yaml
  Build-Check:
    runs-on: ubuntu-latest
    timeout-minutes: 3
    permissions: {}
    steps:
```

置換前:
```yaml
      - uses: actions/setup-node@48b55a011bda9f5d6aeb4c2d9c7362e8dae4041e # v6.4.0
        with:
          node-version: ${{ matrix.node-version }}
          check-latest: true
      - uses: pnpm/action-setup@0e279bb959325dab635dd2c09392533439d90093 # v6.0.8
        with:
          version: 11.1.2
```
置換後:
```yaml
      # node / pnpm のバージョンは mise.toml を SSoT とする。apm は CI で不要なので install 対象外。
      - uses: jdx/mise-action@dba19683ed58901619b14f395a24841710cb4925 # v4.1.0
        with:
          install_args: "node pnpm"
```

- [ ] **Step 2: actionlint で検証**

Run:
```bash
docker run --rm -v "$(pwd):$(pwd)" -w "$(pwd)" rhysd/actionlint:1.7.4
```
Expected: 終了コード 0、エラー出力なし。(docker 不可なら Task 3 Step 2 と同様に CI 委譲)

- [ ] **Step 3: コミット**

```bash
git add .github/workflows/dependency-review.yml
git commit -m "ci: dependency-review.yml の node/pnpm 導入を mise-action に置換"
```

---

## Task 5: ドキュメントを mise ベースへ更新

**Files:**
- Modify: `.apm/instructions/setup.instructions.md`
- Modify: `.apm/instructions/github-ops.instructions.md`
- Modify: `.apm/instructions/apm-workflow.instructions.md`

- [ ] **Step 1: `setup.instructions.md` のローカル構築手順を更新**

置換前:
```markdown
## ローカル環境構築

- `git clone`
- node と pnpm を `package.json` で指定されたバージョンに設定
- `pnpm i --frozen-lockfile`
- `pnpm run dev`
```
置換後:
```markdown
## ローカル環境構築

- [mise](https://mise.jdx.dev/) を導入する (node / pnpm / apm のバージョン管理に使用)
- `git clone`
- `mise trust && mise install` で `mise.toml` に固定された node / pnpm / apm を導入する
- `pnpm i --frozen-lockfile`
- `pnpm run dev`

## バージョン管理 (mise)

node / pnpm / apm CLI 本体のバージョンは `mise.toml` を唯一の真実源 (SSoT) とする。
バージョンを上げる際は `mise.toml` を編集して `mise install` する (apm の `apm self-update` や
`apm doctor` の更新催促には従わない)。CI も `jdx/mise-action` 経由で同じ `mise.toml` を消費する。
```

- [ ] **Step 2: `github-ops.instructions.md` の GitHub Actions 節を更新**

置換前:
```markdown
## GitHub Actions

- GitHub Pages への deploy
- 外形監視
- 依存モジュールの脆弱性検査
- 放置 Issue/PR の自動削除
- CodeQL で脆弱性を含むコードの検出 (TypeScript のみ)
```
置換後:
```markdown
## GitHub Actions

- GitHub Pages への deploy
- 外形監視
- 依存モジュールの脆弱性検査
- 放置 Issue/PR の自動削除
- CodeQL で脆弱性を含むコードの検出 (TypeScript のみ)

### ツールチェーン (node / pnpm)

CI の node / pnpm は `mise.toml` を SSoT とし、`jdx/mise-action` (コミット SHA ピン) で導入する
(`install_args: "node pnpm"` で対象を限定)。apm は CI では使用しないため導入しない。
```

- [ ] **Step 3: `apm-workflow.instructions.md` に apm CLI バージョン管理の節を追記**

`## Source of Truth` 節の直後に以下の節を挿入する:
```markdown
## APM CLI 本体のバージョン

APM CLI 本体 (`apm` バイナリ) のバージョンは `mise.toml` (`github:microsoft/apm`) を SSoT として
管理する。更新は `mise.toml` の version を上げて `mise install` する。`apm self-update` や
`apm doctor` の更新催促には従わない (mise 管理外のグローバルインストールを増やさないため)。
```

- [ ] **Step 4: ドキュメント整合性を検証**

Run: `mise exec -- pnpm exec prettier --check ".apm/instructions/*.md"`
Expected: 対象ファイルが `prettier` 整形済み (差分なし)。差分があれば次の Run で整形する。

Run (必要時): `mise exec -- pnpm exec prettier --write ".apm/instructions/*.md"`
Expected: 整形完了。

- [ ] **Step 5: README にバージョン直書きが無いことを確認 (変更なし想定)**

Run: `git grep -nE "24\.1[0-9]\.[0-9]|11\.[0-9]+\.[0-9]+|engines" -- README.md`
Expected: ヒットなし (出力空)。ヒットした場合のみ該当箇所を mise ベースの表現に修正する。

- [ ] **Step 6: コミット**

husky pre-commit (lint-staged → prettier) が md を整形するためそれごとコミットする。

```bash
git add .apm/instructions/setup.instructions.md .apm/instructions/github-ops.instructions.md .apm/instructions/apm-workflow.instructions.md
git commit -m "docs: 環境構築/CI/APM 運用の記述を mise ベースに更新"
```

---

## Task 6: 最終検証・push・CI 確認

**Files:** なし (検証と push のみ)

- [ ] **Step 1: ローカル一括検証 (verification-before-completion 相当)**

Run:
```bash
mise exec -- pnpm i --frozen-lockfile && mise exec -- pnpm run build
```
Expected: 双方成功 (終了コード 0)。`pnpm run build` 後に生成された `src/ts/*.js` 等のビルド成果物は commit しない (元から git 管理外/clean であること)。

Run: `git status --porcelain`
Expected: 追跡対象の未コミット変更が無いこと (ビルド生成物のみが出る場合は無視 or 既存 .gitignore 範囲内であること)。

- [ ] **Step 2: push**

```bash
git push
```
Expected: `chore/mise-version-management` に反映され、PR #383 が更新される。

- [ ] **Step 3: CI の green を確認**

Run: `gh pr checks 383 --watch`
Expected: `Dependency Check / Build-Check` (mise-action 化を検証)、`Dependency Check / Dependency-Review`、および CodeQL (GitHub 既定設定) がすべて pass。

> **重要 (CI トリガの差異)**: `deploy.yml` は `on: push (branches: main)` / `workflow_dispatch` のみで、**PR では実行されない**。よって `deploy.yml` の `Build` ジョブ (mise-action 化) は PR の CI では検証されず、**main へマージ後の deploy 実行が初回**となる。PR 段階での `deploy.yml` の担保は (a) ローカル actionlint (Task 3 Step 2)、(b) PR で実際に走る `dependency-review.yml` の `Build-Check` と同一パターンであること、の2点。マージ後は次の Step で deploy を必ず確認する。

- [ ] **Step 3b: マージ後の deploy を確認 (マージ実施時)**

main へマージ後、`deploy.yml` が走るので mise-action 経由の `Build` ジョブ初回実行を確認する。

Run: `gh run list --workflow deploy.yml --branch main --limit 1`
その実行 ID に対し `gh run watch <run-id>`
Expected: `Build` (mise で node/pnpm 導入 → `pnpm run build`) と `Deploy` が成功し、GitHub Pages へ反映される。失敗時は mise-action の挙動 (特に `permissions: {}` 下での GitHub からの pnpm 取得レート制限) を確認し、必要なら `Build` ジョブに `permissions: { contents: read }` を付与する。

- [ ] **Step 4: Copilot レビュー応答ループ**

push により Copilot レビューが付いた場合は、`.apm/instructions/local-dev-workflow.instructions.md` の「PR レビュー応答ループ」(検知 → 妥当性判断 → 対応 → resolve) を全スレッド resolve まで実施する。

- [ ] **Step 5: PR ラベルの最終確認**

実装が乗ったことで PR は「ツール/バージョン管理 + ドキュメント」の変更となる。`.github/release.yml` の category 対応ラベル (`dependencies` 等) が適切か確認する (現状 `dependencies` 付与済み)。

---

## Self-Review メモ (この計画自体の確認結果)

- **Spec coverage**: spec の各項目に対応タスクあり — mise.toml(Task1) / engines 削除(Task2) / CI mise-action(Task3,4) / docs(Task5) / 検証(各タスク + Task6)。スコープ外 (dedupe-apm-lock、apm.yml 依存ピン) には意図的にタスクを設けていない。
- **Placeholder scan**: TBD/TODO 無し。すべての編集は old→new の具体ブロックとコマンド+期待出力で記述。
- **Type/値の一貫性**: バージョン (node 24.16.0 / pnpm 11.5.2 / apm 0.18.0)、mise-action SHA (`dba19683ed58901619b14f395a24841710cb4925` # v4.1.0)、`install_args: "node pnpm"`、`extract_all = "true"` が全タスクで一致。
