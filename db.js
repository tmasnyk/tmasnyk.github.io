const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter);

const currencies = require('./currencies');

//init empty db
initDB();

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
    db.get('expenses')
        .remove({date: expense[1]})
        .write()
    console.log('Cleared all expense on ' + expense[1])
}

function totalExpense(expense) {
    let total = 0;
    db.get('expenses')
        .value()
        .map(exp => {
            //console.log(exp)
            if (exp.currency.indexOf(expense[1]) > -1) {
                total += parseFloat(exp.amount);
            } else {
                total += currencies.convertCurrency(exp.currency, expense[1], exp.amount);
            }

        });
    console.log(Number(total.toFixed(2)));
}

function listAllExpense() {
    const exp = db.get('expenses')
        .value()
    console.log(exp)
}

function initDB() {
    db.defaults({expenses: []})
        .write()
}

module.exports.addExpense = addExpense;
module.exports.clearExpense = clearExpense;
module.exports.totalExpense = totalExpense;
module.exports.listAllExpense = listAllExpense;
