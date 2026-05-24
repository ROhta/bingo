#!/usr/bin/env node
// APM CLI v0.14.1 が apm.lock.yaml の `deployed_files:` 配列に同一パスを
// 2 回ずつ出力する問題に対する post-process。隣接した同一の `- <value>`
// 行を 1 行に畳む (YAML パーサ非依存)。
import {readFileSync, writeFileSync} from "node:fs"

const PATH = "apm.lock.yaml"
const original = readFileSync(PATH, "utf-8")

let deduped = original
let prev
do {
	prev = deduped
	deduped = deduped.replace(/^([ \t]*-[ \t]+.+)$\n\1$/gm, "$1")
} while (deduped !== prev)

if (deduped === original) {
	console.log(`${PATH}: no adjacent duplicate array entries found.`)
	process.exit(0)
}

writeFileSync(PATH, deduped)
const removed = original.split("\n").length - deduped.split("\n").length
console.log(`${PATH}: removed ${removed} duplicate line(s).`)
