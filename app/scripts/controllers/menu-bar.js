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
function menuBarController(
  uitidAuth,
  $scope,
  jobLogger,
  appConfig,
  managementListItems
) {
  var controller = this; // jshint ignore:line

  controller.login = uitidAuth.login;
  controller.logout = uitidAuth.logout;
  controller.toggleJobLog = jobLogger.toggleJobLog;

  if (typeof(appConfig.toggleAddOffer) !== 'undefined') {
    controller.toggleAddOffer = appConfig.toggleAddOffer;
  }
  else {
    controller.toggleAddOffer = true;
  }

  controller.canManageUsers = false;
  controller.canManageLabels = false;
  controller.canManageOrganizers = false;

  controller.userHasManagementPermission = false;

  $scope.login = function () {
    uitidAuth.login();
  };

  /**
   *
   * @param {ManagementListItem[]} listItems
   */
  function showManagementListItems(listItems) {
    controller.managementListItems = listItems;
  }

  var userListener = $scope.$watch(function () {
    return uitidAuth.getUser();
  }, function (user) {
    controller.user = user;
    managementListItems
      .then(showManagementListItems);

    // call the userListener callback to remove the watcher once the user is loaded
    userListener();
  }, true);
}
menuBarController.$inject = [
  'uitidAuth',
  '$scope',
  'jobLogger',
  'appConfig',
  'managementListItems'
];
