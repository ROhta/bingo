// DOM
const startButton = document.querySelector("#start-button") as HTMLElement
const resetButton = document.querySelector("#reset-button") as HTMLElement

const numberList = new NumberList()
const doms = new DomManipulation(
    numberList,
    document.querySelector("#bingo-number") as HTMLElement,
    startButton,
    resetButton,
    document.querySelector("#history-title") as HTMLElement,
    document.querySelector("#history-display") as HTMLElement,
    document.querySelector("#drum") as HTMLMediaElement,
    document.querySelector("#cymbals") as HTMLMediaElement,
    150
)

// main
startButton.focus()
startButton.addEventListener("click", (): void => {
    doms.playMusic()
})

resetButton.addEventListener("click", (): void => {
    doms.resetAction()
})
