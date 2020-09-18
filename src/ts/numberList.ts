class NumberList {
	private remainListKey
	private historyListKey
	private allNumberList

	constructor() {
		this.remainListKey = "remainNumberList"
		this.historyListKey = "historiesNumberList"

		this.allNumberList = []
		const maxBingoNumber = 75
		for (let i = 1; i <= maxBingoNumber; i++) this.allNumberList.push(i)
	}

	public getRandomNumber(n: number): number {
		return Math.floor(Math.random() * n)
	}

	public getRemainList(): number[] {
		const remains = localStorage.getItem(this.remainListKey) || ""
		return remains === "" ? [] : JSON.parse(remains)
	}

	public getHistoryList(): number[] {
		const histories = localStorage.getItem(this.historyListKey) || ""
		return histories === "" ? [] : JSON.parse(histories)
	}

	public setRemainList(remains: number[]): void {
		localStorage.setItem(this.remainListKey, JSON.stringify(remains))
	}

	public setHistoryList(histories: number[]): void {
		localStorage.setItem(this.historyListKey, JSON.stringify(histories))
	}

	public resetLists(): void {
		localStorage.removeItem(this.historyListKey)
		localStorage.removeItem(this.remainListKey)
		this.setRemainList(this.allNumberList)
		this.setHistoryList([])
	}
}
