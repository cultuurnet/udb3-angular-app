'use strict';

describe('Service: dutchTranslations', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  // instantiate service
  var dutchTranslations;
  beforeEach(inject(function (_dutchTranslations_) {
    dutchTranslations = _dutchTranslations_;
  }));

  it('should do something', function () {
    expect(!!dutchTranslations).toBe(true);
  });

});
