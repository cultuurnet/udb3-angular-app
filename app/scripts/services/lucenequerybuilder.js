'use strict';

/**
 * @ngdoc service
 * @name udbApp.LuceneQueryBuilder
 * @description
 * # LuceneQueryBuilder
 * Service in the udbApp.
 */
angular.module('udbApp')
  .service('LuceneQueryBuilder', ['LuceneQueryParser', function LuceneQueryBuilder(LuceneQueryParser) {
      var implicitToken = '<implicit>';

      this.parseQueryString = function (queryString) {
        return LuceneQueryParser.parse(queryString);
      };

      var unparseNode = function (branch, depth, sentence) {

        if(branch.left) {
          var result,
              operator = (branch.operator === implicitToken) ? ' ' : (' ' + branch.operator + ' ');

          if(branch.right) {
            result = unparseNode(branch.left, depth + 1, sentence);
            result += operator;
            result += unparseNode(branch.right, depth + 1, sentence);

            if(depth > 0) {
              result = '(' + result + ')';
            }
          } else{
            result = unparseNode(branch.left, depth + 1, sentence);
          }

          return result;

        } else {
          var fieldQuery = '',
              term = branch.term;

          if(branch.field !== implicitToken) {
            fieldQuery += (branch.field + ':');
          }

          if(term.indexOf(' ') !== -1) {
            term = '"' + term + '"';
          }

          fieldQuery += term;

          return sentence += fieldQuery;
        }

        if(depth === 0) {
          return sentence;
        }
      };

      this.unparseQueryTree = function (queryTree) {
        var queryString = '';

        if(queryTree.left) {
          queryString = unparseNode(queryTree, 0, '');
        }

        return queryString;
      };
    }]);
