// 固定値は予めメンバ変数として保持する
class DomManipulation {
	private _isStarted = false
	private readonly _firstDisplayNumber = "00"
	private readonly _startText = "START"
	private readonly _stopText = "STOP"
	private readonly _resetText = "RESET"
	private readonly _historyTitleText = "Hit Numbers"
	private readonly _numbers: NumberList
	private readonly _loadedHistories

	// prettier-ignore
	constructor(
		private readonly _bingoNumber: HTMLElement,
		private readonly _startButton: HTMLElement,
		private readonly _resetButton: HTMLElement,
		private readonly _historyTitle: HTMLElement,
		private readonly _historyDisplay: HTMLElement,
		private readonly _historyDisplayClassName: string,
		private readonly _drum: HTMLMediaElement,
		private readonly _cymbals: HTMLMediaElement,
		private readonly _rouletteInterval: number
	) {
		if (this._rouletteInterval <= 0) console.error("Interval should be natural number!")

		this._bingoNumber.innerHTML = this._firstDisplayNumber
		this._startButton.innerHTML = this._startText
		this._resetButton.innerHTML = this._resetText
		this._historyTitle.innerHTML = this._historyTitleText

		this._numbers = new NumberList
		this._loadedHistories = this._numbers.historyList

		if (this._numbers.remainList.length === 0 && this._loadedHistories.length === 0) {
			this._numbers.resetLists()
		} else {
			this._loadedHistories.forEach((n: number) => this.addHistory(n))
		}
	}

	private zeroPad = (n: number): string => String(n).padStart(2, "0")

	private addHistory = (n: number): void => {
		const historyNumber = document.createElement("p")
		historyNumber.className = this._historyDisplayClassName
		historyNumber.innerHTML = this.zeroPad(n)
		this._historyDisplay.appendChild(historyNumber)
	}

	private chooseNumber = (): void => {
		if (!this._isStarted) return
		this._startButton.innerHTML = this._startText

		const remains = this._numbers.remainList
		const i = this._numbers.generateRandomNumber(remains.length)
		const choosedNumber = remains.length === 0 ? -1 : (remains[i] as number)

		remains.splice(i, 1)
		this._numbers.remainList = remains

		const histories = this._numbers.historyList
		histories.push(choosedNumber)
		this._numbers.historyList = histories

		this._bingoNumber.innerHTML = this.zeroPad(choosedNumber)
		this.addHistory(choosedNumber)

		this._drum.pause()
		this._cymbals.currentTime = 0
		this._cymbals.play()

		this._isStarted = false
	}

	private playRoulette = (): void => {
		if (!this._isStarted) return
		if (this._drum.currentTime < this._drum.duration) {
			const rouletteNumbers = this._numbers.remainList
			this._bingoNumber.innerHTML = this.zeroPad(rouletteNumbers[this._numbers.generateRandomNumber(rouletteNumbers.length)] as number)
			setTimeout(this.playRoulette, this._rouletteInterval)
		} else {
			this.chooseNumber()
		}
	}

	public rouletteAction = (): void => {
		if (this._isStarted) {
			this.chooseNumber()
		} else {
			this._startButton.innerHTML = this._stopText

			this._cymbals.pause()
			this._drum.currentTime = 0
			this._drum.play()

			this._isStarted = true
			this.playRoulette()
		}
	}

	public resetAction = (): void => {
		if (confirm("Do you really want to reset?")) {
			this._numbers.resetLists()
			this._isStarted = false

			this._historyDisplay.innerHTML = ""
			this._drum.pause()
			this._startButton.innerHTML = this._startText
			this._bingoNumber.innerHTML = this._firstDisplayNumber
			this._startButton.focus()
		}
	}
}
