// ID指定をtypoすると実行時エラーになる（type guardが大変で省略した）
const startButton = document.querySelector("#start-button") as HTMLButtonElement
const resetButton = document.querySelector("#reset-button") as HTMLButtonElement

// 可変な設定値を引数として渡す
// prettier-ignore
const doms = new DomManipulation(
	document.querySelector("#bingo-number") as HTMLParagraphElement,
	startButton,
	resetButton,
	document.querySelector("#history-title") as HTMLParagraphElement,
	document.querySelector("#history-display") as HTMLDivElement,
	"col-2",
	new Audio("#drum"),
	new Audio("#cymbals"),
	150
)

// main
startButton.focus()
startButton.addEventListener("click", (): void => {
	try {
		doms.rouletteAction()
	} catch (e: unknown) {
		if (e instanceof Error) console.error(e.name, e.message, e.stack)
	}
})
resetButton.addEventListener("click", (): void => doms.resetAction())
