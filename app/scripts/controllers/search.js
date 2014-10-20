'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the udbApp
 */
angular.module('udbApp')
  .controller('SearchCtrl', function ($scope, UdbApi, LuceneQueryBuilder) {
    var queryBuilder = LuceneQueryBuilder;

    $scope.searchQuery = '';
    $scope.resultViewer = new udb.SearchResultViewer();
    $scope.queryErrors = [];
    $scope.realQuery = false;

    var debouncedUpdateEvents = _.debounce(function(queryString) {
      var eventPromise = UdbApi.findEvents(queryString);
      $scope.resultViewer.updateEvents(eventPromise);
    }, 1000);

    var updateQuery = function (query) {
      var realQuery = queryBuilder.unparse(query);
      $scope.resultViewer.queryChanged(realQuery);
      debouncedUpdateEvents(realQuery);

      if(realQuery !== query.queryString) {
        $scope.realQuery = realQuery;
      } else {
        $scope.realQuery = false;
      }
    };

    $scope.$watch('searchQuery', function (queryString) {
      var query = queryBuilder.createQuery(queryString);

      if(queryBuilder.isValid(query)) {
        updateQuery(query);
        $scope.queryErrors = [];
      } else {
        $scope.queryErrors = query.errors;
      }

    });
  });
