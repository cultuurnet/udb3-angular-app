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

          term = min + ' TO ' + max;

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

    /**
     * Unparse a grouped field information tree to a query string
     *
     * @param   {object}  groupedTree     A tree structure with field groups
     * @return  {string}  A query string
     */
    this.unparseGroupedTree = function (groupedTree) {
      var root = groupedTree;
      var queryString = '';

      _.forEach(root.nodes, function (node, nodeIndex) {
        var nodeString = '';
        if(node.type === 'group') {
          var group = node;

          nodeString += '(';

          _.forEach(group.nodes, function(field, fieldIndex) {
            if(fieldIndex) {
              nodeString += ' ' + node.operator + ' ';
            }
            nodeString += field.field + ':' + field.term;
          });

          nodeString += ')';
        } else if (node.type === 'field') {
          var field = node.nodes[0];
          nodeString = field.field + ':' + field.term;
        } else {
          console.log('node type not recognized?');
        }

        // do not prepend the first node with an operator
        if(nodeIndex) {
          queryString += ' ' + root.operator + ' ';
        }
        queryString += nodeString;
      });

      return queryString;
    };

    /**
     * Generate a grouped field information tree from a query tree
     *
     * The query tree should not be nest different operators deeper than 2 levels.
     * Modifiers will be ignored.
     *
     * @param   {object}  queryTree   - The queryTree to get information from
     *
     * @return  {object}              - A grouped field information tree
     */
    this.groupQueryTree = function (queryTree) {
      var groupedFieldTree = {
        type: 'root',
        nodes: []
      };

      groupedFieldTree.operator = queryTree.operator || 'OR';

      this.groupNode(queryTree, groupedFieldTree);

      return groupedFieldTree;
    };

    /**
     * Group the nodes in a query tree branch
     *
     * @param {object}  branch        - The branch of a query tree
     * @param {object}  fieldTree     - The field tree that will be returned
     */
    this.groupNode = function (branch, fieldTree) {
      if (branch.left) {
        var fieldGroup = {
          type: 'group',
          operator: branch.operator,
          nodes: []
        };

        if (branch.left.field) {
          fieldGroup.nodes.push(makeField(branch.left));
        }

        if (branch.right && branch.right.field) {
          fieldGroup.nodes.push(makeField(branch.right));
        } else {
          throw 'We must go deeper!';
        }

        fieldTree.nodes.push(fieldGroup);
      }
    };

    function makeField(node) {
      return {
        field: node.field,
        term: node.term,
        fieldType: 'string'
      };
    }

  }]);
