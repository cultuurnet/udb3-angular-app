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
  .controller('eventDetailUIController', eventDetailUIController);

/* @ngInject */
function eventDetailUIController($controller, $scope, offerLocator, $q, authorizationService, $stateParams) {
  var deferredEventLocation = $q.defer();

  angular.extend(this, $controller('EventDetailController', { // jshint ignore:line
    $scope: $scope,
    eventId: deferredEventLocation.promise
  }));

  var id = $stateParams.id;
  offerLocator.get(id).then(function(eventLocation) {
    deferredEventLocation.resolve(eventLocation);
  });

}
eventDetailUIController.$inject = ['$controller', '$scope', 'offerLocator', '$q', 'authorizationService', '$stateParams'];
