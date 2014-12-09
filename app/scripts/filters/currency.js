'use strict';

/**
 * @ngdoc filter
 * @name udbApp.filter:currency
 * @function
 * @description
 * # currency
 * Filter in the udbApp.
 */
angular.module('udbApp')
  .filter('currency', function () {
    return function(number, currencyCode) {
      var currencies = {
          EUR: {
            symbol: "€",
            thousand: ".",
            decimal: ",",
            format: "%s%v"
          }
        };

      var currency = currencies[currencyCode];
      // Default to Euro if the currency is not defined
      if(!currency) {
        currency = currencies.EUR;
      }

      return accounting.formatMoney(number, currency.symbol, 2, currency.thousand, currency.decimal, currency.format);
    };
  });
