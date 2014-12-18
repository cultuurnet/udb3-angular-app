'use strict';

/**
 * @ngdoc overview
 * @name udbApp
 * @description
 * # udbApp
 *
 * Main module of the application.
 */
angular
  .module('udbApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.select',
    'peg',
    'config',
    'btford.socket-io',
    'xeditable'
  ])
    .factory('authorizationService', function ($q, $rootScope, uitidAuth, udbApi) {
      return {
        isLoggedIn: function () {
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
        }
      };
    })
  .config([
    '$routeProvider',
    '$locationProvider',
    '$httpProvider',
    '$sceDelegateProvider',
    'uiSelectConfig',
    'appConfig',
    function (
      $routeProvider,
      $locationProvider,
      $httpProvider,
      $sceDelegateProvider,
      uiSelectConfig,
      appConfig
    ) {

      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .when('/about', {
          templateUrl: 'views/about.html',
          controller: 'AboutCtrl'
        })
        .when('/search', {
          templateUrl: 'views/search.html',
          controller: 'SearchCtrl',
          reloadOnSearch: false,
          resolve: {
            permission: function (authorizationService, $route) {
              return authorizationService.isLoggedIn();
            }
          }
        })
        .otherwise({
          redirectTo: '/'
        });

      $locationProvider.html5Mode(true);

      $httpProvider.interceptors.push('udbHttpInterceptor');

      $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        appConfig.baseUrl + '**'
      ]);

      uiSelectConfig.theme = 'bootstrap';
    }])
  .run(function (udbApi, jobLogger, editableOptions) {
    udbApi.getMe();
    editableOptions.theme = 'bs3';
  });
