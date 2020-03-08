"use strict";
class NumberList {
    constructor() {
        this.remainListKey = "remainNumberList";
        this.historyListKey = "historiesNumberList";
        this.allNumberList = [];
        const maxBingoNumber = 75;
        for (let i = 1; i <= maxBingoNumber; i++)
            this.allNumberList.push(i);
    }
    getRandomNumber(n) {
        return Math.floor(Math.random() * n);
    }
    getRemainList() {
        const remains = localStorage.getItem(this.remainListKey) || "";
        return remains === "" ? [] : JSON.parse(remains);
    }
    getHistoryList() {
        const histories = localStorage.getItem(this.historyListKey) || "";
        return histories === "" ? [] : JSON.parse(histories);
    }
    setRemainList(remains) {
        localStorage.setItem(this.remainListKey, JSON.stringify(remains));
    }
    setHistoryList(histories) {
        localStorage.setItem(this.historyListKey, JSON.stringify(histories));
    }
    resetLists() {
        localStorage.removeItem(this.historyListKey);
        localStorage.removeItem(this.remainListKey);
        this.setRemainList(this.allNumberList);
        this.setHistoryList([]);
    }
}
//# sourceMappingURL=numberList.js.map