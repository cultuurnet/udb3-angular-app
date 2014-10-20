'use strict';

/**
 * @ngdoc service
 * @name udbApp.LuceneQueryBuilder
 * @description
 * # LuceneQueryBuilder
 * Service in the udbApp.
 */
angular.module('udbApp')
  .service('LuceneQueryBuilder', ['LuceneQueryParser', 'QueryTreeValidator', 'QueryTreeTranslator', function LuceneQueryBuilder(LuceneQueryParser, QueryTreeValidator, QueryTreeTranslator) {
      var implicitToken = '<implicit>';

      this.translate = function (query) {
        QueryTreeTranslator.translateQueryTree(query.queryTree);
      };

      this.validate = function (query) {
        QueryTreeValidator.validate(query.queryTree, query.errors);
      };

      this.isValid = function(query) {
        this.translate(query);
        this.validate(query);

        return query.errors.length === 0;
      };

      this.parseQueryString = function (query) {
        try {
          query.queryTree = LuceneQueryParser.parse(query.queryString);
        } catch (e) {
          query.errors.push(e.message);
        }

        return query.queryTree;
      };

    /**
     *
     * @param {string} queryString
     */
      this.createQuery = function (queryString) {
        var query = {
          originalQueryString: queryString,
          queryString: queryString,
          queryTree: {},
          errors: []
        };

        this.parseQueryString(query);

        return query;
      };

      var printTerm = function (node) {
        var term = node.term,
            isRangeExpression = (typeof node.term === 'undefined');

        if(isRangeExpression) {
          var min = node.term_min, // jshint ignore:line
              max = node.term_max, // jshint ignore:line
              inclusive = node.inclusive;

          term = min + ' OR ' + max;

          if(inclusive) {
            term = '[' + term + ']';
          } else {
            term = '{' + term + '}';
          }
        } else {
          // if the term is a phrase surround it with double quotes
          if(term.indexOf(' ') !== -1) {
            term = '"' + term + '"';
          }

          // check for fuzzy search modifier
          if(node.similarity) {
            term += ('~' + node.similarity);
          }

          // check for proximity modifier
          if(node.proximity) {
            term += ('~' + node.proximity);
          }

          // check for prefix modifier
          if(node.prefix) {
            term = node.prefix + term;
          }

          // check for boost modifier
          if(node.boost) {
            term += ('^' + node.boost);
          }
        }

        return term;
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

            if(branch.field && branch.field !== implicitToken) {
              result = (branch.field + ':') + result;
            }

          } else{
            result = unparseNode(branch.left, depth + 1, sentence);
          }

          return result;

        } else {
          var fieldQuery = '',
              term = printTerm(branch);

          if(branch.field !== implicitToken && branch.field !== null) {
            fieldQuery += (branch.field + ':');
          }

          fieldQuery += term;

          return sentence += fieldQuery;
        }

        if(depth === 0) {
          return sentence;
        }
      };

      this.unparse = function (query) {
        query.queryString = this.unparseQueryTree(query.queryTree);
        return query.queryString;
      };

      this.unparseQueryTree = function (queryTree) {
        var queryString = '';

        if(queryTree.left) {
          queryString = unparseNode(queryTree, 0, '');
        }

        return queryString;
      };
    }]);
