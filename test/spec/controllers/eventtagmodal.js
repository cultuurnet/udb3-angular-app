'use strict';

describe('Controller: EventTagModalCtrl', function () {

  // load the controller's module
  beforeEach(module('udbApp'));

  var EventTagModalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventTagModalCtrl = $controller('EventTagModalCtrl', {
      $scope: scope
    });
  }));
});