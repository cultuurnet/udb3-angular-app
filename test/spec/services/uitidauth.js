'use strict';

describe('Service: uitidAuth', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var uitidAuth;
  beforeEach(inject(function (_uitidAuth_) {
    uitidAuth = _uitidAuth_;
  }));

  it('should do something', function () {
    expect(!!uitidAuth).toBe(true);
  });

});
