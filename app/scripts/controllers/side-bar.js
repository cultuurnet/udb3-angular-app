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
  .controller('sideBarController', sideBarController);

/* @ngInject */
function sideBarController(uitidAuth, $scope, jobLogger) {
  var controller = this;

  controller.login = uitidAuth.login;
  controller.logout = uitidAuth.logout;
  controller.toggleJobLog = jobLogger.toggleJobLog;
  controller.getFailedJobs = jobLogger.getFailedJobs;

  // TODO: create logic for management permission when user service is ready.
  controller.userHasManagementPermission = true;

  $scope.$watch(function () {
    return uitidAuth.getUser();
  }, function (user) {
    controller.user = user;
  }, true);
}
sideBarController.$inject = ['uitidAuth', '$scope', 'jobLogger'];
