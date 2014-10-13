'use strict';

describe('Filter: slice', function () {

  // load the filter's module
  beforeEach(module('udbAppApp'));

  // initialize a new instance of the filter before each test
  var slice;
  beforeEach(inject(function ($filter) {
    slice = $filter('slice');
  }));

});
