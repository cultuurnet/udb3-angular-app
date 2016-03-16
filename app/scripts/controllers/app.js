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

/* @ngInject */
function AppController($scope, appConfig, $window, $document) {
  $scope.showJobLog = false;

  function toggleJobLog() {
    $scope.showJobLog = !$scope.showJobLog;
  }

  $scope.toggleJobLog = toggleJobLog;
}
AppController.$inject = ['$scope', 'appConfig', '$window', '$document'];
