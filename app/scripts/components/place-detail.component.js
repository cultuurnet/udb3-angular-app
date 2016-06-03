'use strict';

angular
  .module('udbApp')
  .component('placeDetailComponent', {
    templateUrl: 'templates/place-detail.html',
    controller: PlaceDetailComponent
  });

function PlaceDetailComponent($controller, $scope, offerLocator, $q, authorizationService) {
  var deferredPlaceLocation = $q.defer();

  angular.extend(this, $controller('PlaceDetailController', {
    $scope: $scope,
    placeId: deferredPlaceLocation.promise
  }));

  this.$routerCanActive = authorizationService.isLoggedIn();

  this.$routerOnActivate = function(next, previous) {
    var id = next.params.id;
    return offerLocator.get(id).then(function(eventLocation) {
      deferredPlaceLocation.resolve(eventLocation);
    });
  };
}
PlaceDetailComponent.$inject = ['$controller', '$scope', 'offerLocator', '$q', 'authorizationService'];
