'use strict';

/**
 * @ngdoc service
 * @name udbApp.udbHttpInterceptor
 * @description
 * # udbHttpInterceptor
 * Factory in the udbApp.
 */
angular
  .module('udbApp')
  .factory('udbHttpInterceptor', httpInterceptor);

/* @ngInject */
function httpInterceptor($q, $location, $window, appConfig, $translate) {
  var language = $translate.use();

  var login = function () {
    var currentLocation = $location.absUrl(),
      authUrl = appConfig.authUrl + 'connect';

    authUrl += '?destination=' + currentLocation + '&lang=' + language;
    $window.location.href = authUrl;
  };

  return {
    'responseError': function (rejection) {
      var currentPath = $location.path();
      if (currentPath === '/' || currentPath === '/about') {
        return $q.reject(rejection);
      }

      if (rejection.status === 403 && (rejection.data && rejection.data.title === 'Label not allowed')) {
        return $q.reject(rejection);
      }

      // Check if the request got rejected because of authorization and redirect
      if (rejection.status === 401) {
        login();
      }

      // Maybe the user is
      if (rejection.status === 403) {
        login();
      }

      return $q.reject(rejection);
    }
  };
}
httpInterceptor.$inject = ['$q', '$location', '$window', 'appConfig', '$translate'];
