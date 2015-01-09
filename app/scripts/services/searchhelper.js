'use strict';

/**
 * @ngdoc service
 * @name udbApp.searchHelper
 * @description
 * # searchHelper
 * Service in the udbApp.
 */
angular.module('udbApp')
  .service('searchHelper', function (LuceneQueryBuilder) {
    var query = {
      queryString: ''
    };

    this.setQueryString = function (queryString) {
      query = LuceneQueryBuilder.createQuery(queryString);
      LuceneQueryBuilder.isValid(query);
    };

    this.setQuery = function (searchQuery) {
      query = searchQuery;
    };

    this.getQuery = function () {
      return query;
    };
  });
