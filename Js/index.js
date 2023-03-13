localStorage.clear();   // Clear local storage

/**************** Access dom element ******************/
const input = document.getElementById('input');
const output = document.getElementById('output');
const errDiv = document.getElementById('err-div');
const errMsg = document.getElementById('err-msg');
const errDivCloseBtn = document.getElementById('err-close-btn');
const mPlus = document.getElementById('M+');
const mMinus = document.getElementById('M-');
const mr = document.getElementById('MR');
const mc = document.getElementById('MC');
const ms = document.getElementById('MS');

/**************** Replace string from input expression ********************/
const replaceableString = {
    "sin": "Math.sin",
    "cos(": "Math.cos(",
    "tan": "Math.tan",
    "cosec": "1/Math.sin",
    "sec": "1/Math.cos",
    "cot": "1/Math.tan",
    "^": "**",
    "abs": "Math.abs",
    "log": "Math.log",
    "ln": "Math.log10",
    "sqrt": "Math.sqrt",
    "exp": "Math.exp",
    "π": "Math.PI",
    "cbrt": "Math.cbrt",
    "floor": "Math.floor",
    "ceil": "Math.ceil",
}

/******************** Check the memory whether memory assigned or not **********************/
const checkMemory = () => {
    mc.disabled = localStorage.getItem('data') ? false : true;
    mr.disabled = localStorage.getItem('data') ? false : true;
}
checkMemory();

/******************** Clear input & output **************************/
const clear = () => {
    input.value = "";
    output.value = "";
}
document.getElementById('C').addEventListener('click', clear);


/******************** Error handling **************************/
const throwErr = () => {
    errDiv.classList.remove('d-none');
}

errDivCloseBtn.addEventListener('click', () => {
    errDiv.classList.add('d-none');
});
/******************** Error handling **************************/

/******************** To check the input **************************/
const checkInput = (event) => {
    if (!(/^[a-z0-9\-\/\+\*\-\.\^\(\)\%]*$/g).test(event.target.value)) {
        event.target.value = event.target.value.slice(0, event.target.value.length - 1);
        return false;
    }
}
input.addEventListener('input', checkInput);

/******************** Attach function to all input **************************/
const pushInput = (event) => {
    output.value = "";
    input.value += event.target.dataset.value;
}
document.querySelectorAll('.main-btn').forEach((ele) => {
    ele.addEventListener('click', pushInput);
});

const addPlusMinus = () => {
    let inputValue = input.value;
    if (inputValue[inputValue.length - 1] === "-" && inputValue[inputValue.length - 2] === "(")
        input.value = inputValue.slice(0, inputValue.length - 2);
    else
        input.value += '(-';
}
document.getElementById('plus-minus').addEventListener('click', addPlusMinus);

const addExp = (event) => {
    let inputValue = input.value;
    if (inputValue[inputValue.length - 1] !== "+" && inputValue[inputValue.length - 2] !== "e" && inputValue[inputValue.length - 3] !== ".")
        input.value += event.target.dataset.value;
}
document.getElementById('exp').addEventListener('click', addExp);

const backSpace = () => {
    input.value = input.value.slice(0, input.value.length - 1);
}
document.getElementById('backspace').addEventListener('click', backSpace);

const click2ndBtn = () => {
    document.querySelectorAll('.first-btn').forEach((ele) => {
        ele.classList.toggle('d-none');
    });

    document.querySelectorAll('.second-btn').forEach((ele) => {
        ele.classList.toggle('d-none');
    });
}
document.getElementById('2nd').addEventListener('click', click2ndBtn);

//  Find Log x base y
const findLogXBaseY = () => {
    let x = prompt("Enter the value of x:");
    let y = prompt("Enter the value of base y:");
    let result = Math.log(x) / Math.log(y);
    if (result) {
        input.value += (parseInt(result) === result ? result : result.toFixed(2));
    } else {
        throwErr();
    }
}
document.getElementById('logyx').addEventListener('click', findLogXBaseY);

//  Find Y root of x
const findYRootOfX = () => {
    let x = prompt("Enter the value of x:");
    let y = prompt("Enter the value of y:");
    let result = Math.pow(x, 1 / y);
    if (result) {
        input.value += (parseInt(result) === result ? result : result.toFixed(2));
    } else {
        throwErr();
    }
}
document.getElementById('y-root-x').addEventListener('click', findYRootOfX);

//  Get random value
const getRandom = () => {
    input.value += (Math.random() * 100).toFixed(2);
}
document.getElementById('rand').addEventListener('click', getRandom);
/******************** Attach function to all input **************************/

/****************** convert normal function to eval function *********************/
const getEvalExpression = (exp) => {
    let evalExp = exp;
    Object.entries(replaceableString).forEach(([key, value]) => {
        evalExp = evalExp.replaceAll(key, value);
    });

    return evalExp;
}

/****************** Find answer *********************/
const result = () => {
    if (input.value !== '') {
        try {
            let result = eval(getEvalExpression(input.value));
            output.value = parseInt(result) === result ? result : result.toFixed(2);
            input.value = "";
        } catch (err) {
            throwErr();
        }
    }
}
document.getElementById('=').addEventListener('click', result);

/****************** Find Factorial *********************/
const fact = (num) => {
    if (num <= 1) {
        return 1;
    }
    return num * fact(num - 1);
}

const findFactorial = () => {
    let factDigits = /[0-9]+!{1}/g.exec(input.value + "!");
    if (factDigits !== null) {
        factDigits[0] = factDigits[0].slice(0, factDigits[0].length - 1);
        let result = fact(factDigits);
        let remainingPart = input.value.slice(0, factDigits['index']);
        input.value = remainingPart + (parseInt(result) === result ? result : result.toFixed(2));
    } else {
        throwErr();
    }
}
document.getElementById('fact').addEventListener('click', findFactorial);

/************************* Memory management ************************/
//  Add value inside the memory
const addMemory = () => {
    let data = localStorage.getItem('data');
    if (output.value !== '') {
        localStorage.setItem('data', data ? parseInt(data) + parseInt(output.value) : output.value);
        checkMemory();
    }
}
mPlus.addEventListener('click', addMemory);

//  Add value inside the memory
const subMemory = () => {
    let data = localStorage.getItem('data');
    if (output.value !== '') {
        localStorage.setItem('data', data ? data - output.value : output.value * -1);
        checkMemory();
    }
}
mMinus.addEventListener('click', subMemory);

//  Clear memory
mc.addEventListener('click', () => {
    localStorage.clear();
    output.value = "";
    checkMemory();
});

//  Assign memory
ms.addEventListener('click', () => {
    if (input.value && isFinite(input.value))
        localStorage.setItem('data', input.value);
    checkMemory();
});

//  Show the memory value
mr.addEventListener('click', () => output.value = localStorage.getItem('data'));
/************************* Memory management ************************/