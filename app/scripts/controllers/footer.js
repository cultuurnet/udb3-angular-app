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
  .controller('footerController', footerController);

/* @ngInject */
function footerController(uitidAuth, $scope, ZendeskWidget) {
  var controller = this; // jshint ignore:line

  $scope.$watch(function () {
    return uitidAuth.getUser();
  }, function (user) {
    controller.user = user;
  }, true);

  $scope.openFeedback = function () {
    ZendeskWidget.identify({
      name: controller.user.nick,
      email: controller.user.mbox,
      externalId: controller.user.id
    });
    ZendeskWidget.activate({hideOnClose:true});
  };
}
footerController.$inject = ['uitidAuth', '$scope', 'ZendeskWidget'];