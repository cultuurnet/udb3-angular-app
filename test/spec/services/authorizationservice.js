'use strict';

describe('Service: authorizationService', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var authorizationService;
  beforeEach(inject(function (_authorizationService_) {
    authorizationService = _authorizationService_;
  }));

  it('should do something', function () {
    expect(!!authorizationService).toBe(true);
  });

});
