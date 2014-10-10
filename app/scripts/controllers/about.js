'use strict';

/**
 * @ngdoc function
 * @name udbAppApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the udbAppApp
 */
angular.module('udbApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
