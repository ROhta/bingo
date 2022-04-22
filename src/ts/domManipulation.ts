// 固定値は予めメンバ変数として保持する
class DomManipulation {
	private isStarted = false
	private firstDisplayNumber = "00"
	private startText = "START"
	private stopText = "STOP"
	private resetText = "RESET"
	private historyTitleText = "Hit Numbers"
	private loadedHistories = this.numbers.getHistoryList()

	// prettier-ignore
	constructor(
		private numbers: NumberList,
		private bingoNumber: HTMLElement,
		private startButton: HTMLElement,
		private resetButton: HTMLElement,
		private historyTitle: HTMLElement,
		private historyDisplay: HTMLElement,
		private historyDisplayClassName: string,
		private drum: HTMLMediaElement,
		private cymbals: HTMLMediaElement,
		private rouletteInterval: number
	) {
		if (this.rouletteInterval <= 0) console.error("Interval should be natural number!")

		this.bingoNumber.innerHTML = this.firstDisplayNumber
		this.startButton.innerHTML = this.startText
		this.resetButton.innerHTML = this.resetText
		this.historyTitle.innerHTML = this.historyTitleText

		if (this.numbers.getRemainList().length === 0 && this.loadedHistories.length === 0) {
			this.numbers.resetLists()
		} else {
			this.loadedHistories.forEach((n: number) => this.addHistory(n))
		}
	}

	private makeZeroPaddingNumString = (n: number): string => String(n).padStart(2, "0")

	private addHistory = (n: number): void => {
		const historyNumber = document.createElement("p")
		historyNumber.className = this.historyDisplayClassName
		historyNumber.innerHTML = this.makeZeroPaddingNumString(n)
		this.historyDisplay.appendChild(historyNumber)
	}

	private chooseNumber = (): void => {
		if (!this.isStarted) return
		this.startButton.innerHTML = this.startText

		const remains = this.numbers.getRemainList()
		const i = this.numbers.generateRandomNumber(remains.length)
		const choosedNumber = remains.length === 0 ? -1 : (remains[i] as number)

		remains.splice(i, 1)
		this.numbers.setRemainList(remains)

		const histories = this.numbers.getHistoryList()
		histories.push(choosedNumber)
		this.numbers.setHistoryList(histories)

		this.bingoNumber.innerHTML = this.makeZeroPaddingNumString(choosedNumber)
		this.addHistory(choosedNumber)

		this.drum.pause()
		this.cymbals.currentTime = 0
		this.cymbals.play()

		this.isStarted = false
	}

	private playRoulette = (): void => {
		if (!this.isStarted) return
		if (this.drum.currentTime < this.drum.duration) {
			const rouletteNumbers = this.numbers.getRemainList()
			this.bingoNumber.innerHTML = this.makeZeroPaddingNumString(rouletteNumbers[this.numbers.generateRandomNumber(rouletteNumbers.length)] as number)
			setTimeout(this.playRoulette, this.rouletteInterval)
		} else {
			this.chooseNumber()
		}
	}

	public rouletteAction = (): void => {
		if (this.isStarted) {
			this.chooseNumber()
		} else {
			this.startButton.innerHTML = this.stopText

			this.cymbals.pause()
			this.drum.currentTime = 0
			this.drum.play()

			this.isStarted = true
			this.playRoulette()
		}
	}

	public resetAction = (): void => {
		if (confirm("Do you really want to reset?")) {
			this.numbers.resetLists()
			this.isStarted = false

			this.historyDisplay.innerHTML = ""
			this.drum.pause()
			this.startButton.innerHTML = this.startText
			this.bingoNumber.innerHTML = this.firstDisplayNumber
			this.startButton.focus()
		}
	}
}
