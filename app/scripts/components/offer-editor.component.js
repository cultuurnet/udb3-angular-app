'use strict';

angular
  .module('udbApp')
  .component('offerEditorComponent', {
    templateUrl: 'templates/event-form.html',
    controller: OfferEditorComponent
  });

function OfferEditorComponent($controller, $scope, offerLocator, $q, authorizationService) {
  var deferredEventLocation = $q.defer();

  angular.extend(this, $controller('EventFormController', {
    $scope: $scope,
    eventId: deferredEventLocation.promise
  }));

  this.$routerCanActive = authorizationService.isLoggedIn();

  this.$routerOnActivate = function(next, previous) {
    var id = next.params.id;

    if(id) {
      offerLocator.get(id).then(function(eventLocation) {
        deferredEventLocation.resolve(eventLocation);
      });
    } else {
      deferredEventLocation.reject();
    }

    return $q.resolve('The eventId has been promised, move on!');
  };

}
OfferEditorComponent.$inject = ['$controller', '$scope', 'offerLocator', '$q', 'authorizationService'];
