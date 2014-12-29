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
    'xeditable',
    'pascalprecht.translate'
  ])
  .config([
    '$routeProvider',
    '$locationProvider',
    '$httpProvider',
    '$sceDelegateProvider',
    '$translateProvider',
    'uiSelectConfig',
    'appConfig',
    function (
      $routeProvider,
      $locationProvider,
      $httpProvider,
      $sceDelegateProvider,
      $translateProvider,
      uiSelectConfig,
      appConfig
    ) {
      $routeProvider
        .when('/', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl',
          resolve: {
            redirect: function (authorizationService) {
              return authorizationService.redirectIfLoggedIn('/search');
            }
          }
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
            permission: function (authorizationService) {
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

      $translateProvider
        .translations('nl', {
          EN_ADJECTIVE: 'Engelse',
          FR_ADJECTIVE: 'Franse',
          DE_ADJECTIVE: 'Duitse',
          NL_ADJECTIVE: 'Nederlandse'
        })
        .preferredLanguage('nl');

      uiSelectConfig.theme = 'bootstrap';
    }])
  .run(function (udbApi, jobLogger, editableOptions) {
    udbApi.getMe();
    editableOptions.theme = 'bs3';
  });
