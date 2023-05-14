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
        if (currentOperation.result) {
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
    return operation.op(operation.a, operation.b);
}
updateScreen();

//INTERPRETER =============================================
function interpret(string) {
    //LOGIC
    let isNumber = !Number.isNaN(Number(string));
    const regexp = /[\+÷×-]/;
    const updateFirstOperand = !currentOperation.op && isNumber;
    const updateSecondOperand =
        currentOperation.op && !currentOperation.result && isNumber;
    const updateOperation = regexp.test(string);
    const hasResult = !!currentOperation.result;

    //STAGE 1 detect operation
    if (updateOperation) {
        if (hasResult) {
            currentOperation = newOperation(currentOperation.result);
        }
        if (currentOperation.b) {
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

    //STAGE 2 collect first operand
    if (updateFirstOperand) {
        let tempString = (currentOperation.a += string);
        currentOperation.a = Number(tempString);
    }

    //STAGE 3 collect second operand
    if (updateSecondOperand) {
        let tempString = currentOperation.b
            ? (currentOperation.b += string)
            : string;
        currentOperation.b = Number(tempString);
    }
    //STAGE 4 Other commands
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
