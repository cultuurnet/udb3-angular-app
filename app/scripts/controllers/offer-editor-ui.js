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
function OfferEditorUIController($controller, $scope, offerLocator, $q, $stateParams) {
  var offerCdbid = $stateParams.id;

  angular.extend(this, $controller('EventFormController', {
    $scope: $scope,
    offerId: offerCdbid ? offerLocator.get(offerCdbid) : $q.reject()
  }));
}
OfferEditorUIController.$inject = ['$controller', '$scope', 'offerLocator', '$q', '$stateParams'];
