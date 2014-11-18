'use strict';

describe('Filter: jsonLDLang', function () {

  // load the filter's module
  beforeEach(module('udbApp'));

  // initialize a new instance of the filter before each test
  var jsonLDLang;
  beforeEach(inject(function ($filter) {
    jsonLDLang = $filter('jsonLDLang');
  }));

});
