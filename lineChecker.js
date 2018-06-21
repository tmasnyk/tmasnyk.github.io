const paramsChecker = require('./paramsChecker');
const currencies = require('./currencies');

//Checks whole lines
function checkAddLine(expense) {
    return new Promise(function (resolve, reject) {
        if (expense.length !== 5) {
            console.log('Wrong parameters number')
            reject;
        } else if (!paramsChecker.checkDate(expense[1])) {
            console.log('Date problem')
            reject;
        } else if (!paramsChecker.checkAmount(expense[2])) {
            console.log('Amount problem')
            reject;
        } else currencies.checkCurrency(expense[3].toUpperCase()).then(function (res) {
            if (res) {
                resolve(true);
            } else reject;
        })
    })
}

function checkClearLine(expense) {
    return new Promise(function (resolve, reject) {
        if (expense.length !== 2) {
            console.log('Wrong parameters number')
            reject;
        } else if (!paramsChecker.checkDate(expense[1])) {
            console.log('Date problem')
            reject;
        } else resolve(true);
    })
}

function checkListLine(expense) {
    return new Promise(function (resolve, reject) {
        if (expense.length !== 1) {
            console.log('Wrong parameters number')
            reject;
        } else resolve(true);
    })
}

function checkTotalLine(expense) {
    return new Promise(function (resolve, reject) {
        if (expense.length !== 2) {
            console.log('Wrong parameters number')
            reject;
        } else currencies.checkCurrency(expense[1].toUpperCase()).then(function (res) {
            if (res) {
                resolve(true);
            } else reject;
        })
    })
}


module.exports.checkAddLine = checkAddLine;
module.exports.checkClearLine = checkClearLine;
module.exports.checkListLine = checkListLine;
module.exports.checkTotalLine = checkTotalLine;