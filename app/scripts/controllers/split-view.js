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
  var controller = this; // jshint ignore:line
  controller.user = uitidAuth.getUser();
  controller.embedded = window !== window.parent;
}
splitViewController.$inject = ['uitidAuth', '$scope'];
