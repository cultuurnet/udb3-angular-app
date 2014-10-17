'use strict';

/**
 * @ngdoc service
 * @name udbApp.QueryTreeValidator
 * @description
 * # QueryTreeValidator
 * Service in the udbApp.
 */
angular.module('udbApp')
  .service('QueryTreeValidator', ['queryFields', function QueryTreeValidator(queryFields) {

    var validFields = queryFields,
        implicitToken = '<implicit>';

    var validateFields = function (current, depth, errors) {
      var left = current.left || false,
          right = current.right || false,
          nodes = [];

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
        if(field !== null && field !== implicitToken && !_.contains(validFields, field)) {
          errors.push(field + ' is not a valid search field');
        }
      }
    };

    this.validate = function (queryTree, errors) {
      validateFields(queryTree, 0, errors);
    };

  }]);
