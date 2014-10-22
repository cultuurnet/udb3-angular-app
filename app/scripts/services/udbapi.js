'use strict';

/**
 * @ngdoc service
 * @name udbApp.UdbApi
 * @description
 * # UdbApi
 * Service in the udbApp.
 */
angular.module('udbApp')
    .service('UdbApi', function UdbApi($q, $http, appConfig, $cookieStore, $location, $window) {
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
            withCredentials: true
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

    /**
     * Log the active user out.
     */
    this.logout = function () {
      var logoutUrl = appConfig.baseUrl + 'logout',
          request = $http.get(logoutUrl);

      $cookieStore.remove('user');

      return request;
    };

    this.login = function () {
      var currentLocation = $location.absUrl(),
        authUrl = appConfig.authUrl;

      authUrl += '?destination=' + currentLocation;
      $window.location.href = authUrl;
    };

    /**
     * @returns {Promise} A promise with the credentials of the currently logged in user.
     */
      this.getMe = function () {
        var deferredUser = $q.defer(),
            user = {
              id: '247d4bc0-83c2-47c6-ae28-b4e733827956',
              nick: 'bramcordie',
              fullName: 'Bram Cordie'
            };

        var storedUser = $cookieStore.get('user');

        if(storedUser) {
          console.log('retrieving user info from cookie');
          deferredUser.resolve(storedUser);
        } else {
          console.log('logging in the user');
          $cookieStore.put('user', user);
          this.login();
          deferredUser.resolve(user);
        }

        return deferredUser.promise;
      };
    });
