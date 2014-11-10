'use strict';

describe('Service: udbSocket', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var udbSocket;
  beforeEach(inject(function (_udbSocket_) {
    udbSocket = _udbSocket_;
  }));

  it('should do something', function () {
    expect(!!udbSocket).toBe(true);
  });

});
