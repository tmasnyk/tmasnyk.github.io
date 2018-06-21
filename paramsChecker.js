function checkDate(dateStr) {
    var dateReg = /^\d{4}\-\d{1,2}\-\d{1,2}$/
    if (dateReg.test(dateStr)) {
        return true;
    } else {
        return false;
    }
}

function checkAmount(amountStr) {
    var numReg = /^-?\d*\.?\d*$/
    if (numReg.test(amountStr)) {
        return true;
    } else return false;
}

module.exports.checkDate = checkDate;
module.exports.checkAmount = checkAmount;



