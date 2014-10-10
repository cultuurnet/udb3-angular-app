'use strict';

/**
 * @ngdoc function
 * @name udbAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the udbAppApp
 */
angular.module('udbApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
