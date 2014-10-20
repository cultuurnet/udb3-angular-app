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

    $scope.$watch('searchQuery', function (queryString) {
      $scope.queryErrors = [];
      var queryTree = queryBuilder.parseQueryString(queryString, $scope.queryErrors);

      if($scope.queryErrors.length === 0) {
        queryBuilder.translate(queryTree);
        queryBuilder.validate(queryTree, $scope.queryErrors);
      }

      if($scope.queryErrors.length === 0) {
        var realQuery = queryBuilder.unparseQueryTree(queryTree);
        $scope.resultViewer.queryChanged(queryString);
        debouncedUpdateEvents(realQuery);

        if(realQuery !== queryString) {
          $scope.realQuery = realQuery;
        } else {
          $scope.realQuery = false;
        }
      }

    });
  });
