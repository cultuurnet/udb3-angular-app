'use strict';

describe('Controller: AppCtrl', function () {

  // load the controller's module
  beforeEach(module('udbApp'));

  var AppCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AppCtrl = $controller('AppCtrl', {
      $scope: scope
    });
  }));
});
