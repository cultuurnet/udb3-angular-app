'use strict';

/**
 * @ngdoc function
 * @name udbAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the udbAppApp
 */
angular.module('udbApp')
  .controller('MainCtrl', function ($scope, uitidAuth, $cookieStore) {
    $scope.login = function () {
      uitidAuth.login();
    };

    $scope.user = $cookieStore.get('user') || false;
  });
