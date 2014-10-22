'use strict';

/**
 * @ngdoc function
 * @name udbAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the udbAppApp
 */
angular.module('udbApp')
  .controller('MainCtrl', function ($scope, uitidAuth) {
    $scope.login = function () {
      uitidAuth.login();
    };

    $scope.$watch(function () {
      return uitidAuth.getUser();
    }, function (user) {
      $scope.user = user;
    }, true);

  });
