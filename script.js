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
    return operation.op ? operation.op(operation.a, operation.b) : operation.a;
}
updateScreen();

//INTERPRETER =============================================
function interpret(string) {
    //LOGIC
    let isOperand = !Number.isNaN(Number(string)) || string == ".";
    const regexp = /[\+÷×-]/;
    const updateFirstOperand = !currentOperation.op;
    const updateSecondOperand =
        currentOperation.op && currentOperation.result == undefined;
    const updateOperation = regexp.test(string);
    const hasResult = currentOperation.result != undefined;

    //String is Operation?
    if (updateOperation) {
        if (hasResult) {
            currentOperation = newOperation(currentOperation.result);
        }
        if (currentOperation.b != undefined) {
            currentOperation.result = operate(currentOperation);
            currentOperation = newOperation(currentOperation.result);
        }
        if (!currentOperation.b) currentOperation.b = 0;

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
    if (isOperand) {
        if (hasResult && string != '.') {
            currentOperation = newOperation(string);
        }
        if (updateFirstOperand) {
            console.log('dsa')
            let tempString = (currentOperation.a += string);
            if (tempString.slice(-1) != ".") {
                currentOperation.a = Number(tempString);
            }
        }
        if (updateSecondOperand) {
            let tempString = (currentOperation.b += string);
            if (tempString.slice(-1) != ".") {
                currentOperation.b = Number(tempString);
            }
        }
    }
    //String is other commands?
    switch (string) {
        case "=":
            currentOperation.result = operate(currentOperation);
            break;
        case "CE":
            currentOperation = newOperation(0);
            break;
    }
    console.table(currentOperation);
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
