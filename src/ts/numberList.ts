class NumberList {
	private remainListKey = "remainNumberList"
	private historyListKey = "historiesNumberList"
	private maxBingoNumber = 75
	private allNumberList: number[] = []

	constructor() { for (let i = 1; i <= this.maxBingoNumber; i++) this.allNumberList.push(i) }

	private getListFromLocalStorage(key: string): number[] {
		const value = localStorage.getItem(key) || ""
		return value === "" ? [] : JSON.parse(value)
	}

	private setListOnLocalStorage = (key: string, list: number[]): void => localStorage.setItem(key, JSON.stringify(list))

	public getRemainList = (): number[] => this.getListFromLocalStorage(this.remainListKey)

	public getHistoryList = (): number[] => this.getListFromLocalStorage(this.historyListKey)

	public setRemainList = (remains: number[]): void => this.setListOnLocalStorage(this.remainListKey, remains)

	public setHistoryList = (histories: number[]): void => this.setListOnLocalStorage(this.historyListKey, histories)

	public generateRandomNumber = (n: number): number => Math.floor(Math.random() * n)

	public resetLists(): void {
		localStorage.removeItem(this.historyListKey)
		localStorage.removeItem(this.remainListKey)
		this.setRemainList(this.allNumberList)
		this.setHistoryList([])
	}
}
