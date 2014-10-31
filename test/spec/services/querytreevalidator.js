'use strict';

describe('Service: QueryTreeValidator', function () {

  // load the service's module
  beforeEach(module('udbApp'));

  beforeEach(module(function($provide) {
    var queryFields = [
      'allowed-query-field'
    ];

    $provide.value('queryFields', queryFields);
  }));

  // instantiate validator
  var QueryTreeValidator;
  beforeEach(inject(function (_QueryTreeValidator_) {
    QueryTreeValidator = _QueryTreeValidator_;
  }));

  it('should not allow unspecified query field', function () {
    var queryTree = {
          left: {
            field: 'unapproved-query-field',
            term: 'some-search-term'
          }
        },
        errors = [];

    QueryTreeValidator.validate(queryTree, errors);

    expect(errors[0]).toBe('unapproved-query-field is not a valid search field');

  });

  it('should allow valid query field', function () {
    var queryTree = {
        left: {
          field: 'allowed-query-field',
          term: 'some-search-term'
        }
      },
      errors = [];

    QueryTreeValidator.validate(queryTree, errors);

    expect(errors.length).toBe(0);

  });

});
