var expenseLine = "add 2017-04-25 12.44 USD Jogurt";
const request = require('request');
const lodash = require('lodash');
const fetch = require("node-fetch");


const fixerioApiKey = '9aab6cdc0dcaf562e2d85630d46d8501'
var parsedExpense = [];


expenseLine.split(" ").map(res => {
    parsedExpense.push(res);
})

var command;
if (parsedExpense.length > 0) {
    command = parsedExpense[0];
} else exit(0);

switch (command) {
    case "add":
        checkAddLine(parsedExpense).then(function (res) {
            if (res) {
                console.log('all ok');
                addExpense(parsedExpense);
            }
        })
        break;
    case "list":
        checkListLine(parsedExpense).then(function (res) {
            if (res) {
                console.log('all ok')
                listAllExpense(parsedExpense);
            }
        })
        break;
    case "clear":
        checkClearLine(parsedExpense).then(function (res) {
            if (res) {
                console.log('all ok');
                clearExpense(parsedExpense)
            }
        })
        break;
    case "total":
        checkTotalLine(parsedExpense).then(function (res) {
            if (res) {
                console.log('all ok')
                totalExpense(parsedExpense);
            }
        })
        break;
    default:
        console.log('Incorrect command line');
        break;
}


//Run commands
function addExpense() {

}

function clearExpense() {

}

function totalExpense(currency) {

}

function listAllExpense() {

}


//Checks whole lines
function checkAddLine(expense) {
    return new Promise(function (resolve, reject) {
        if (expense.length !== 5) {
            console.log('Wrong parameters number')
            reject;
        } else if (!checkDate(expense[1])) {
            console.log('Date problem')
            reject;
        } else if (!checkAmount(expense[2])) {
            console.log('Amount problem')
            reject;
        } else checkCurrency(expense[3]).then(function (res) {
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
        } else if (!checkDate(expense[1])) {
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
        } else checkCurrency(expense[3]).then(function (res) {
            if (res) {
                resolve(true);
            } else reject;
        })
    })
}


//Check params
function checkDate(dateStr) {
    var dateReg = /^\d{4}\-\d{1,2}\-\d{1,2}$/
    if (dateReg.test(dateStr)) {
        return true;
    } else {
        return false;
    }
}

function checkCurrency(currencyStr) {
    return new Promise(function (resolve, reject) {
        request('http://data.fixer.io/api/latest?access_key=' + fixerioApiKey, {json: true}, (err, res, body) => {
            if (err) {
                resolve(false);
            }
            else {
                if (lodash.has(body.rates, currencyStr)) {
                    console.log('We have that currency');
                    resolve(true);
                } else {
                    console.log("We don't have that currency");
                    resolve(false);
                }
            }
        });
    });
}

function checkAmount(amountStr) {
    var numReg = /^-?\d*\.?\d*$/
    if (numReg.test(amountStr)) {
        return true;
    } else return false;
}




