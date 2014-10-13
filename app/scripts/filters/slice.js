'use strict';

/**
 * @ngdoc filter
 * @name udbApp.filter:slice
 * @function
 * @description
 * # slice
 * Filter in the udbApp.
 */
angular.module('udbApp')
  .filter('slice', function () {
    return function(arr, start, end) {
      return (arr || []).slice(start, end);
    };
  });
