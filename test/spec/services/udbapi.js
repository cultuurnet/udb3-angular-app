'use strict';

describe('Service: UdbApi', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var UdbApi;
  beforeEach(inject(function (_UdbApi_) {
    UdbApi = _UdbApi_;
  }));

  it('should do something', function () {
    expect(!!UdbApi).toBe(true);
  });

});
