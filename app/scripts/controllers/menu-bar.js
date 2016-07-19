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
function menuBarController(uitidAuth, $scope, jobLogger, authorizationService, authorization) {
  var controller = this; // jshint ignore:line

  controller.login = uitidAuth.login;
  controller.logout = uitidAuth.logout;
  controller.toggleJobLog = jobLogger.toggleJobLog;
  controller.getFailedJobs = jobLogger.getFailedJobs;

  controller.canManageUsers = false;
  controller.canManageLabels = false;
  controller.canManageOrganizers = false;

  controller.userHasManagementPermission = false;

  $scope.login = function () {
    uitidAuth.login();
  };

  $scope.$watch(function () {
    return uitidAuth.getUser();
  }, function (user) {
    controller.user = user;

    // look for permissions
    authorizationService
      .hasPermission(authorization.manageLabels)
      .then(function (hasPermission) {
        if(hasPermission) {
          controller.canManageLabels = true;
          controller.userHasManagementPermission = true;
        }
      });

    authorizationService
      .hasPermission(authorization.manageUsers)
      .then(function (hasPermission) {
        if(hasPermission) {
          controller.canManageUsers = true;
          controller.userHasManagementPermission = true;
        }
      });

    authorizationService
      .hasPermission(authorization.manageOrganisations)
      .then(function (hasPermission) {
        if(hasPermission) {
          controller.canManageOrganizers = true;
          controller.userHasManagementPermission = true;
        }
      });

  }, true);
}
menuBarController.$inject = ['uitidAuth', '$scope', 'jobLogger', 'authorizationService', 'authorization'];
