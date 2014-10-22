'use strict';

describe('Service: udbHttpInterceptor', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var udbHttpInterceptor;
  beforeEach(inject(function (_udbHttpInterceptor_) {
    udbHttpInterceptor = _udbHttpInterceptor_;
  }));

  it('should do something', function () {
    expect(!!udbHttpInterceptor).toBe(true);
  });

});
