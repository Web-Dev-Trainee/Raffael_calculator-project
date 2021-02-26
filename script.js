const calcButtons = document.querySelectorAll('button');
const display = document.querySelector('.grid-item-display-conta');
const rawDisplay = document.querySelector('.grid-item-display');
const aviso = document.querySelector('.aviso')
let displayNumber = '';
let rawData = '';
let rawDataResult = '';
let removeDigits = '';
let oldNotation = '';
let formattedRawDataArray = [];

function somar(a, b) {
    return a + b;
}

function subtrair(a, b) {
    return a - b;
}

function multiplicar(a, b) {
    return a * b;
}

function dividir(a, b) {
    return a / b;
}

function collectData(e) {
    aviso.textContent = '';
    let data = '';
    if (e.key === undefined) {
        data = this.id;
    } else {
        data = e.key;
    }
    switch (data) {
        case '0':
            resetDisplayNumber();
            if (exceedsDisplay() === false && hasDivision() === false) {
                displayNumber = displayNumber + '0';
            }
            break;
        case '9':
            resetDisplayNumber();
            if (exceedsDisplay() === false) {
                displayNumber = displayNumber + '9';
            }
            break;
        case '8':
            resetDisplayNumber();
            if (exceedsDisplay() === false) {
                displayNumber = displayNumber + '8';
            }
            break;
        case '7':
            resetDisplayNumber();
            if (exceedsDisplay() === false) {
                displayNumber = displayNumber + '7';
            }
            break;
        case '6':
            resetDisplayNumber();
            if (exceedsDisplay() === false) {
                displayNumber = displayNumber + '6';
            }
            break;
        case '5':
            resetDisplayNumber();
            if (exceedsDisplay() === false) {
                displayNumber = displayNumber + '5';
            }
            break;
        case '4':
            resetDisplayNumber();
            if (exceedsDisplay() === false) {
                displayNumber = displayNumber + '4';
            }
            break;
        case '3':
            resetDisplayNumber();
            if (exceedsDisplay() === false) {
                displayNumber = displayNumber + '3';
            }
            break;
        case '2':
            resetDisplayNumber();
            if (exceedsDisplay() === false) {
                displayNumber = displayNumber + '2';
            }
            break;
        case '1':
            resetDisplayNumber();
            if (exceedsDisplay() === false) {
                displayNumber = displayNumber + '1';
            }
            break;
        case '.':
        case 'period':
            resetDisplayNumber();
            if (displayNumber.length == 0) {
                displayNumber = displayNumber + '0.';
            } else if (hasPreviousPeriod() === false && exceedsDisplay() === false) {
                displayNumber = displayNumber + '.';
            }
            break;
        case 'Escape':
        case 'Delete':
        case 'apagar':
            let clearConfirm = confirm('Você tem certeza de que quer apagar tudo?');
            if (clearConfirm) {
                displayNumber = '';
                rawData = '';
            }
            break;
        case 'Backspace':
            resetDisplayNumber();
            backspaceNumberOrOperator()
            break;
        case '+':
        case 'soma':
            if (hasPreviousOperator() === false) {
                addDisplayToRaw();
                rawData = rawData + ' + ';
                displayNumber = '';
            } else {
                aviso.textContent = `Você precisa ter um número antes de colocar o ' + '`
            }
            break;
        case '-':
        case 'subtracao':
            if (hasPreviousOperator() === false) {
                addDisplayToRaw();
                rawData = rawData + ' - ';
                displayNumber = '';
            } else {
                aviso.textContent = `Você precisa ter um número antes de colocar o ' - '`
            }
            break;
        case '*':
        case 'multiplicacao':
            if (hasPreviousOperator() === false) {
                addDisplayToRaw();
                rawData = rawData + ' * ';
                displayNumber = '';
            } else {
                aviso.textContent = `Você precisa ter um número antes de colocar o ' * '`
            }
            break;
        case '/':
        case 'divisao':
            if (hasPreviousOperator() === false) {
                addDisplayToRaw();
                rawData = rawData + ' / ';
                displayNumber = '';
            } else {
                aviso.textContent = `Você precisa ter um número antes de colocar o ' / '`
            }
            break;
        case '=':
        case 'Enter':
        case 'igual':
            addDisplayToRaw();
            if (validEquation() === true) {
                copyRawDataToCalculate();
                displayNumber = rawDataResult;
            } else {
                aviso.textContent = `Você precisa ter uma equação válida para resolver.`
            }
            break;
        default:
            aviso.innerHTML = `
            <p>Alguns atalhos no teclado:</p>
            <p><span>AC</span> =  Delete</p>
            <p><span>Apaga</span> =  Backspace</p>
            `;
            break;
    }
    display.textContent = displayNumber;
    displayRawData();
}

function resetDisplayNumber() {
    if (rawDataResult != 0) {
        displayNumber = '';
        rawDataResult = '';
    }
}

// BOOLEAN CHECKS:

// Limits the number of digits that can be entered at one time
function exceedsDisplay() {
    if (displayNumber.length >= 12 || rawData.length >= 45) {
        aviso.textContent = `Os números alcançaram o limite do display.`
        return true;
    } else {
        return false;
    }
}

// Check to see if user clicks two math operators back to back - exception: factorial (!) and period (.)
function hasPreviousOperator() {
    if (displayNumber.length != 0 || (rawData.charAt(rawData.length - 1).match(/[\d!\.]/))) {
        return false;
    } else {
        return true;
    }
}

// Check to see if a user is trying to divide by 0, but still let user divide by 10 (for example: 32 / 0)
function hasDivision() {
    if (rawData.charAt(rawData.length - 2).match(/\//) && displayNumber.length == 0) {
        aviso.textContent = `Essa calculadora não divide por 0`;
        return true;
    } else {
        return false;
    }
}

// Check to see if user clicked on period twice in the same number (for example: 3.14.159)
function hasPreviousPeriod() {
    if (displayNumber.match(/\./)) {
        aviso.textContent = `Você não pode colocar outro ponto decimal se você já o tinha colocado antes`;
        return true;
    } else {
        return false;
    }
}

// CALCULATOR FUNCTIONALITY

// Backspace 1 space in Display Number, or 1-3 spaces in Raw Data
function backspaceNumberOrOperator() {
    // If there is a display number, delete from it first
    if (displayNumber.length >= 1) {
        let displayArray = displayNumber.split('');
        displayArray.pop();
        let displayString = displayArray.join('');
        displayNumber = displayString;
    } else {
        let rawDataArray = rawData.split('');
        // If the array has an empty string at the end (for example, from ' + ')
        if (rawDataArray.length >= 1 && rawDataArray[rawDataArray.length - 1].match(/\s/)) {
            rawDataArray.pop();
            rawDataArray.pop();
            rawDataArray.pop();
        } else {
            rawDataArray.pop();
        }
        let rawDataString = rawDataArray.join('');
        rawData = rawDataString;
    }
}

// Add or remove negative sign from display number
function switchPositiveNegative() {
    // If there is not a display number, it will start with '-'
    if (displayNumber.length == 0) {
        displayNumber = '-';
    } else {
        let displayArray = displayNumber.split('');
        // If the display number is already negative, delete the '-'
        if (displayArray[0].match(/-/)) {
            displayArray.shift();
            let displayString = displayArray.join('');
            displayNumber = displayString;
        } else {
            // If the dislay number is positive, add a "-" to the begining of the array
            displayArray.unshift('-');
            let displayString = displayArray.join('');
            displayNumber = displayString;
        }
    }
}

// Add displayNumber to the end of rawData string
function addDisplayToRaw() {
    if (rawDataResult.length == 0) {
        rawData = rawData + displayNumber;
    } else {
        rawData = displayNumber;
        rawDataResult = '';
    }
}

// Must clear rawDataResult, to use exponents on the product on previous equation
function clearRawDataResult() {
    if (rawDataResult.length != 0) {
        rawDataResult = '';
    }
}

// Must valiate equation, so it does not end with +_*? - The last thing should be a digit or factorial
function validEquation() {
    if (rawData.charAt(rawData.length - 1).match(/!|\d/)) {
        return true;
    } else {
        return false;
    }
}

// Make a copy of rawData to be able to display after calculateData
function copyRawDataToCalculate() {
    let rawDataArray = rawData.split(' ');
    rawDataResult = rawDataArray.join(' ');
    calculateData();
}

// Main function that processes the rawData to rawDataResult
function calculateData() {
    if (rawDataResult.match(/\d+!/)) {
        solveFactorial();
    } else if (rawDataResult.match(/\d+\^\d+/)) {
        solveExponent();
    } else if (rawDataResult.match(/\*|\//)) {
        solveMultiplicationOrDivison();
    } else if ((rawDataResult.match(/[\s][\+|-][\s]/))) {
        solveAdditionOrSubtraction();
    } else {
        if (rawDataResult.length > 12) {
            // This formatting is not scientific
            formatRawDataResults();
            return rawDataResult;
        } else {
            return rawDataResult;
        }
    }
}

function solveMultiplicationOrDivison() {
    let multiplicationDivisionRegExp = /(\-?)[\d]+(\.?)[\d]*[\s][\*|\/][\s](\-?)[\d]+(\.?)[\d]*/;
    let multiplicationDivisionMatch = rawDataResult.match(multiplicationDivisionRegExp)[0];
    let isMultiplicationOrDivision = multiplicationDivisionMatch.match(/\*|\//)[0];
    // Find the two numbers to run multiplication or division function
    let numberRegExp = /(\-?)[\d]+(\.?)[\d]*/g;
    let firstNumber = multiplicationDivisionMatch.match(numberRegExp)[0];
    let secondNumber = multiplicationDivisionMatch.match(numberRegExp)[1];
    if (isMultiplicationOrDivision == '*') {
        let multiplicationResult = multiplicar(firstNumber, secondNumber);
        // Replace rawDataResult with multiplicationResult
        let multiplicationRawData = multiplicationDivisionRegExp[Symbol.replace](rawDataResult, multiplicationResult);
        rawDataResult = multiplicationRawData;
    } else {
        let divisionResult = dividir(firstNumber, secondNumber);
        // Replace rawDataResult with divisionResult
        let divisionRawData = multiplicationDivisionRegExp[Symbol.replace](rawDataResult, divisionResult);
        rawDataResult = divisionRawData;
    }
    calculateData();
}

function solveAdditionOrSubtraction() {
    // Need to go from left to right finding all of the + or - symbols
    const additionSubtractionRegExp = /(\-?)[\d]+(\.?)[\d]*[\s][\+|-][\s](\-?)[\d]+(\.?)[\d]*/;
    let additionSubtractionMatch = rawDataResult.match(additionSubtractionRegExp)[0];
    let isAdditionOrSubtraction = additionSubtractionMatch.match(/[\s][\+|-][\s]/)[0];
    let numberRegExp = /(\-?)[\d]+(\.?)[\d]*/g;
    let firstNumber = Number(additionSubtractionMatch.match(numberRegExp)[0]);
    let secondNumber = Number(additionSubtractionMatch.match(numberRegExp)[1]);
    if (isAdditionOrSubtraction == ' + ') {
        let additionResult = somar(firstNumber, secondNumber);
        let additionRawData = additionSubtractionRegExp[Symbol.replace](rawDataResult, additionResult);
        rawDataResult = additionRawData;
    } else {
        let subtractionResult = subtrair(firstNumber, secondNumber);
        let subtractionsRawData = additionSubtractionRegExp[Symbol.replace](rawDataResult, subtractionResult);
        rawDataResult = subtractionsRawData;
    }
    calculateData()
}

// Re-sets the rawData after the equal sign has been used
function displayRawData() {
    if (rawDataResult.length == 0) {
        rawDisplay.textContent = rawData;
    } else {
        rawDisplay.textContent = rawData;
        rawData = '';
    }
}

// This is not a REAL scientific notation calculation - This is simply gives an illusion that it is to keep calculator within 12 digit limit
function formatRawDataResults() {
    removeDigits = (rawDataResult.length - 10);
    formattedRawDataArray = rawDataResult.split('');
    let notationRegExp = /e\+*\d+/;
    let decimalRegExp = /\./;
    // Find if there is scientific notation & if so, get length & remove 'n'
    if (rawDataResult.match(notationRegExp)) {
        rawDataMatch = rawDataResult.match(notationRegExp)[0];
        oldNotation = rawDataMatch.length - 1;
        rawDataResult = /e\+*/[Symbol.replace](rawDataResult, 0);
        addNotation(oldNotation);
        // If the number is less then 1 million & has a decimal point, only remove digits.
    } else if (rawDataResult < 1000000000 && rawDataResult.match(decimalRegExp)) {
        for (i = 1; i <= removeDigits - 2; i++) {
            formattedRawDataArray.pop();
        }
        let formattedRawData = formattedRawDataArray.join('');
        rawDataResult = formattedRawData;

    } else {
        addNotation(0);
    }
    aviso.textContent = `O resultado foi formatado para aparecer no display`;
}

// Need to either remove enough places for single or double digits in scientific notation 
function addNotation(oldNotation) {
    if ((removeDigits + oldNotation) >= 10) {
        for (i = 0; i <= removeDigits; i++) {
            formattedRawDataArray.pop();
        }
    } else {
        for (i = 1; i <= removeDigits; i++) {
            formattedRawDataArray.pop();
        }
    }
    let formattedRawData = formattedRawDataArray.join('') + `e${removeDigits + oldNotation}`;
    rawDataResult = formattedRawData;
}


calcButtons.forEach(calcButton => calcButton.addEventListener('click', collectData))
window.addEventListener('keydown', collectData);