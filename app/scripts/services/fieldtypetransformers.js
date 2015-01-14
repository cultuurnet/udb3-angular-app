'use strict';

/**
 * @ngdoc service
 * @name udbApp.fieldTypeTransformers
 * @description
 * # fieldTypeTransformers
 * Value in the udbApp.
 */
angular.module('udbApp')
  .value('fieldTypeTransformers', {
    'string': ['!', '='],
    'tokenized-string': ['+', '-'],
    'choice': ['=', '!'],
    'term': ['=', '!'],
    'number': ['=', '<', '>'],
    'check': ['='],
    'date-range': ['=', '><', '<', '>']
});
