'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:HeaderController
 * @description
 * # HeaderController
 * udbApp controller
 */
angular
  .module('udbApp')
  .controller('HeaderController', HeaderController);

/* @ngInject */
function HeaderController(uitidAuth, $scope, jobLogger) {
  var controller = this;

  controller.login = uitidAuth.login;
  controller.logout = uitidAuth.logout;
  controller.toggleJobLog = jobLogger.toggleJobLog;

  $scope.$watch(function () {
    return uitidAuth.getUser();
  }, function (user) {
    controller.user = user;
  }, true);
}
HeaderController.$inject = ['uitidAuth', '$scope', 'jobLogger'];
