// config
const startText = "START"
const stopText = "STOP"
const rouletteInterval: number = 150

// DOM
const bingoNumber = document.querySelector("#bingo-number") as HTMLElement
const startButton = document.querySelector("#start-button") as HTMLElement
const resetButton = document.querySelector("#reset-button") as HTMLElement
const histories = document.querySelector("#histories") as HTMLElement

const drum = document.querySelector("#drum") as HTMLMediaElement
const cymbals = document.querySelector("#cymbals") as HTMLMediaElement

const numberList = new NumberList()
const doms = new DomManipulation(numberList)
// const addHistory = (n: number): void => {
//     histories.insertAdjacentHTML("afterbegin", `<p class="col-md-2"> ${String(n).padStart(2, "0")} </p>`)
// }

// reload時にlocalStorageの情報を引き継ぐ
// const loadedHistories: number[] = numbers.getHistoryList()
// if (numbers.getRemainList().length === 0 && loadedHistories.length === 0) {
//     numbers.resetLists()
// } else {
//     loadedHistories.forEach((n: number) => addHistory(n))
// }

// let isStarted = false
startButton.focus()
startButton.addEventListener("click", (): void => {
    doms.playMusic()
    // const chooseNumber = (): void => {
    //     if (!isStarted) return
    //     startButton.innerHTML = startText

    //     const remains = numbers.getRemainList()
    //     const i = numbers.getRandomNumber(remains.length)
    //     const randomNum = remains.length === 0 ? -1 : remains[i]

    //     remains.splice(i, 1)
    //     numbers.setRemainList(remains)

    //     const histories = numbers.getHistoryList()
    //     histories.push(randomNum)
    //     numbers.setHistoryList(histories)

    //     bingoNumber.innerHTML = (String(randomNum).padStart(2, "0"))
    //     addHistory(randomNum)

    //     drum.pause()
    //     cymbals.currentTime = 0
    //     cymbals.play()

    //     isStarted = false
    // }

    // const roulette = (): void => {
    //     if (!isStarted) return
    //     if (drum.currentTime < drum.duration) {
    //         const rouletteNumbers = numbers.getRemainList()
    //         bingoNumber.innerHTML = String(rouletteNumbers[numbers.getRandomNumber(rouletteNumbers.length)]).padStart(2, "0")
    //         setTimeout(roulette, rouletteInterval)
    //     } else {
    //         chooseNumber()
    //     }
    // }

    // if (isStarted) {
    //     chooseNumber()
    // } else {
    //     startButton.innerHTML = stopText

    //     cymbals.pause()
    //     drum.currentTime = 0
    //     drum.play()

    //     isStarted = true
    //     roulette()
    // }
})

resetButton.addEventListener("click", (): void => {
    doms.resetAction()
    // if (confirm("Do you really want to reset?")) {
    //     numbers.resetLists()
    //     isStarted = false

    //     histories.innerHTML = ""
    //     drum.pause()
    //     startButton.innerHTML = startText
    //     bingoNumber.innerHTML = "00"
    //     startButton.focus()
    // }
})
