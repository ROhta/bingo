class NumberList {
	private _remainListKey = "remainNumberList"
	private _historyListKey = "historyNumberList"
	private _minBingoNumber = 1
	private _maxBingoNumber = 75
	private _allNumberList: number[] = []

	constructor() {
		for (let i = this._minBingoNumber; i <= this._maxBingoNumber; i++) this._allNumberList.push(i)
	}

	private getListFromLocalStorage(key: string): number[] {
		const value = localStorage.getItem(key) || ""
		return value === "" ? [] : JSON.parse(value)
	}

	private setListOnLocalStorage = (key: string, list: number[]): void => localStorage.setItem(key, JSON.stringify(list))

	public getRemainList = (): number[] => this.getListFromLocalStorage(this._remainListKey)

	public getHistoryList = (): number[] => this.getListFromLocalStorage(this._historyListKey)

	public setRemainList = (remains: number[]): void => this.setListOnLocalStorage(this._remainListKey, remains)

	public setHistoryList = (histories: number[]): void => this.setListOnLocalStorage(this._historyListKey, histories)

	public generateRandomNumber = (n: number): number => Math.floor(Math.random() * n)

	public resetLists(): void {
		localStorage.removeItem(this._historyListKey)
		localStorage.removeItem(this._remainListKey)
		this.setRemainList(this._allNumberList)
		this.setHistoryList([])
	}
}
