'use strict';

/**
 * @ngdoc service
 * @name udbApp.QueryTreeValidator
 * @description
 * # QueryTreeValidator
 * Service in the udbApp.
 */
angular.module('udbApp')
  .service('QueryTreeValidator', function QueryTreeValidator(queryFields) {

    var validFields = queryFields,
        implicitToken = '<implicit>';

    var validateFields = function (current, depth, errors) {
      var left = current.left || false,
          right = current.right || false,
          nodes = [];

      errors = errors || [];

      if(left) { nodes.push(left); }
      if(right) { nodes.push(right); }

      for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i];
        if (typeof node === 'object'){
          validateFields(node, depth + 1, errors);
        }
      }

      var field = current.field;
      if(typeof(field) !== 'undefined') {
        if(field !== null && (field === implicitToken || _.contains(validFields, field))) {
        }
        else {
          errors.push(field + ' is not a valid search field');
        }
      }

      var feedback;
      if(depth === 0) {
        if(errors.length) {
          return errors;
        } else {
          return current;
        }
      }
    };

    this.validate = function (queryTree) {
      return validateFields(queryTree, 0);
    };

    var unparseTree = function (branch, depth, sentence) {

      if(branch.left) {
        var result,
            operator = (branch.operator === implicitToken) ? ' ' : (' ' + branch.operator + ' ');

        if(branch.right) {
          result = unparseTree(branch.left, depth + 1, sentence) + operator + unparseTree(branch.right, depth + 1, sentence);
          if(depth > 0) {
            result = '(' + result + ')';
          }
        } else{
          result = unparseTree(branch.left, depth + 1, sentence);
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

    this.unparse = function (queryTree) {
      var queryString = '';

      if(queryTree.left) {
        queryString = unparseTree(queryTree, 0, '');
      }

      return queryString;
    };
  });
