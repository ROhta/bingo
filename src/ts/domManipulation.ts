import NumberList from "./numberList.js"

// 固定値は予めメンバ変数として保持する
export default class DomManipulation {
	#isStarted = false
	readonly #numbers = new NumberList()
	readonly #firstDisplayNumber = "00"
	readonly #startText = "START"
	readonly #stopText = "STOP"
	readonly #bingoNumber: HTMLParagraphElement
	readonly #startButton: HTMLButtonElement
	readonly #historyDisplay: HTMLDivElement
	readonly #historyDisplayClassName: string
	readonly #drum: HTMLAudioElement
	readonly #cymbals: HTMLAudioElement
	readonly #resetDialog: HTMLDialogElement
	readonly #rouletteInterval: number

	constructor(bingoNumber: HTMLParagraphElement, startButton: HTMLButtonElement, historyDisplay: HTMLDivElement, historyDisplayClassName: string, drum: HTMLAudioElement, cymbals: HTMLAudioElement, resetDialog: HTMLDialogElement, rouletteInterval: number) {
		if (rouletteInterval <= 0) console.error("Interval should be natural number!")

		this.#bingoNumber = bingoNumber
		this.#startButton = startButton
		this.#historyDisplay = historyDisplay
		this.#historyDisplayClassName = historyDisplayClassName
		this.#drum = drum
		this.#cymbals = cymbals
		this.#resetDialog = resetDialog
		this.#rouletteInterval = rouletteInterval

		this.#resetDialog.addEventListener("close", () => {
			if (this.#resetDialog.returnValue === "ok") this.#performReset()
		})

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
		historyNumberElement.textContent = this.#zeroPad(n)
		this.#historyDisplay.append(historyNumberElement)
	}

	#wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

	#performReset = (): void => {
		this.#numbers.resetLists()
		this.#isStarted = false

		this.#historyDisplay.replaceChildren()
		this.#drum.pause()
		this.#startButton.textContent = this.#startText
		this.#bingoNumber.textContent = this.#firstDisplayNumber
		this.#startButton.focus()
	}

	#chooseNumber = (): void => {
		if (!this.#isStarted) return
		this.#startButton.textContent = this.#startText

		const remains = this.#numbers.remainList
		const i = this.#numbers.generateRandomNumber(remains.length)
		const choosedNumber = remains[i]
		if (typeof choosedNumber === "number") {
			remains.splice(i, 1)
			this.#numbers.remainList = remains

			const histories = this.#numbers.historyList
			histories.push(choosedNumber)
			this.#numbers.historyList = histories

			this.#bingoNumber.textContent = this.#zeroPad(choosedNumber)
			this.#addHistory(choosedNumber)
		} else {
			throw new Error("Index out of bounds. Check the method!")
		}

		this.#drum.pause()
		this.#cymbals.currentTime = 0
		void this.#cymbals.play().catch((e: unknown) => {
			if (e instanceof Error) console.error(e.name, e.message, e.stack)
		})

		this.#isStarted = false
	}

	#playRoulette = async (): Promise<void> => {
		while (this.#isStarted && this.#drum.currentTime < this.#drum.duration) {
			const rouletteNumber = this.#numbers.remainList.at(this.#numbers.generateRandomNumber(this.#numbers.remainList.length))
			if (typeof rouletteNumber !== "number") throw new Error("Something is wrong with localStorage!")
			this.#bingoNumber.textContent = this.#zeroPad(rouletteNumber)
			await this.#wait(this.#rouletteInterval)
		}
		if (!this.#isStarted) return
		try {
			this.#chooseNumber()
		} catch (e: unknown) {
			if (e instanceof Error) throw new Error(e.message, {cause: e})
		}
	}

	rouletteButtonAction = async (): Promise<void> => {
		if (this.#isStarted) {
			this.#chooseNumber()
			return
		}
		this.#startButton.textContent = this.#stopText

		this.#cymbals.pause()
		this.#drum.currentTime = 0
		void this.#drum.play().catch((e: unknown) => {
			if (e instanceof Error) console.error(e.name, e.message, e.stack)
		})

		this.#isStarted = true
		try {
			await this.#playRoulette()
		} catch (e: unknown) {
			if (e instanceof Error) console.error(e.name, e.message, e.stack)
		}
	}
}
