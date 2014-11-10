'use strict';

describe('Service: jobLogger', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var jobLogger;
  beforeEach(inject(function (_jobLogger_) {
    jobLogger = _jobLogger_;
  }));

  it('should do something', function () {
    expect(!!jobLogger).toBe(true);
  });

});
