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
  .controller('offerTranslatorUIController', OfferTranslatorUIController);

/* @ngInject */
function OfferTranslatorUIController($controller, $scope, offerLocator, $q, $stateParams) {
  var offerCdbid = $stateParams.id;

  angular.extend(this, $controller('EventTranslateController', {
    $scope: $scope,
    offerId: offerCdbid ? offerLocator.get(offerCdbid) : $q.reject()
  }));
}
OfferTranslatorUIController.$inject = ['$controller', '$scope', 'offerLocator', '$q', '$stateParams'];
