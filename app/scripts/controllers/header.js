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

    var logout = function () {
      var logoutRequest = uitidAuth.logout();

      logoutRequest.then(function () {
        $scope.user = false;
      });
    };

    var login = function () {
      var loginRequest = uitidAuth.login();

      loginRequest.then(function (credentials) {
        $scope.user = credentials;
      });
    };

    $scope.user = $cookieStore.get('user') || false;
    $scope.login = login;
    $scope.logout = logout;
  }]);
