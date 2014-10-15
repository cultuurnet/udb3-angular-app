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

    var validFields = queryFields;

    var validateFields = function (current, depth, errors) {
      var left = current.left || false,
          right = current.right || false,
          nodes = [];

      if(typeof errors === 'undefined'){
        errors = [];
      };

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
        if(field !== null && _.contains(validFields, field)) {
          console.log(field);
        }
        else {
          errors.push(field + " is not a valid search field");
        }
      }

      var feedback;
      if(depth == 0) {
        if(errors.length) {
          return errors;
        } else {
          return current;
        }
      }
    }

    this.validate = function (queryTree) {
      return validateFields(queryTree, 0);
    }
  });
