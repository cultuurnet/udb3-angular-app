'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the udbApp
 */
angular.module('udbApp')
  .controller('HeaderCtrl', ['uitidAuth', '$scope','$cookieStore', function (uitidAuth, $scope, $cookieStore) {

    $scope.login = uitidAuth.login;
    $scope.logout = uitidAuth.logout;

    $scope.$watch(function () {
      return uitidAuth.getUser();
    }, function (user) {
      $scope.user = user;
    }, true);

  }]);
