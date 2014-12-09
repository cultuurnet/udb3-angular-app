'use strict';

describe('Filter: currency', function () {

  // load the filter's module
  beforeEach(module('udbApp'));

  // initialize a new instance of the filter before each test
  var currency;
  beforeEach(inject(function ($filter) {
    currency = $filter('currency');
  }));

  it('should format a float as Euro', function () {
    var formattedPrice = '€12,30';
    expect(currency(12.3)).toBe(formattedPrice);
  });

});
