// DOM
const startButton = document.querySelector("#start-button") as HTMLElement
const resetButton = document.querySelector("#reset-button") as HTMLElement

const numberList = new NumberList()
const doms = new DomManipulation(
    numberList,
    document.querySelector("#bingo-number") as HTMLElement,
    document.querySelector("#histories") as HTMLElement,
    startButton,
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
