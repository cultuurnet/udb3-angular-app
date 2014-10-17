'use strict';

/**
 * @ngdoc service
 * @name udbApp.UdbApi
 * @description
 * # UdbApi
 * Service in the udbApp.
 */
angular.module('udbApp')
    .service('UdbApi', function UdbApi($q, $http) {
      /**
       * @param {string} queryString - The query used to find events.
       * @param {?number} start - From which offset the result set should start.
       * @returns {Promise} A promise that signals a succesful retrieval of
       *  search results or a failure.
       */
      this.findEvents = function (queryString, start) {
        var deferredEvents = $q.defer(),
            start = start || 0,
            base_url = 'http://culudb-silex.dev:8080/api/1.0/';

        if (queryString.length) {
          var request = $http.get(base_url + 'search', {
            params: {
              'query': queryString,
              'start': start
            }
          });
          request
              .success(function (data) {
                deferredEvents.resolve(data);
              })
              .error(function () {
                deferredEvents.reject();
              });
        }
        else {
          deferredEvents.resolve({});
        }

        return deferredEvents.promise;
      };
    });
