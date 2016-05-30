'use strict';

angular
  .module('udbApp')
  .component('eventDetailComponent', {
    templateUrl: 'templates/event-detail.html',
    controller: EventDetailComponent
  });

function EventDetailComponent($controller, $scope, offerLocator, $q) {
  var deferredEventLocation = $q.defer();

  angular.extend(this, $controller('EventDetailController', {
    $scope: $scope,
    eventId: deferredEventLocation.promise
  }));
  
  this.$routerOnActivate = function(next, previous) {
    var id = next.params.id;
    return offerLocator.get(id).then(function(eventLocation) {
      deferredEventLocation.resolve(eventLocation);
    });
  };
}
EventDetailComponent.$inject = ['$controller', '$scope', 'offerLocator', '$q'];
