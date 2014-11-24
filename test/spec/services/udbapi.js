'use strict';

describe('Service: udbApi', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var udbApi;
  beforeEach(inject(function (_udbApi_) {
    udbApi = _udbApi_;
  }));

  it('should do something', function () {
    expect(!!udbApi).toBe(true);
  });

});
