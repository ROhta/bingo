class NumberList {
	private readonly _remainListKey = "remainNumberList"
	private readonly _historyListKey = "historyNumberList"
	private readonly _minBingoNumber = 1
	private readonly _maxBingoNumber = 75
	private readonly _allNumberList: number[] = []

	constructor() {
		for (let i = this._minBingoNumber; i <= this._maxBingoNumber; i++) this._allNumberList.push(i)
	}

	private getListFromLocalStorage(key: string): number[] {
		const value = localStorage.getItem(key) || ""
		return value === "" ? [] : JSON.parse(value)
	}

	private setListOnLocalStorage = (key: string, list: number[]): void => localStorage.setItem(key, JSON.stringify(list))

	get remainList(): number[] {
		return this.getListFromLocalStorage(this._remainListKey)
	}

	set remainList(remains: number[]) {
		this.setListOnLocalStorage(this._remainListKey, remains)
	}

	get historyList(): number[] {
		return this.getListFromLocalStorage(this._historyListKey)
	}

	set historyList(histories: number[]) {
		this.setListOnLocalStorage(this._historyListKey, histories)
	}

	public generateRandomNumber = (n: number): number => Math.floor(Math.random() * n)

	public resetLists(): void {
		localStorage.removeItem(this._historyListKey)
		localStorage.removeItem(this._remainListKey)
		this.remainList = this._allNumberList
		this.historyList = []
	}
}
