'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the udbApp
 */
angular.module('udbApp')
  .controller('HeaderCtrl', ['UdbApi', '$scope','$cookieStore', function (UdbApi, $scope, $cookieStore) {

    var logout = function () {
      var logoutRequest = UdbApi.logout();

      logoutRequest.then(function () {
        $scope.user = false;
      });
    };

    var login = function () {
      var loginRequest = UdbApi.getMe();

      loginRequest.then(function (credentials) {
        $scope.user = credentials;
      });
    };

    $scope.user = $cookieStore.get('user') || false;
    $scope.login = login;
    $scope.logout = logout;
  }]);
