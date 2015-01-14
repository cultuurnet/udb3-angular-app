'use strict';

describe('Service: fieldTypeTransformers', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var fieldTypeTransformers;
  beforeEach(inject(function (_fieldTypeTransformers_) {
    fieldTypeTransformers = _fieldTypeTransformers_;
  }));

  it('should do something', function () {
    expect(!!fieldTypeTransformers).toBe(true);
  });

});
