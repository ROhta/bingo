// DOM
const startButton = document.querySelector("#start-button") as HTMLElement
const resetButton = document.querySelector("#reset-button") as HTMLElement

// 可変な設定値を引数として渡す
// prettier-ignore
const doms = new DomManipulation(
    new NumberList(),
    document.querySelector("#bingo-number") as HTMLElement,
    startButton,
    resetButton,
    document.querySelector("#history-title") as HTMLElement,
    document.querySelector("#history-display") as HTMLElement,
    "col-2",
    document.querySelector("#drum") as HTMLMediaElement,
    document.querySelector("#cymbals") as HTMLMediaElement,
    150
)

// main
startButton.focus()
startButton.addEventListener("click", (): void => doms.rouletteAction())
resetButton.addEventListener("click", (): void => doms.resetAction())
