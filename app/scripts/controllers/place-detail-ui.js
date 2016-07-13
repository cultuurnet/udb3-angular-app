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
  .controller('placeDetailUIController', placeDetailUIController);

/* @ngInject */
function placeDetailUIController($controller, $scope, offerLocator, $q, authorizationService, $stateParams) {
  var deferredPlaceLocation = $q.defer();

  angular.extend(this, $controller('PlaceDetailController', { // jshint ignore:line
    $scope: $scope,
    placeId: deferredPlaceLocation.promise
  }));

  var id = $stateParams.id;
  offerLocator.get(id).then(function(eventLocation) {
    deferredPlaceLocation.resolve(eventLocation);
  });

}
placeDetailUIController.$inject = ['$controller', '$scope', 'offerLocator', '$q', 'authorizationService', '$stateParams'];
