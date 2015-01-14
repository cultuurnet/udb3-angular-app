'use strict';

describe('Service: taxonomyTerms', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var taxonomyTerms;
  beforeEach(inject(function (_taxonomyTerms_) {
    taxonomyTerms = _taxonomyTerms_;
  }));

  it('should do something', function () {
    expect(!!taxonomyTerms).toBe(true);
  });

});
