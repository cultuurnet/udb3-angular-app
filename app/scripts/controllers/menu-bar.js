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
  controller.startedJobs = [];

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

  $scope.$watch(function () {
    return jobLogger.getStartedExportJobs();
  }, function (jobs) {
    if (_.get(appConfig, 'gaTagManager.containerId')) {
      if (jobs.length) {
          controller.startedJobs = jobs;
      } else {
          var dataLayer = window.tm = window.tm || [];
          angular.forEach(controller.startedJobs,function(job) {
            if (job.details) {
                var gaObject = {
                    event : 'GAEvent',
                    eventCategory : 'export',
                    eventAction : job.details.format,
                    eventLabel : job.details.brand + ';' + job.details.user + ';' + job.details.queryString
                };
                dataLayer.push(gaObject);
            }
      });
          controller.startedJobs = jobs;
      }
    }
  }, true);

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
