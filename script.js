//BUTTONS =================================================
const numberButtons = document.querySelectorAll("button");
numberButtons.forEach((item) => {
    item.addEventListener("click", (event) => {
        interpret(event.target.innerText);
        updateScreen();
    });
});

//SCREEN ===================================================
const lowerScreen = document.querySelector(".lowerScreen");
const upperScreen = document.querySelector(".upperScreen");
function updateScreen() {
    if (!currentOperation.op) {
        upperScreen.innerText = "";
        lowerScreen.innerText = currentOperation.a;
    } else if (currentOperation) {
        upperScreen.innerText = currentOperation.a + currentOperation.opString;
        lowerScreen.innerText = currentOperation.b;
        if (currentOperation.result != undefined) {
            upperScreen.innerText =
                currentOperation.a +
                currentOperation.opString +
                currentOperation.b +
                "=";
            lowerScreen.innerText = currentOperation.result;
        }
    }
}

//INIT ====================================================
const oldOperations = [];
let currentOperation = newOperation(0);
function newOperation(a) {
    return {
        a: a,
        op: undefined,
        opString: undefined,
        b: undefined,
        result: undefined,
    };
}
function operate(operation) {
    let result = operation.op(operation.a, operation.b);
    if (result.toString().length > 14) {
        result = Number.parseFloat(result).toExponential(5);
    }
    return operation.op ? result : operation.a;
}
updateScreen();

//INTERPRETER =============================================
function interpret(string) {
    const hasResult = currentOperation.result != undefined;

    //String is Operation?
    const regexp = /[\+÷×-]/;
    if (regexp.test(string)) {
        if (hasResult) {
            currentOperation = newOperation(currentOperation.result);
        }
        if (currentOperation.b != undefined) {
            currentOperation.result = operate(currentOperation);
            currentOperation = newOperation(currentOperation.result);
        }
        if (!currentOperation.b) {
            currentOperation.b = 0;
        }

        currentOperation.opString = string;
        switch (string) {
            case "+":
                currentOperation.op = add;
                break;
            case "-":
                currentOperation.op = subtract;
                break;
            case "×":
                currentOperation.op = multiply;
                break;
            case "÷":
                currentOperation.op = divide;
                break;
        }
    }

    //String is operand?
    const isOperand = !Number.isNaN(Number(string)) || string == ".";
    const updateFirstOperand = currentOperation.op === undefined;
    const updateSecondOperand =
        currentOperation.op !== undefined &&
        currentOperation.result === undefined;
    if (isOperand) {
        if (hasResult && string != ".") {
            currentOperation = newOperation(string);
        }
        if (updateFirstOperand) updateOperand("a", string);
        if (updateSecondOperand) updateOperand("b", string);
    }
    //String is other commands?
    switch (string) {
        case "=":
            currentOperation.result = operate(currentOperation);
            break;
        case "CE":
            currentOperation = newOperation(0);
            break;
        case "DEL":
            if (updateFirstOperand) updateOperand("a", string);
            if (updateSecondOperand) updateOperand("b", string);
            break;
    }
    console.table(currentOperation);
}
function updateOperand(operand, string) {
    const alreadyDecimal = currentOperation[operand].toString().includes(".");
    const tooLong = currentOperation[operand].toString().length > 12;
    if (string === "." && alreadyDecimal) return;
    let operandString;
    if (string === "DEL") {
        let tmp = currentOperation[operand].toString();
        operandString = tmp.substring(0, tmp.length - 1);
        console.log("dsa");
    } else {
        if (!tooLong) {
            operandString = currentOperation[operand] += string;
        }
    }

    if (
        (operandString.slice(-1) == 0 &&
            currentOperation[operand].toString().includes(".")) ||
        operandString.slice(-1) == "."
    ) {
        return;
    }
    currentOperation[operand] = Number(operandString);
}

// MATH ===================================================
function add(a, b) {
    return Number(a) + Number(b);
}
function subtract(a, b) {
    return add(a, -b);
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    return a / b;
}
