'use strict';

describe('Service: searchHelper', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var searchHelper;
  beforeEach(inject(function (_searchHelper_) {
    searchHelper = _searchHelper_;
  }));

  it('should do something', function () {
    expect(!!searchHelper).toBe(true);
  });

});
