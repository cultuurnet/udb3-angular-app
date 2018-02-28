'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the udbApp
 */
angular
  .module('udbApp')
  .controller('MainCtrl', MainController);

/* @ngInject */
function MainController($scope, uitidAuth, $translate) {
  $scope.language = $translate.use();

  $scope.login = function () {
    uitidAuth.login($scope.language);
  };

  $scope.register = function () {
    uitidAuth.register();
  };

  $scope.$watch(function () {
    return uitidAuth.getUser();
  }, function (user) {
    $scope.user = user;
  }, true);
}
MainController.$inject = ['$scope', 'uitidAuth', '$translate'];
