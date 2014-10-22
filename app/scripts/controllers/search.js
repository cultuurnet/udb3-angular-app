'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the udbApp
 */
angular.module('udbApp')
  .controller('SearchCtrl', function ($scope, UdbApi, LuceneQueryBuilder, $window) {
    var queryBuilder = LuceneQueryBuilder;

    $scope.searchQuery = '';
    $scope.resultViewer = new udb.SearchResultViewer();
    $scope.queryErrors = [];
    $scope.realQuery = false;
    $scope.activeQuery = false;

    var debouncedFindEvents = _.debounce(function(queryString) {
      findEvents(queryString);
    }, 1000);

    var updateQuery = function (query) {
      var realQuery = queryBuilder.unparse(query);
      $scope.resultViewer.queryChanged(realQuery);
      debouncedFindEvents(realQuery);

      if(realQuery !== query.originalQueryString) {
        $scope.realQuery = realQuery;
      } else {
        $scope.realQuery = false;
      }
    };

    var findEvents = function (query) {
      var offset = ($scope.resultViewer.currentPage - 1) * $scope.resultViewer.pageSize;
      var queryString = typeof query === 'string' ? query : query.queryString;
      var eventPromise = UdbApi.findEvents(queryString, offset);

      $scope.resultViewer.loading = true;

      eventPromise.then(function(pagedEvents) {
        $scope.resultViewer.updateEvents(pagedEvents);
      });
    };

    $scope.$watch('searchQuery', function (queryString) {
      var query = queryBuilder.createQuery(queryString);

      $scope.activeQuery = query;

      if(queryBuilder.isValid(query)) {
        updateQuery(query);
        $scope.queryErrors = [];
      } else {
        $scope.queryErrors = query.errors;
      }

    });

    $scope.$watch('resultViewer.currentPage', function (currentPage) {
      findEvents($scope.activeQuery);
      $window.scroll(0, 0);
    });

  });
