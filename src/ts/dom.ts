// config
const startText: string = "START"
const stopText: string = "STOP"
const rouletteInterval: number = 150

// DOM
const $bingoNumber: JQuery = $("#bingo-number")
const $startButton: JQuery = $("#start-button")
const $histories: JQuery = $("#histories")
const $drum: any = $("#drum").get(0)
const $cymbals: any = $("#cymbals").get(0)

const numbers = new NumberList()

const addHistory = (n: number): void => {
	$histories.append(`<p class="col-md-2">${String(n).padStart(2, "0")}</p>`)
}

// reload時にlocalStorageの情報を引き継ぐ
const loadedHistories: number[] = numbers.getHistoryList()
if (numbers.getRemainList().length === 0 && loadedHistories.length === 0) {
	numbers.resetLists()
} else {
	loadedHistories.forEach((value: number) => addHistory(value))
}

let isStarted: boolean = false
$startButton.focus().on("click", (): void => {
	const chooseNumber = (): void => {
		if (!isStarted) return
		$startButton.text(startText)

		const remains: number[] = numbers.getRemainList()
		const i: number = numbers.getRandomNumber(remains.length)
		const randomNum: number = remains.length === 0 ? -1 : remains[i]

		remains.splice(i, 1)
		numbers.setRemainList(remains)

		const histories: number[] = numbers.getHistoryList()
		histories.push(randomNum)
		numbers.setHistoryList(histories)

		$bingoNumber.text(String(randomNum).padStart(2, "0"))
		addHistory(randomNum)

		$drum.pause()
		$cymbals.currentTime = 0
		$cymbals.play()

		isStarted = false
	}

	const roulette = (): void => {
		if (!isStarted) return
		if ($drum.currentTime < $drum.duration) {
			const rouletteNumbers: number[] = numbers.getRemainList()
			$bingoNumber.text(
				String(
					rouletteNumbers[
					numbers.getRandomNumber(rouletteNumbers.length)
					]
				).padStart(2, "0")
			)
			setTimeout(roulette, rouletteInterval)
		} else {
			chooseNumber()
		}
	}

	if (isStarted) {
		chooseNumber()
	} else {
		$startButton.text(stopText)

		$cymbals.pause()
		$drum.currentTime = 0
		$drum.play()

		isStarted = true
		roulette()
	}
})

$("#reset-button").on("click", (): void => {
	if (confirm("Do you really want to reset?")) {
		numbers.resetLists()
		isStarted = false

		$histories.empty()
		$drum.pause()
		$startButton.text(startText)
		$bingoNumber.text("00")
		$startButton.focus()
	}
})
