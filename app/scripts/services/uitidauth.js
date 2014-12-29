'use strict';

/**
 * @ngdoc service
 * @name udbApp.uitidAuth
 * @description
 * # uitidAuth
 * Service in the udbApp.
 */
angular.module('udbApp')
  .service('uitidAuth', function uitidAuth($window, $location, $http, appConfig, $cookieStore) {

    /**
     * Log the active user out.
     */
    this.logout = function () {
      var logoutUrl = appConfig.baseUrl + 'logout',
          request = $http.get(logoutUrl, {
            withCredentials: true
          });

      request.then(function () {
        $cookieStore.remove('user');
        $location.path('/');
      });

      return request;
    };

    /**
     * Login by redirecting to UiTiD
     */
    this.login = function () {
      var currentLocation = $location.absUrl(),
        authUrl = appConfig.authUrl;

      authUrl += '?destination=' + currentLocation;
      $window.location.href = authUrl;
    };

    /**
     * Returns the currently logged in user
     */
    this.getUser = function () {
      return $cookieStore.get('user');
    };

  });
