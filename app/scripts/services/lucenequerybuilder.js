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
     * @description
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
     * @description
     * Generate a grouped field information tree from a query tree
     * The query tree should not nest different operators deeper than 2 levels.
     * Modifiers will be ignored.
     *
     * @param   {object}  queryTree   - The queryTree to get information from
     *
     * @return  {object}              - A grouped field information tree
     */
    this.groupQueryTree = function (queryTree) {
      var groupedFieldTree = {
        type: 'root',
        nodes: [],
        operator: queryTree.operator || 'OR'
      };

      this.groupNode(queryTree, groupedFieldTree);
      this.cleanUpGroupedFieldTree(groupedFieldTree);

      return groupedFieldTree;
    };

    /**
     * @description
     * Clean up a field tree after grouping.
     * Used by groupQueryTree to cleanse a freshly grouped tree.
     *
     * @param {object} groupedFieldTree
     */
    this.cleanUpGroupedFieldTree = function (groupedFieldTree) {
      _.forEach(groupedFieldTree.nodes, function (fieldGroup) {
        // This property is just used to track implicit fields and can be removed when switching groups.
        delete fieldGroup.implicitField;

        // Switch the type of the node to field instead of group if it only contains one field.
        if(fieldGroup.nodes && fieldGroup.nodes.length === 1) {
          fieldGroup.type = 'field';
        }

        // Replace any remaining implicitly declared operators with OR.
        // Assuming the following term grouping syntax was used "field:(term1 term2)".
        if(fieldGroup.operator === implicitToken) {
          fieldGroup.operator = 'OR';
        }
      });
    };

    /**
     * @description
     * Group a node in a query tree branch.
     * You should not need to call this method directly, use groupQueryTree instead.
     *
     * @param {object}  branch        - The branch of a query tree
     * @param {object}  fieldTree     - The field tree that will be returned
     * @param {object}  [fieldGroup]  - Keeps track of the current field group
     */
    this.groupNode = function (branch, fieldTree, fieldGroup) {
      // if the operator is implicit, you're dealing with grouped terms eg: field:(term1 term2)
      if(branch.operator === implicitToken) {
        branch.operator = 'OR';
      }
      if (!fieldGroup || branch.operator && (branch.operator !== fieldGroup.operator)) {
        var newFieldGroup = {
          type: 'group',
          operator: branch.operator || 'OR',
          nodes: []
        };

        fieldTree.nodes.push(newFieldGroup);
        fieldGroup = newFieldGroup;
      }

      // Track the last used field name to apply to implicitly defined terms
      if(branch.field && branch.field !== implicitToken) {
        fieldGroup.implicitField = branch.field;
      }

      if(branch.term) {
        var field = branch.field;

        // Handle implicit field names by using the last used field name
        if(field === implicitToken) {
          if(fieldGroup.implicitField) {
            field = fieldGroup.implicitField;
          } else {
            throw 'Field name is implicit and not defined elsewhere.';
          }
        }

        fieldGroup.nodes.push(makeField(branch, field));
      }

      if(branch.left) {
        this.groupNode(branch.left, fieldTree, fieldGroup);
        if(branch.right) {
          this.groupNode(branch.right, fieldTree, fieldGroup);
        }
      }
    };

    /**
     * @description
     * Generate a field object that's used to render the query editor fields.
     *
     * @param {object} node The node with all the necessary information
     * @return {object} A field object used to render the query editor
     */
    function makeField(node, fieldName) {
      return {
        field: fieldName || node.field,
        term: node.term,
        fieldType: 'string'
      };
    }

  }]);
