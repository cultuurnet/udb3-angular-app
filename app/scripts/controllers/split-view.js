'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:splitViewController
 * @description
 * # splitViewController
 * udbApp controller
 */
angular
  .module('udbApp')
  .controller('splitViewController', splitViewController);

/* @ngInject */
function splitViewController(uitidAuth, $scope) {
  var controller = this;

  $scope.$watch(function () {
    return uitidAuth.getUser();
  }, function (user) {
    controller.user = user;
  }, true);
}
splitViewController.$inject = ['uitidAuth', '$scope'];
