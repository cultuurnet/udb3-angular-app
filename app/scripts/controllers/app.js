'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the udbApp
 */
angular
  .module('udbApp')
  .controller('AppCtrl', AppController);

function AppController($scope) {
  $scope.showJobLog = false;

  function toggleJobLog() {
    $scope.showJobLog = !$scope.showJobLog;
  }

  $scope.toggleJobLog = toggleJobLog;
}
