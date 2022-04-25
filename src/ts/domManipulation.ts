// 固定値は予めメンバ変数として保持する
class DomManipulation {
	private _isStarted = false
	private _firstDisplayNumber = "00"
	private _startText = "START"
	private _stopText = "STOP"
	private _resetText = "RESET"
	private _historyTitleText = "Hit Numbers"
	private _numbers: NumberList
	private _loadedHistories

	// prettier-ignore
	constructor(
		private _bingoNumber: HTMLElement,
		private _startButton: HTMLElement,
		private _resetButton: HTMLElement,
		private _historyTitle: HTMLElement,
		private _historyDisplay: HTMLElement,
		private _historyDisplayClassName: string,
		private _drum: HTMLMediaElement,
		private _cymbals: HTMLMediaElement,
		private _rouletteInterval: number
	) {
		if (this._rouletteInterval <= 0) console.error("Interval should be natural number!")

		this._bingoNumber.innerHTML = this._firstDisplayNumber
		this._startButton.innerHTML = this._startText
		this._resetButton.innerHTML = this._resetText
		this._historyTitle.innerHTML = this._historyTitleText

		this._numbers = new NumberList
		this._loadedHistories = this._numbers.getHistoryList()

		if (this._numbers.getRemainList().length === 0 && this._loadedHistories.length === 0) {
			this._numbers.resetLists()
		} else {
			this._loadedHistories.forEach((n: number) => this.addHistory(n))
		}
	}

	private makeZeroPaddingNumString = (n: number): string => String(n).padStart(2, "0")

	private addHistory = (n: number): void => {
		const historyNumber = document.createElement("p")
		historyNumber.className = this._historyDisplayClassName
		historyNumber.innerHTML = this.makeZeroPaddingNumString(n)
		this._historyDisplay.appendChild(historyNumber)
	}

	private chooseNumber = (): void => {
		if (!this._isStarted) return
		this._startButton.innerHTML = this._startText

		const remains = this._numbers.getRemainList()
		const i = this._numbers.generateRandomNumber(remains.length)
		const choosedNumber = remains.length === 0 ? -1 : (remains[i] as number)

		remains.splice(i, 1)
		this._numbers.setRemainList(remains)

		const histories = this._numbers.getHistoryList()
		histories.push(choosedNumber)
		this._numbers.setHistoryList(histories)

		this._bingoNumber.innerHTML = this.makeZeroPaddingNumString(choosedNumber)
		this.addHistory(choosedNumber)

		this._drum.pause()
		this._cymbals.currentTime = 0
		this._cymbals.play()

		this._isStarted = false
	}

	private playRoulette = (): void => {
		if (!this._isStarted) return
		if (this._drum.currentTime < this._drum.duration) {
			const rouletteNumbers = this._numbers.getRemainList()
			this._bingoNumber.innerHTML = this.makeZeroPaddingNumString(rouletteNumbers[this._numbers.generateRandomNumber(rouletteNumbers.length)] as number)
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
