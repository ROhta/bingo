"use strict";
const startText = "START";
const stopText = "STOP";
const rouletteInterval = 150;
const $bingoNumber = $("#bingo-number");
const $startButton = $("#start-button");
const $histories = $("#histories");
const $drum = $("#drum").get(0);
const $cymbals = $("#cymbals").get(0);
const numbers = new NumberList();
const addHistory = (n) => {
    $histories.append(`<p class="col-md-2">${String(n).padStart(2, "0")}</p>`);
};
const loadedHistories = numbers.getHistoryList();
if (numbers.getRemainList().length === 0 && loadedHistories.length === 0) {
    numbers.resetLists();
}
else {
    loadedHistories.forEach((value) => addHistory(value));
}
let isStarted = false;
$startButton.focus().on("click", () => {
    const chooseNumber = () => {
        if (!isStarted)
            return;
        $startButton.text(startText);
        const remains = numbers.getRemainList();
        const i = numbers.getRandomNumber(remains.length);
        const randomNum = remains.length === 0 ? -1 : remains[i];
        remains.splice(i, 1);
        numbers.setRemainList(remains);
        const histories = numbers.getHistoryList();
        histories.push(randomNum);
        numbers.setHistoryList(histories);
        $bingoNumber.text(String(randomNum).padStart(2, "0"));
        addHistory(randomNum);
        $drum.pause();
        $cymbals.currentTime = 0;
        $cymbals.play();
        isStarted = false;
    };
    const roulette = () => {
        if (!isStarted)
            return;
        if ($drum.currentTime < $drum.duration) {
            const rouletteNumbers = numbers.getRemainList();
            $bingoNumber.text(String(rouletteNumbers[numbers.getRandomNumber(rouletteNumbers.length)]).padStart(2, "0"));
            setTimeout(roulette, rouletteInterval);
        }
        else {
            chooseNumber();
        }
    };
    if (isStarted) {
        chooseNumber();
    }
    else {
        $startButton.text(stopText);
        $cymbals.pause();
        $drum.currentTime = 0;
        $drum.play();
        isStarted = true;
        roulette();
    }
});
$("#reset-button").on("click", () => {
    if (confirm("Do you really want to reset?")) {
        numbers.resetLists();
        isStarted = false;
        $histories.empty();
        $drum.pause();
        $startButton.text(startText);
        $bingoNumber.text("00");
        $startButton.focus();
    }
});
//# sourceMappingURL=dom.js.map