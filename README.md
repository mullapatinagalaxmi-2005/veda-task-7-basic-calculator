const display = document.getElementById("display");

let currentInput = "0";
let previousInput = null;
let operator = null;
let waitingForNumber = false;
let shouldReset = false;

function updateDisplay() {
    display.value = currentInput;
}

function enterNumber(number) {
    if (shouldReset) {
        currentInput = number === "." ? "0." : number;
        shouldReset = false;
        return updateDisplay();
    }

    if (waitingForNumber) {
        currentInput = number === "." ? "0." : number;
        waitingForNumber = false;
        return updateDisplay();
    }

    if (number === ".") {
        if (currentInput.includes(".")) return;
        currentInput += ".";
    } else {
        currentInput = currentInput === "0"
            ? number
            : currentInput + number;
    }

    updateDisplay();
}

function calculate(a, b, op) {
    switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/":
            if (b === 0) return null;
            return a / b;
        default: return b;
    }
}

function chooseOperator(nextOperator) {
    const inputValue = Number(currentInput);

    if (operator && !waitingForNumber) {
        const result = calculate(
            previousInput,
            inputValue,
            operator
        );

        if (result === null || !Number.isFinite(result)) {
            showError();
            return;
        }

        currentInput = String(Number(result.toPrecision(12)));
        updateDisplay();
        previousInput = Number(currentInput);
    } else {
        previousInput = inputValue;
    }

    operator = nextOperator;
    waitingForNumber = true;
    shouldReset = false;
}

function showError() {
    currentInput = "Cannot divide by zero";
    previousInput = null;
    operator = null;
    waitingForNumber = true;
    shouldReset = true;
    updateDisplay();
}

function performCalculation() {
    if (operator === null || previousInput === null) return;

    const secondInput = Number(currentInput);
    const result = calculate(previousInput, secondInput, operator);

    if (result === null || !Number.isFinite(result)) {
        showError();
        return;
    }

    currentInput = String(Number(result.toPrecision(12)));
    previousInput = null;
    operator = null;
    waitingForNumber = false;
    shouldReset = true;

    updateDisplay();
}

function clearCalculator() {
    currentInput = "0";
    previousInput = null;
    operator = null;
    waitingForNumber = false;
    shouldReset = false;
    updateDisplay();
}

function deleteLastDigit() {
    if (shouldReset || waitingForNumber) {
        currentInput = "0";
        shouldReset = false;
        waitingForNumber = false;
    } else {
        currentInput = currentInput.length > 1
            ? currentInput.slice(0, -1)
            : "0";

        if (currentInput === "-") currentInput = "0";
    }

    updateDisplay();
}

document.querySelector(".buttons").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.number !== undefined) {
        enterNumber(button.dataset.number);
    } else if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
    } else if (button.dataset.action === "equals") {
        performCalculation();
    } else if (button.dataset.action === "clear") {
        clearCalculator();
    } else if (button.dataset.action === "delete") {
        deleteLastDigit();
    }
});

updateDisplay();