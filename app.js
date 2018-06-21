//var expenseLine = "add 2017-04-26 12.44 USD Jogurt";
//var expenseLine = "list";
//var expenseLine = "clear 2017-04-26";
const request = require('request');
const lodash = require('lodash');

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

const fixerioApiKey = '9aab6cdc0dcaf562e2d85630d46d8501'

var currencies;
getCurrency().then(function (curr) {
    currencies = curr;
})

db.defaults({expenses: []})
    .write()

var stdin = process.openStdin();


console.log('***********************************');
console.log('********Commands Example***********');
console.log('* add 2017-04-26 12.44 USD Jogurt *');
console.log('* clear 2017-04-26 ****************');
console.log('* list ****************************');
console.log('* total EUR ***********************');
console.log('***********************************');


stdin.addListener("data", function (d) {
    console.log("you entered: [" +
        d.toString().trim() + "]");
    parseLine(d.toString().trim())
});


function parseLine(expenseLine) {
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
}


//Run commands
function addExpense(expense) {
    const exp = db.get('expenses')
        .push({
            date: expense[1],
            amount: expense[2],
            currency: expense[3],
            name: expense[4]
        })
        .write()
    console.log(exp);
}

function clearExpense(expense) {
    const exp = db.get('expenses')
        .remove({date: expense[1]})
        .write()
    console.log(exp)
}

function totalExpense(expense) {
    let total = 0;
    console.log('Currency', expense[1]);
    db.get('expenses')
        .value()
        .map(exp => {
            //console.log(exp)
            if (exp.currency.indexOf(expense[1]) > -1) {
                total += parseFloat(exp.amount);
                // console.log(total)
            } else {
                total += convertCurrency(exp.currency, expense[1], exp.amount);
            }

        });
    console.log(Number(total.toFixed(2)));
}

function listAllExpense() {
    const exp = db.get('expenses')
        .value()
    console.log(exp)
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
        } else checkCurrency(expense[1]).then(function (res) {
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
        if (lodash.has(currencies, currencyStr)) {
            console.log('We have that currency');
            resolve(true);
        } else {
            console.log("We don't have that currency");
            resolve(false);
        }
    });
}

function checkAmount(amountStr) {
    var numReg = /^-?\d*\.?\d*$/
    if (numReg.test(amountStr)) {
        return true;
    } else return false;
}


//External resource
function getCurrency() {
    return new Promise(function (resolve, reject) {
        request('http://data.fixer.io/api/latest?access_key=' + fixerioApiKey, {json: true}, (err, res, body) => {
            if (err) {
                reject;
            }
            else {
                resolve(body.rates)
            }
        });
    });
}

function convertCurrency(from, to, amount) {
    return (amount / currencies[from] * currencies[to]);
}


