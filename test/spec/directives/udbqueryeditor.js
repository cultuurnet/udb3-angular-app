'use strict';

describe('Directive: udbQueryEditor', function () {

  // load the directive's module
  beforeEach(module('udbApp'));

  var scope;

  var exampleGroupedQueryTree =
  { operator: 'AND',
    type: 'root',
    nodes: [
      { type: 'group',
        operator: 'OR',
        nodes: [
          {
            field: 'title',
            term: 'awesome',
            fieldType: 'string'
          },
          {
            field: 'location_label',
            term: 'sparta',
            fieldType: 'string'
          },
          {
            field: 'type',
            term: 'special',
            fieldType: 'string'
          }
        ]
      },

      { type: 'field',
        operator: 'OR',
        nodes: [
          {
            field: 'title',
            term: 'awesome',
            fieldType: 'string'
          }
        ]
      },

      { type: 'group',
        operator: 'AND',
        nodes: [
          {
            field: 'title',
            term: 'awesome',
            fieldType: 'string'
          },
          {
            field: 'title',
            term: 'awesome',
            fieldType: 'string'
          }
        ]
      }
    ]
  };

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));
});
