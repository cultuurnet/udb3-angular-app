'use strict';

/**
 * @ngdoc directive
 * @name udbApp.directive:udbQueryEditor
 * @description
 * # udbQueryEditor
 */
angular.module('udbApp')
  .directive('udbQueryEditor', function ( queryFields, LuceneQueryBuilder) {
    return {
      templateUrl: 'views/query-editor.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        var queryBuilder = LuceneQueryBuilder;
        
        scope.fields = queryFields;
        scope.operators = [
          'AND',
          'OR',
          'NOT'
        ];
        scope.flatFields = [];
        scope.fieldValue = 'title';
        scope.queryFromError = undefined;
        
        scope.$watch('query', function (query) {
          try{
            var flatFields = queryBuilder.flattenQueryTree(query);
            scope.flatFields = flatFields;
            scope.queryFormError = undefined;
          } catch (e) {
            scope.flatFields = undefined;
            scope.queryFromError = e;
          }
        }, true);
      }
    };
  });
