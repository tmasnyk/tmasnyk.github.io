
const lineChecker = require('./lineChecker');
const db = require('./db');


/*showHelpBanner();
startConsole();*/
console.log('WebApp')



function showHelpBanner() {
    console.log('***********************************');
    console.log('********Commands Example***********');
    console.log('* add 2017-04-26 12.44 USD Jogurt *');
    console.log('* clear 2017-04-26 ****************');
    console.log('* list ****************************');
    console.log('* total EUR ***********************');
    console.log('***********************************');
}

function  startConsole() {
    var stdin = process.openStdin();
    stdin.addListener("data", function (line) {
        console.log('_______________________');
        parseLine(line.toString().trim())
    });
}



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
            lineChecker.checkAddLine(parsedExpense).then(function (res) {
                if (res) {
                    db.addExpense(parsedExpense);
                }
            })
            break;
        case "list":
            lineChecker.checkListLine(parsedExpense).then(function (res) {
                if (res) {
                    db.listAllExpense(parsedExpense);
                }
            })
            break;
        case "clear":
            lineChecker.checkClearLine(parsedExpense).then(function (res) {
                if (res) {
                    db.clearExpense(parsedExpense)
                }
            })
            break;
        case "total":
            lineChecker.checkTotalLine(parsedExpense).then(function (res) {
                if (res) {
                    db.totalExpense(parsedExpense);
                }
            })
            break;
        default:
            console.log('Incorrect command line');
            break;
    }
}



//Check params



//External resource



