'use strict';

/**
 * @ngdoc directive
 * @name udbApp.directive:udbQueryEditor
 * @description
 * # udbQueryEditor
 */
angular
  .module('udbApp')
  .directive('udbQueryEditor', function (
    queryFields,
    queryFieldTypes,
    LuceneQueryBuilder,
    taxonomyTerms,
    fieldTypeTransformers,
    searchHelper
  ) {
    return {
      templateUrl: 'views/query-editor.html',
      restrict: 'E',
      controllerAs: 'qe',
      link: function link(scope) {
        var queryBuilder = LuceneQueryBuilder;

        scope.$watch('activeQuery.groupedQueryTree', function (groupedQueryTree) {
          if(groupedQueryTree) {
            scope.qe.groupedQueryTree = groupedQueryTree;
          }
        },true);
      },
      controller: function QueryEditor($scope) {
        var qe = this,
            queryBuilder = LuceneQueryBuilder;

        qe.fields = _.difference(queryFields, ['category_name']);
        qe.operators = ['AND', 'OR'];
        qe.groupedQueryTree = {
          operator: 'OR',
          type: 'root',
          nodes: []
        };
        qe.colorScheme = ['rgb(141,211,199)','rgb(255,255,179)','rgb(190,186,218)','rgb(251,128,114)','rgb(128,177,211)','rgb(253,180,98)','rgb(179,222,105)','rgb(252,205,229)','rgb(217,217,217)','rgb(188,128,189)','rgb(204,235,197)'];

        // Holds options for both term and choice query-field types
        qe.transformers = {};
        qe.termOptions = _.groupBy(taxonomyTerms, function (term) {
            return 'category_' + term.domain + '_name';
          });
        _.forEach(queryFieldTypes, function(fieldType) {
          if(fieldType.type === 'choice') {
            qe.termOptions[fieldType.name] = fieldType.options;
          }
          qe.transformers[fieldType.name] = fieldTypeTransformers[fieldType.type];
        });

        /**
         * Update the search input field with the data from the query editor
         */
        qe.updateQueryString = function () {
          searchHelper.setQueryString(queryBuilder.unparseGroupedTree(qe.groupedQueryTree));
        };

        /**
         * Add a field to a group
         *
         * @param {number}  groupIndex  The index of the group to add the field to
         */
        qe.addField = function (groupIndex) {
          var root = qe.groupedQueryTree;
          var group = root.nodes[groupIndex];

          var field = {
            field: 'type',
            term: '',
            fieldType: 'string',
            transformer: '='
          };

          group.nodes.push(field);

          if(group.nodes.length) {
            group.type = 'group';
          }
        };

        /**
         * Remove a field from a group
         *
         * @param {number}  groupIndex  The index of the group to delete a field from
         * @param {number}  fieldIndex  The index of the field to delete
         */
        qe.removeField = function (groupIndex, fieldIndex) {
          var root = qe.groupedQueryTree;
          var group = root.nodes[groupIndex];

          if( qe.canRemoveField() ) {
            group.nodes.splice(fieldIndex, 1);
          }

          if (group.nodes.length < 2) {
            if(group.nodes.length) {
              group.type = 'field';
            } else {
              root.nodes.splice(groupIndex, 1);
            }
          }
        };

        /**
         * Check if a field can be removed without leaving a single empty group
         * @return {boolean}
         */
        qe.canRemoveField = function () {
          return !(qe.hasSingleGroup() && (qe.groupedQueryTree.nodes[0].nodes.length === 1));
        };

        /**
         * Add a field group
         */
        qe.addGroup = function () {
          var root = qe.groupedQueryTree;
          var group = {
            type: 'field',
            operator: 'OR',
            nodes: [
              {
                field: 'type',
                term: '',
                fieldType: 'string',
                transformer: '='
              }
            ]
          };

          root.nodes.push(group);
        };

        qe.updateFieldType = function (field) {
          var fieldName = field.field,
              fieldType = _.find(queryFieldTypes, function (fieldType) {
                return fieldType.name === fieldName;
              });

          if(field.fieldType !== fieldType.type) {
            // TODO: Maybe try to do a type conversion?
            if(fieldType.type === 'date-range') {
              field.term_min = new Date(); // jshint ignore:line
              field.term_max = new Date(); // jshint ignore:line
              field.inclusive = true;
            } else {
              field.term = '';
            }

            if(!field.transformer || !_.contains(fieldTypeTransformers[fieldType.type], field.transformer)) {
              field.transformer = _.first(fieldTypeTransformers[fieldType.type]);
            }

            field.fieldType = fieldType.type;
          }
        };

        qe.hasSingleGroup = function () {
          return (qe.groupedQueryTree.nodes.length === 1);
        };
      }
    };
  });
