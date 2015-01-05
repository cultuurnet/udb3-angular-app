'use strict';

/**
 * @ngdoc directive
 * @name udbApp.directive:udbSearchBar
 * @description
 * # udbSearchBar
 */
angular.module('udbApp')
  .directive('udbSearchBar', function ($route, $timeout, searchHelper) {
    return {
      templateUrl: 'views/udb-search-bar.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var searchBar = {
          query: '',
          isShown: false,
          inputElement: element.find('input')[0],
          hasErrors: false,
          errors: ''
        };

        scope.sb = searchBar;

        scope.$watch(function ()  {
          return $route.current;
        }, function (route) {
          if(route && (route.originalPath === '/search')) {
            scope.sb.isShown = true;
            $timeout(function () {
              scope.sb.inputElement.focus();
            });
          } else {
            scope.sb.isShown = false;
          }
        });

        scope.$watch('sb.query', function (queryString) {
          searchHelper.setQueryString(queryString);
        });

        scope.$watch(function () {
          return searchHelper.getQuery();
        }, function (query) {
          console.log(query);
          scope.sb.query = query.queryString;

          if(query.errors && query.errors.length) {
            scope.sb.hasErrors = true;
            scope.sb.errors = formatErrors(query.errors);
          } else {
            scope.sb.hasErrors = false;
            scope.sb.errors = '';
          }
        }, true);

        function formatErrors(errors) {
          var formattedErrors = '';

          _.forEach(errors, function (error) {
            formattedErrors += (error + '<br>');
          });

          return formattedErrors;
        }
      }
    };
  });
