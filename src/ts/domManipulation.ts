class DomManipulation {
	private loadedHistories
	private isStarted = false
	private startText = "START"
	private stopText = "STOP"
	private firstDisplayNumber = "00"

	constructor(
		private numbers: NumberList,
		private bingoNumber: HTMLElement,
		private historyDisplay: HTMLElement,
		private startButton: HTMLElement,
		private drum: HTMLMediaElement,
		private cymbals: HTMLMediaElement,
		private rouletteInterval: number
	) {
		if (this.rouletteInterval <= 0) console.error("Interval should be positive number!")

		this.loadedHistories = this.numbers.getHistoryList()
		if (this.numbers.getRemainList().length === 0 && this.loadedHistories.length === 0) {
			this.numbers.resetLists()
		} else {
			this.loadedHistories.forEach((n: number) => this.addHistory(n))
		}
	}

	private addHistory = (n: number): void => {
		this.historyDisplay.insertAdjacentHTML("afterbegin", `<p class="col-md-2"> ${String(n).padStart(2, "0")} </p>`)
	}

	private chooseNumber = (): void => {
		if (!this.isStarted) return

		this.startButton.innerHTML = this.startText

		const remains = this.numbers.getRemainList()
		const i = this.numbers.getRandomNumber(remains.length)
		const randomNum = remains.length === 0 ? -1 : remains[i]

		remains.splice(i, 1)
		this.numbers.setRemainList(remains)

		const histories = this.numbers.getHistoryList()
		histories.push(randomNum)
		this.numbers.setHistoryList(histories)

		this.bingoNumber.innerHTML = (String(randomNum).padStart(2, "0"))
		this.addHistory(randomNum)

		this.drum.pause()
		this.cymbals.currentTime = 0
		this.cymbals.play()

		this.isStarted = false
	}

	private roulette = (): void => {
		if (!this.isStarted) return
		if (this.drum.currentTime < this.drum.duration) {
			const rouletteNumbers = this.numbers.getRemainList()
			this.bingoNumber.innerHTML = String(rouletteNumbers[this.numbers.getRandomNumber(rouletteNumbers.length)]).padStart(2, "0")
			setTimeout(this.roulette, this.rouletteInterval)
		} else {
			this.chooseNumber()
		}
	}

	public playMusic = (): void => {
		if (this.isStarted) {
			this.chooseNumber()
		} else {
			this.startButton.innerHTML = this.stopText

			this.cymbals.pause()
			this.drum.currentTime = 0
			this.drum.play()

			this.isStarted = true
			this.roulette()
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