import NumberList from "./numberList.js"

// 固定値は予めメンバ変数として保持する
export default class DomManipulation {
	#isStarted = false
	readonly #numbers = new NumberList()
	readonly #firstDisplayNumber = "00"
	readonly #startText = "START"
	readonly #stopText = "STOP"
	readonly #resetText = "RESET"
	readonly #historyTitleText = "Hit Numbers"
	readonly #bingoNumber: HTMLParagraphElement
	readonly #startButton: HTMLButtonElement
	readonly #resetButton: HTMLButtonElement
	readonly #historyTitle: HTMLParagraphElement
	readonly #historyDisplay: HTMLDivElement
	readonly #historyDisplayClassName: string
	readonly #drum: HTMLAudioElement
	readonly #cymbals: HTMLAudioElement
	readonly #rouletteInterval: number

	constructor(bingoNumber: HTMLParagraphElement, startButton: HTMLButtonElement, resetButton: HTMLButtonElement, historyTitle: HTMLParagraphElement, historyDisplay: HTMLDivElement, historyDisplayClassName: string, drum: HTMLAudioElement, cymbals: HTMLAudioElement, rouletteInterval: number) {
		if (rouletteInterval <= 0) console.error("Interval should be natural number!")

		this.#bingoNumber = bingoNumber
		this.#startButton = startButton
		this.#resetButton = resetButton
		this.#historyTitle = historyTitle
		this.#historyDisplay = historyDisplay
		this.#historyDisplayClassName = historyDisplayClassName
		this.#drum = drum
		this.#cymbals = cymbals
		this.#rouletteInterval = rouletteInterval

		this.#bingoNumber.innerHTML = this.#firstDisplayNumber
		this.#startButton.innerHTML = this.#startText
		this.#resetButton.innerHTML = this.#resetText
		this.#historyTitle.innerHTML = this.#historyTitleText

		if (this.#numbers.remainList.length === 0 && this.#numbers.historyList.length === 0) {
			this.#numbers.resetLists()
		} else {
			this.#numbers.historyList.forEach((n: number) => this.#addHistory(n))
		}
	}

	#zeroPad = (n: number): string => String(n).padStart(2, "0")

	#addHistory = (n: number): void => {
		const historyNumberElement = document.createElement("p")
		historyNumberElement.className = this.#historyDisplayClassName
		historyNumberElement.innerHTML = this.#zeroPad(n)
		this.#historyDisplay.appendChild(historyNumberElement)
	}

	#chooseNumber = (): void => {
		if (!this.#isStarted) return
		this.#startButton.innerHTML = this.#startText

		const remains = this.#numbers.remainList
		const i = this.#numbers.generateRandomNumber(remains.length)
		const choosedNumber = remains[i]
		if (typeof choosedNumber === "number") {
			remains.splice(i, 1)
			this.#numbers.remainList = remains

			const histories = this.#numbers.historyList
			histories.push(choosedNumber)
			this.#numbers.historyList = histories

			this.#bingoNumber.innerHTML = this.#zeroPad(choosedNumber)
			this.#addHistory(choosedNumber)
		} else {
			throw new Error("Index out of bounds. Check the method!")
		}

		this.#drum.pause()
		this.#cymbals.currentTime = 0
		this.#cymbals.play()

		this.#isStarted = false
	}

	#playRoulette = (): void => {
		if (!this.#isStarted) return
		if (this.#drum.currentTime < this.#drum.duration) {
			const rouletteNumber = this.#numbers.remainList.at(this.#numbers.generateRandomNumber(this.#numbers.remainList.length))
			if (typeof rouletteNumber === "number") {
				this.#bingoNumber.innerHTML = this.#zeroPad(rouletteNumber)
			} else {
				throw new Error("Something is wrong with localStorage!")
			}
			setTimeout(this.#playRoulette, this.#rouletteInterval)
		} else {
			try {
				this.#chooseNumber()
			} catch (e: unknown) {
				if (e instanceof Error) console.error(e.name, e.message, e.stack)
			}
		}
	}

	rouletteAction = (): void => {
		if (this.#isStarted) {
			this.#chooseNumber()
		} else {
			this.#startButton.innerHTML = this.#stopText

			this.#cymbals.pause()
			this.#drum.currentTime = 0
			this.#drum.play()

			this.#isStarted = true
			this.#playRoulette()
		}
	}

	resetAction = (): void => {
		if (confirm("Do you really want to reset?")) {
			this.#numbers.resetLists()
			this.#isStarted = false

			this.#historyDisplay.innerHTML = ""
			this.#drum.pause()
			this.#startButton.innerHTML = this.#startText
			this.#bingoNumber.innerHTML = this.#firstDisplayNumber
			this.#startButton.focus()
		}
	}
}
