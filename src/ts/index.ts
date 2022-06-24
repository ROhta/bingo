import DomManipulation from "./domManipulation.js"

// DOM
const bingoNumber = document.querySelector("#bingo-number")
const startButton = document.querySelector("#start-button")
const resetButton = document.querySelector("#reset-button")
const historyTitle = document.querySelector("#history-title")
const historyDisplay = document.querySelector("#history-display")
const drum = document.querySelector("#drum")
const cymbals = document.querySelector("#cymbals")

if (bingoNumber instanceof HTMLParagraphElement && startButton instanceof HTMLButtonElement && resetButton instanceof HTMLButtonElement && historyTitle instanceof HTMLParagraphElement && historyDisplay instanceof HTMLDivElement && drum instanceof HTMLAudioElement && cymbals instanceof HTMLAudioElement) {
	// 可変な設定値を引数として渡す
	const doms = new DomManipulation(bingoNumber, startButton, resetButton, historyTitle, historyDisplay, "col-2", drum, cymbals, 150)

	// main
	startButton.focus()
	startButton.addEventListener("click", (): void => {
		try {
			doms.rouletteButtonAction()
		} catch (e: unknown) {
			if (e instanceof Error) console.error(e.name, e.message, e.stack)
		}
	})
	resetButton.addEventListener("click", (): void => doms.resetButtonAction())
} else {
	console.error("Check the IDs!")
}
