'use strict';

/**
 * @ngdoc service
 * @name udbApp.UdbApi
 * @description
 * # UdbApi
 * Service in the udbApp.
 */
angular.module('udbApp')
    .service('UdbApi', function UdbApi($q, $http, appConfig) {
      /**
       * @param {string} queryString - The query used to find events.
       * @param {?number} start - From which offset the result set should start.
       * @returns {Promise} A promise that signals a succesful retrieval of
       *  search results or a failure.
       */
      this.findEvents = function (queryString, start) {
        var deferredEvents = $q.defer(),
            offset = start || 0;

        if (queryString.length) {
          var request = $http.get(appConfig.baseUrl + 'search', {
            params: {
              'query': queryString,
              'start': offset
            }
          });
          request
              .success(function (data) {
                var singleEventRequests = [];
                angular.forEach(data.member, function(value) {
                  singleEventRequests.push($http.get(value['@id']));
                });

                $q.all(singleEventRequests).then(function(responses) {
                  angular.forEach(responses, function(response, key) {
                    data.member[key] = response.data;
                  });

                  deferredEvents.resolve(data);
                });

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
