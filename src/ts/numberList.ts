export default class NumberList {
	readonly #remainListKey = "remainNumberList"
	readonly #historyListKey = "historyNumberList"
	readonly #minBingoNumber = 1
	readonly #maxBingoNumber = 75
	readonly #allNumberList: readonly number[] = Array.from({length: this.#maxBingoNumber - this.#minBingoNumber + 1}, (_, i) => i + this.#minBingoNumber)

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

	#isBingoNumber = (v: unknown): v is number => typeof v === "number" && v >= this.#minBingoNumber && v <= this.#maxBingoNumber

	#getListFromLocalStorage(key: string): number[] {
		let ret: number[] = []
		try {
			ret = JSON.parse(localStorage.getItem(key) ?? "null")
			if (!Array.isArray(ret)) return []
			if (!ret.every(this.#isBingoNumber)) throw new Error("The array contains invalid Bingo numbers in the localStorage!")
		} catch (e: unknown) {
			if (e instanceof Error) throw new Error(e.message, {cause: e})
		}
		return ret
	}

	#setListOnLocalStorage = (key: string, list: number[]): void => localStorage.setItem(key, JSON.stringify(list))

	generateRandomNumber = (n: number): number => {
		const buf = new Uint32Array(1)
		crypto.getRandomValues(buf)
		return Math.floor(((buf[0] ?? 0) / 2 ** 32) * n)
	}

	resetLists(): void {
		localStorage.removeItem(this.#historyListKey)
		localStorage.removeItem(this.#remainListKey)
		this.remainList = [...this.#allNumberList]
		this.historyList = []
	}
}
