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
        request = $http.get(logoutUrl);

      $cookieStore.remove('user');
      $location.path('/');

      return request;
    };

    /**
     * Login by redirecting to UiTiD
     */
    this.login = function () {
      var currentLocation = $location.absUrl(),
        authUrl = appConfig.authUrl;

      var user = {
        id: '247d4bc0-83c2-47c6-ae28-b4e733827956',
        nick: 'bramcordie',
        fullName: 'Bram Cordie'
      };
      $cookieStore.put('user', user);

      authUrl += '?destination=' + currentLocation;
      $window.location.href = authUrl;
    };

  });
