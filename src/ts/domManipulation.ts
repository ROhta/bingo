class DomManipulation {
	private isStarted = false
	private loadedHistories

	constructor(private numbers: NumberList) {
		this.loadedHistories = this.numbers.getHistoryList()
		if (this.numbers.getRemainList().length === 0 && this.loadedHistories.length === 0) {
			this.numbers.resetLists()
		} else {
			this.loadedHistories.forEach((n: number) => this.addHistory(n))
		}
	}

	private addHistory = (n: number): void => {
		histories.insertAdjacentHTML("afterbegin", `<p class="col-md-2"> ${String(n).padStart(2, "0")} </p>`)
	}

	private chooseNumber = (): void => {
		if (!this.isStarted) return
		startButton.innerHTML = startText

		const remains = this.numbers.getRemainList()
		const i = this.numbers.getRandomNumber(remains.length)
		const randomNum = remains.length === 0 ? -1 : remains[i]

		remains.splice(i, 1)
		this.numbers.setRemainList(remains)

		const histories = this.numbers.getHistoryList()
		histories.push(randomNum)
		this.numbers.setHistoryList(histories)

		bingoNumber.innerHTML = (String(randomNum).padStart(2, "0"))
		this.addHistory(randomNum)

		drum.pause()
		cymbals.currentTime = 0
		cymbals.play()

		this.isStarted = false
	}

	private roulette = (): void => {
		if (!this.isStarted) return
		if (drum.currentTime < drum.duration) {
			const rouletteNumbers = this.numbers.getRemainList()
			bingoNumber.innerHTML = String(rouletteNumbers[this.numbers.getRandomNumber(rouletteNumbers.length)]).padStart(2, "0")
			setTimeout(this.roulette, rouletteInterval)
		} else {
			this.chooseNumber()
		}
	}

	public playMusic = (): void => {
		if (this.isStarted) {
			this.chooseNumber()
		} else {
			startButton.innerHTML = stopText

			cymbals.pause()
			drum.currentTime = 0
			drum.play()

			this.isStarted = true
			this.roulette()
		}
	}

	public resetAction = (): void => {
		if (confirm("Do you really want to reset?")) {
			this.numbers.resetLists()
			this.isStarted = false

			histories.innerHTML = ""
			drum.pause()
			startButton.innerHTML = startText
			bingoNumber.innerHTML = "00"
			startButton.focus()
		}
	}
}