'use strict';

describe('Service: queryFieldTypes', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var queryFieldTypes;
  beforeEach(inject(function (_queryFieldTypes_) {
    queryFieldTypes = _queryFieldTypes_;
  }));

  it('should do something', function () {
    expect(!!queryFieldTypes).toBe(true);
  });

});
