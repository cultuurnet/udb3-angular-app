'use strict';

angular
  .module('udbApp')
  .component('searchComponent', {
    bindings: { $router: '<' },
    templateUrl: 'templates/search.html',
    controller: searchComponentController
  });

function searchComponentController($controller, $scope, udbApi,
    LuceneQueryBuilder,
    $window,
    $location,
    $uibModal,
    SearchResultViewer,
    offerLabeller,
    offerLocator,
    searchHelper,
    $rootScope,
    eventExporter,
    $translate) {
  angular.extend(this, $controller('Search', {
    $scope: $scope,
    udbApi: udbApi,
    LuceneQueryBuilder: LuceneQueryBuilder,
    $window: $window,
    $location: $location,
    $uibModal: $uibModal,
    SearchResultViewer: SearchResultViewer,
    offerLabeller: offerLabeller,
    offerLocator: offerLocator,
    searchHelper: searchHelper,
    $rootScope: $rootScope,
    eventExporter: eventExporter,
    $translate: $translate
  }));
}

searchComponentController.$inject = ['$controller', '$scope','udbApi',
    'LuceneQueryBuilder',
    '$window',
    '$location',
    '$uibModal',
    'SearchResultViewer',
    'offerLabeller',
    'offerLocator',
    'searchHelper',
    '$rootScope',
    'eventExporter',
    '$translate'];