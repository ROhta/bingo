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
			ret = JSON.parse(localStorage.getItem(key) || "")
			if (!Array.isArray(ret)) throw new Error("There is no Array in the localStorage!")
			for (const i of ret) if (typeof i !== "number") throw new Error("The array contains non-digit character in the localStorage!")
		} catch (e: unknown) {
			if (e instanceof Error) console.error(e.name, e.message, e.stack)
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
