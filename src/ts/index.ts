import DomManipulation from "./domManipulation.js"

const queryAs = <T extends Element>(selector: string, ctor: abstract new (...args: never[]) => T): T | null => {
	const el = document.querySelector(selector)
	return el instanceof ctor ? el : null
}

// DOM
const bingoNumber = queryAs("#bingo-number", HTMLParagraphElement)
const startButton = queryAs("#start-button", HTMLButtonElement)
const resetButton = queryAs("#reset-button", HTMLButtonElement)
const historyTitle = queryAs("#history-title", HTMLParagraphElement)
const historyDisplay = queryAs("#history-display", HTMLDivElement)
const drum = queryAs("#drum", HTMLAudioElement)
const cymbals = queryAs("#cymbals", HTMLAudioElement)
const resetDialog = queryAs("#reset-confirm", HTMLDialogElement)

if (bingoNumber && startButton && resetButton && historyTitle && historyDisplay && drum && cymbals && resetDialog) {
	// 可変な設定値を引数として渡す
	const doms = new DomManipulation(bingoNumber, startButton, resetButton, historyTitle, historyDisplay, "col-2", drum, cymbals, resetDialog, 150)

	// main
	startButton.focus()
	startButton.addEventListener("click", async (): Promise<void> => {
		try {
			await doms.rouletteButtonAction()
		} catch (e: unknown) {
			if (e instanceof Error) console.error(e.name, e.message, e.stack)
		}
	})
	resetButton.addEventListener("click", async (): Promise<void> => {
		try {
			await doms.resetButtonAction()
		} catch (e: unknown) {
			if (e instanceof Error) console.error(e.name, e.message, e.stack)
		}
	})
} else {
	console.error("Check the IDs!")
}
