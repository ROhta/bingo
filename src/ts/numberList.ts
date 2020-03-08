class NumberList {
  private remainListKey: string
  private historyListKey: string
  private allNumberList: number[]

  constructor() {
    this.remainListKey = "remainNumberList"
    this.historyListKey = "historiesNumberList"

    this.allNumberList = []
    const maxBingoNumber: number = 75
    for (let i: number = 1; i <= maxBingoNumber; i++) this.allNumberList.push(i)
  }

  public getRandomNumber(n: number): number {
    return Math.floor(Math.random() * n)
  }

  public getRemainList(): number[] {
    const remains: string = localStorage.getItem(this.remainListKey) || ""
    return remains === "" ? [] : JSON.parse(remains)
  }

  public getHistoryList(): number[] {
    const histories: string = localStorage.getItem(this.historyListKey) || ""
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
