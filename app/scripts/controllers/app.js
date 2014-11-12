'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the udbApp
 */
angular.module('udbApp')
  .controller('AppCtrl', function ($scope) {
    $scope.showJobLog = false;

    function toggleJobLog() {
      $scope.showJobLog = !$scope.showJobLog;
      console.log($scope.showJobLog);
    }

    $scope.toggleJobLog = toggleJobLog;
  });
