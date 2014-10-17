'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the udbApp
 */
angular.module('udbApp')
  .controller('SearchCtrl', function ($scope, UdbApi, LuceneQueryBuilder, QueryTreeValidator) {
    var queryBuilder = LuceneQueryBuilder,
        validator = QueryTreeValidator;

    $scope.searchQuery = '';
    $scope.resultViewer = new udb.SearchResultViewer();
    $scope.queryErrors = [];

    var parseQueryString = function (queryString) {
      var errors = [],
          queryTree;

      try {
        queryTree = queryBuilder.parseQueryString(queryString);
      } catch (e) {
        errors.push(e.message);
      }

      if(queryTree) {
        var validatorFeedback = validator.validate(queryTree);
        if (_.isArray(validatorFeedback)) {
          errors = _.union(validatorFeedback, errors);
        } else {
          console.log(queryBuilder.unparseQueryTree(queryTree));
        }
      }

      return errors;
    };

    var debouncedUpdateEvents = _.debounce(function(queryString){
      var eventPromise = UdbApi.findEvents(queryString);
      $scope.resultViewer.updateEvents(eventPromise);
    }, 1000);

    $scope.$watch('searchQuery', function (queryString) {

      $scope.queryErrors = parseQueryString(queryString);
      if($scope.queryErrors.length === 0 ) {
        $scope.resultViewer.queryChanged(queryString);
        debouncedUpdateEvents(queryString);
      }
    });

  });
