'use strict';

/**
 * @ngdoc service
 * @name udbApp.QueryTreeTranslator
 * @description
 * # QueryTreeTranslator
 * Service in the udbApp.
 */
angular.module('udbApp')
  .service('QueryTreeTranslator', ['queryFieldTranslations', function QueryTreeTranslator(queryFieldTranslations) {

    var translations = queryFieldTranslations;

    var translateField = function(field, srcLang, dstLang) {
      var translation = field,
          identifier = _.findKey(translations.srcLang, 'field');

      if(identifier) {
        translation = translations.dstLang.identifier;
      }

      return translation;
    };

    var translateNode = function(node, depth) {
      var left = node.left || false,
          right = node.right || false,
          nodes = [];

      if(left) { nodes.push(left); }
      if(right) { nodes.push(right); }

      for (var i = 0, len = nodes.length; i < len; i++) {
        var iNode = nodes[i];
        if (typeof iNode === 'object'){
          translateNode(iNode, depth + 1);
        }
      }

      var field = node.field;
      if(typeof(field) !== 'undefined') {
        field = translateField(field, 'nl', 'en');
      }

    };

    this.translateQueryTree = function (queryTree) {
      return translateNode(queryTree, 0);
    };
  }]);
