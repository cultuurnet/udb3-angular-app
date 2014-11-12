'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the udbApp
 */
angular.module('udbApp')
  .controller('SearchCtrl', function ($scope, UdbApi, LuceneQueryBuilder, $window, $location, $modal, SearchResultViewer) {
    var queryBuilder = LuceneQueryBuilder;

    $scope.searchQuery = '';
    $scope.resultViewer = new SearchResultViewer();
    $scope.queryErrors = [];
    $scope.realQuery = false;
    $scope.activeQuery = false;

    $scope.$watch(function () {
      return $location.search();
    }, function (searchParams) {

      if(searchParams.page) {
        $scope.resultViewer.currentPage = parseInt(searchParams.page);
      }

      if(searchParams.query) {
        var query = String(searchParams.query);
        $scope.searchQuery = query || '';
      }
    }, true);

    /**
     * This debounce function can be used to delay searching when an input field changes.
     * @param {String} A query string used to find events.
     */
    var debouncedFindEvents = _.debounce(function(queryString) {
      findEvents(queryString);
    }, 1000);

    /**
     *
     * @param Query A query object used to update the interface and result viewer.
     */
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

    /**
     * Fires off a search for events using a plain query string or a query object.
     * @param {String|Query} A query string or object to search with.
     */
    var findEvents = function (query) {
      var offset = ($scope.resultViewer.currentPage - 1) * $scope.resultViewer.pageSize;
      var queryString = typeof query === 'string' ? query : query.queryString;
      var eventPromise = UdbApi.findEvents(queryString, offset);

      // Check if a query string is defined else clear the relevant search parameters.
      if(queryString) {
        $location.search({
          'query' : $scope.searchQuery,
          'page' : String($scope.resultViewer.currentPage)
        });
      } else {
        $location.search({
          'query': null,
          'page': null
        });
      }

      $scope.resultViewer.loading = true;

      eventPromise.then(function(pagedEvents) {
        $scope.resultViewer.setResults(pagedEvents);
      });
    };

    var tagSelection = function () {

      var selectedIds = $scope.resultViewer.selectedIds;

      if(!selectedIds.length) {
        $window.alert('First select the events you want to tag.');
        return;
      }

      var modal = $modal.open({
        templateUrl: 'event-tag-modal.html',
        controller: 'EventTagModalCtrl'
      });

      modal.result.then(function (labels) {
        _.each(selectedIds, function (eventId) {
          var eventPromise = UdbApi.getEventByLDId(eventId);

          eventPromise.then(function (event) {
            event.labels = _.union((event.labels || []), labels);
          });
        });
      });
    };

    $scope.tagSelection = tagSelection;

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

    $scope.$watch('resultViewer.currentPage', function (newPageNr, oldPageNr) {
      if(newPageNr !== oldPageNr) {
        findEvents($scope.activeQuery);
        $window.scroll(0, 0);
      }
    });

  });
