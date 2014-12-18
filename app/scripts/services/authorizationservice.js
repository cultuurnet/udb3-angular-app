'use strict';

/**
 * @ngdoc service
 * @name udbApp.authorizationService
 * @description
 * # authorizationService
 * Service in the udbApp.
 */
angular.module('udbApp')
  .service('authorizationService', function ($q, $rootScope, uitidAuth, udbApi) {
    this.isLoggedIn = function () {
      var deferred = $q.defer();

      var deferredUser = udbApi.getMe();
      deferredUser.then(
        function (user) {
          deferred.resolve();
        },
        function () {
          uitidAuth.login();

          // We are redirecting away from the current page, so no need to
          // resolve or reject the deferred.
        }
      );

      return deferred.promise;
    };
  });
