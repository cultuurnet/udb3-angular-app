'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the udbApp
 */
angular.module('udbApp')
  .controller('SearchCtrl', function ($scope, UdbApi, LuceneQueryParser, QueryTreeValidator) {
    var parser = LuceneQueryParser,
        validator = QueryTreeValidator;

    $scope.searchQuery = '';
    $scope.resultViewer = new udb.SearchResultViewer();
    $scope.queryErrors = [];

    var parseQueryString = function (queryString) {
      var errors = [],
          queryTree;

      try {
        queryTree = parser.parse(queryString);
      } catch (e) {
        errors.push(e.message);
      }

      if(queryTree) {
        var validatorFeedback = validator.validate(queryTree);
        if (_.isArray(validatorFeedback)) {
          errors = _.union(validatorFeedback, errors);
        } else {
          console.log(validator.unparse(queryTree));
        }
      }

      return errors;
    };

    var debouncedUpdateEvents = _.debounce(function(eventPromise){
      $scope.resultViewer.updateEvents(eventPromise);
    }, 1000);

    $scope.$watch('searchQuery', function (queryString) {

      $scope.resultViewer.queryChanged(queryString);
      debouncedUpdateEvents(UdbApi.findEvents(queryString));
      $scope.queryErrors = parseQueryString(queryString);

    });

  });
