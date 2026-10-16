
const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let firstNumber = null;
let selectedOperator = null;
let startNewNumber = false;

function show(value) {
    display.value = value;
}

function calculate() {
    if (firstNumber === null || selectedOperator === null) {
        return;
    }

    const secondNumber = Number(display.value);
    let result;

    switch (selectedOperator) {
        case "+":
            result = firstNumber + secondNumber;
            break;
        case "-":
            result = firstNumber - secondNumber;
            break;
        case "*":
            result = firstNumber * secondNumber;
            break;
        case "/":
            if (secondNumber === 0) {
                show("Cannot divide by zero");
                firstNumber = null;
                selectedOperator = null;
                startNewNumber = true;
                return;
            }
            result = firstNumber / secondNumber;
            break;
        default:
            return;
    }

    show(String(Number(result.toPrecision(10))));
    firstNumber = null;
    selectedOperator = null;
    startNewNumber = true;
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.number !== undefined) {
        const number = button.dataset.number;

        if (startNewNumber) {
            show(number === "." ? "0." : number);
            startNewNumber = false;
        } else if (number === ".") {
            if (!display.value.includes(".")) {
                show(display.value + ".");
            }
        } else {
            show(display.value === "0"
                ? number
                : display.value + number);
        }
    }

    if (button.dataset.operator) {
        firstNumber = Number(display.value);
        selectedOperator = button.dataset.operator;
        startNewNumber = true;
    }

    if (button.dataset.action === "equals") {
        calculate();
    }

    if (button.dataset.action === "clear") {
        firstNumber = null;
        selectedOperator = null;
        startNewNumber = false;
        show("0");
    }

    if (button.dataset.action === "delete") {
        if (startNewNumber) {
            show("0");
            startNewNumber = false;
        } else {
            show(display.value.length > 1
                ? display.value.slice(0, -1)
                : "0");
        }
    }
});
