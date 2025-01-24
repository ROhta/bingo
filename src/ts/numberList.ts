export default class NumberList {
	readonly #remainListKey = "remainNumberList"
	readonly #historyListKey = "historyNumberList"
	readonly #minBingoNumber = 1
	readonly #maxBingoNumber = 75
	readonly #allNumberList: number[] = []

	constructor() {
		for (let i = this.#minBingoNumber; i <= this.#maxBingoNumber; i++) this.#allNumberList.push(i)
	}

	get remainList(): number[] {
		return this.#getListFromLocalStorage(this.#remainListKey)
	}

	set remainList(remainsList: number[]) {
		this.#setListOnLocalStorage(this.#remainListKey, remainsList)
	}

	get historyList(): number[] {
		return this.#getListFromLocalStorage(this.#historyListKey)
	}

	set historyList(historiesList: number[]) {
		this.#setListOnLocalStorage(this.#historyListKey, historiesList)
	}

	#getListFromLocalStorage(key: string): number[] {
		let ret: number[] = []
		try {
			ret = JSON.parse(localStorage.getItem(key) || "null")
			// 初めてのブラウザで開く場合を想定。localStorage にはkey自体が存在しないため、null対応する。
			if (!Array.isArray(ret)) return []
			for (const i of ret) {
				if (typeof i !== "number") throw new Error("The array contains non-digit character in the localStorage!")
				if (i < this.#minBingoNumber || i > this.#maxBingoNumber) throw new Error("Index out of bounds, not a Bingo number!")
			}
		} catch (e: unknown) {
			if (e instanceof Error) throw new Error(e.message, {cause: e})
		}
		return ret
	}

	#setListOnLocalStorage = (key: string, list: number[]): void => localStorage.setItem(key, JSON.stringify(list))

	generateRandomNumber = (n: number): number => Math.floor(Math.random() * n)

	resetLists(): void {
		localStorage.removeItem(this.#historyListKey)
		localStorage.removeItem(this.#remainListKey)
		this.remainList = this.#allNumberList
		this.historyList = []
	}
}
