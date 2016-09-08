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
  authorizationService,
  RolePermission,
  appConfig,
  ModerationManager,
  $q
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

  function filterModeratorRoles(roles) {
    // only show roles with moderator permission
    var myRoles = _.filter(roles, function(role) {
      var canModerate = _.filter(role.permissions, function(permission) {
        return permission === RolePermission.AANBOD_MODEREREN;
      });
      return canModerate.length > 0 ? true : false;
    });

    return $q.resolve(myRoles);
  }

  function getModerationCount(roles) {
    var query = '';

    _.forEach(roles, function(value) {
      query += (query?' OR ':'') + value.constraint;
    });
    query = '(' + query + ')';

    ModerationManager
      .find(query, 10, 0)
      .then(function(searchResult) {
        controller.moderationCount = searchResult.totalItems;
      });
  }

  function checkMenuRights() {
    // look for permissions
    authorizationService
      .hasPermission(RolePermission.LABELS_BEHEREN)
      .then(function (hasPermission) {
        if(hasPermission) {
          controller.canManageLabels = true;
          controller.userHasManagementPermission = true;
        }
      });

    authorizationService
      .hasPermission(RolePermission.GEBRUIKERS_BEHEREN)
      .then(function (hasPermission) {
        if(hasPermission) {
          controller.canManageUsers = true;
          controller.userHasManagementPermission = true;
        }
      });

    authorizationService
      .hasPermission(RolePermission.ORGANISATIES_BEHEREN)
      .then(function (hasPermission) {
        if(hasPermission) {
          controller.canManageOrganizers = true;
          controller.userHasManagementPermission = true;
        }
      });
  };

  $scope.$watch(function () {
    return uitidAuth.getUser();
  }, function (user) {
    controller.user = user;

    checkMenuRights();

    // get the number of items to moderate
    ModerationManager
      .getMyRoles()
      .then(filterModeratorRoles)
      .then(getModerationCount);

  }, true);
}
menuBarController.$inject = [
  'uitidAuth',
  '$scope',
  'jobLogger',
  'authorizationService',
  'RolePermission',
  'appConfig',
  'ModerationManager',
  '$q'
];
