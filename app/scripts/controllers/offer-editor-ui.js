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
  .controller('offerEditorUIController', OfferEditorUIController);

/* @ngInject */
function OfferEditorUIController($controller, $scope, offerLocator, $q, authorizationService, $stateParams) {
  var deferredEventLocation = $q.defer();

  angular.extend(this, $controller('EventFormController', {
    $scope: $scope,
    offerId: deferredEventLocation.promise
  }));

  var id = $stateParams.id;

  if(id) {
    offerLocator.get(id).then(function(eventLocation) {
      deferredEventLocation.resolve(eventLocation);
    });
  } else {
    deferredEventLocation.reject();
  }

}
OfferEditorUIController.$inject = ['$controller', '$scope', 'offerLocator', '$q', 'authorizationService', '$stateParams'];
