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
function MainController($scope, $rootScope, uitidAuth, $translate) {

  $scope.language = $translate.use();

  $scope.login = function () {
    uitidAuth.login($scope.language);
  };

  $scope.register = function () {
    uitidAuth.register($scope.language);
  };

  $scope.changeLanguage = function(language) {
    $scope.language = language;
    $translate.use($scope.language);
  };


  $scope.$watch(function () {
    return uitidAuth.getUser();
  }, function (user) {
    $scope.user = user;
  }, true);
}
MainController.$inject = ['$scope', '$rootScope', 'uitidAuth', '$translate'];
