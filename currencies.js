const fixerioApiKey = '9aab6cdc0dcaf562e2d85630d46d8501'
const request = require('request');
const lodash = require('lodash');

var currencies;


getCurrency().then(function (curr) {
    currencies = curr;
});

function checkCurrency(currencyStr) {
    return new Promise(function (resolve, reject) {
        if (lodash.has(currencies, currencyStr)) {
            //console.log('We have that currency');
            resolve(true);
        } else {
            //console.log("We don't have that currency");
            resolve(false);
        }
    });
}

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


module.exports.convertCurrency = convertCurrency;
module.exports.checkCurrency = checkCurrency;