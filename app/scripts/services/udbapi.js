'use strict';

/**
 * @ngdoc service
 * @name udbApp.UdbApi
 * @description
 * # UdbApi
 * Service in the udbApp.
 */
angular.module('udbApp')
    .service('UdbApi', function UdbApi($q, $http, appConfig, $cookieStore, uitidAuth) {
      var apiUrl = appConfig.baseApiUrl;

      /**
       * @param {string} queryString - The query used to find events.
       * @param {?number} start - From which event offset the result set should start.
       * @returns {Promise} A promise that signals a succesful retrieval of
       *  search results or a failure.
       */
      this.findEvents = function (queryString, start) {
        var deferredEvents = $q.defer(),
            offset = start || 0;

        if (queryString.length) {
          var request = $http.get(apiUrl + 'search', {
            params: {
              'query': queryString,
              'start': offset
            },
            withCredentials: true,
            headers: {
              'Accept': 'application/ld+json'
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

    this.getEventByLDId = function(eventId) {
      var deferredEvent = $q.defer();

      var eventRequest  = $http.get(eventId, {
        headers: {
          'Accept': 'application/ld+json'
        }
      });

      eventRequest.success(function(eventData) {
        deferredEvent.resolve(eventData);
      });

      return deferredEvent.promise;
    };

    /**
     * @returns {Promise} A promise with the credentials of the currently logged in user.
     */
      this.getMe = function () {
        var deferredUser = $q.defer();

        var activeUser = uitidAuth.getUser();

        if(activeUser) {
          console.log('retrieving user info from cookie');
          deferredUser.resolve(activeUser);
        } else {

          var request = $http.get(apiUrl + 'user', {
            withCredentials: true
          });

          request.success(function(userData) {
            $cookieStore.put('user', userData);
            deferredUser.resolve(userData);
          });

          request.error(function () {
            deferredUser.reject();
          });
        }

        return deferredUser.promise;
      };
    });
