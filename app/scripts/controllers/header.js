'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * udbApp controller
 */
angular
  .module('udbApp')
  .controller('HeaderCtrl', HeaderController);

/** @ngInject */
function HeaderController(uitidAuth, $scope) {
  $scope.login = uitidAuth.login;
  $scope.logout = uitidAuth.logout;

  $scope.$watch(function () {
    return uitidAuth.getUser();
  }, function (user) {
    $scope.user = user;
  }, true);
}
