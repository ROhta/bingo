class NumberList {
	private readonly _remainListKey = "remainNumberList"
	private readonly _historyListKey = "historyNumberList"
	private readonly _minBingoNumber = 1
	private readonly _maxBingoNumber = 75
	private readonly _allNumberList: number[] = []

	constructor() {
		for (let i = this._minBingoNumber; i <= this._maxBingoNumber; i++) this._allNumberList.push(i)
	}

	get remainList(): number[] {
		return this.getListFromLocalStorage(this._remainListKey)
	}

	set remainList(remainsList: number[]) {
		this.setListOnLocalStorage(this._remainListKey, remainsList)
	}

	get historyList(): number[] {
		return this.getListFromLocalStorage(this._historyListKey)
	}

	set historyList(historiesList: number[]) {
		this.setListOnLocalStorage(this._historyListKey, historiesList)
	}

	private getListFromLocalStorage(key: string): number[] {
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

	private setListOnLocalStorage = (key: string, list: number[]): void => localStorage.setItem(key, JSON.stringify(list))

	public generateRandomNumber = (n: number): number => Math.floor(Math.random() * n)

	public resetLists(): void {
		localStorage.removeItem(this._historyListKey)
		localStorage.removeItem(this._remainListKey)
		this.remainList = this._allNumberList
		this.historyList = []
	}
}
