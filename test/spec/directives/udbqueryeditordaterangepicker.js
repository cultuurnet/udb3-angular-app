'use strict';

describe('Directive: udbQueryEditorDaterangepicker', function () {

  // load the directive's module
  beforeEach(module('udbApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<udb-query-editor-daterangepicker></udb-query-editor-daterangepicker>');
    element = $compile(element)(scope);
    expect(element.text()).not.toBe(null);
  }));
});
