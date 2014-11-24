'use strict';

describe('Service: UdbEvent', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var UdbEvent;
  beforeEach(inject(function (_UdbEvent_) {
    UdbEvent = _UdbEvent_;
  }));

  it('should do something', function () {
    expect(!!UdbEvent).toBe(true);
  });

});
