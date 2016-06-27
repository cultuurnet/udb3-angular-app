'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:menuBarController
 * @description
 * # menuBarController
 * udbApp controller
 */
angular
  .module('udbApp')
  .controller('menuBarController', menuBarController);

/* @ngInject */
function menuBarController(uitidAuth, $scope, jobLogger) {
  var controller = this;

  controller.login = uitidAuth.login;
  controller.logout = uitidAuth.logout;
  controller.toggleJobLog = jobLogger.toggleJobLog;
  controller.getFailedJobs = jobLogger.getFailedJobs;

  // TODO: create logic for management permission when user service is ready.
  controller.userHasManagementPermission = true;

  $scope.login = function () {
    uitidAuth.login();
  };

  $scope.$watch(function () {
    return uitidAuth.getUser();
  }, function (user) {
    controller.user = user;
  }, true);
}
menuBarController.$inject = ['uitidAuth', '$scope', 'jobLogger'];
