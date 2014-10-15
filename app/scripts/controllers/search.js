'use strict';

/**
 * @ngdoc function
 * @name udbAppApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the udbAppApp
 */
angular.module('udbApp')
  .controller('SearchCtrl', function ($scope, UdbApi, LuceneQueryParser, QueryTreeValidator) {
    var parser = LuceneQueryParser,
        validator = QueryTreeValidator;

    $scope.searchQuery = '';
    $scope.resultViewer = new udb.SearchResultViewer();

    var debouncedUpdateEvents = _.debounce(function(eventPromise){
      $scope.resultViewer.updateEvents(eventPromise);
    }, 1000);

    $scope.$watch('searchQuery', function (query) {
      $scope.resultViewer.queryChanged(query);
      debouncedUpdateEvents(UdbApi.findEvents(query));

      var queryTree = parser.parse(query);

      validator.validate(queryTree);

      console.log(queryTree);
    });

  });
