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
    'queryFieldTranslations',
    function (
      $routeProvider,
      $locationProvider,
      $httpProvider,
      $sceDelegateProvider,
      $translateProvider,
      uiSelectConfig,
      appConfig,
      queryFieldTranslations
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

      // Translation configuration
      var dutchTranslations = {
        'EN_ADJECTIVE': 'Engelse',
        'FR_ADJECTIVE': 'Franse',
        'DE_ADJECTIVE': 'Duitse',
        'NL_ADJECTIVE': 'Nederlandse',
        'datepicker': {
          'CURRENT': 'Vandaag',
          'CLEAR': 'Verwijder',
          'CLOSE': 'Sluiten'
        },
        '=': 'is',
        '+': 'bevat',
        '!': 'is niet',
        '-': 'bevat niet',
        '>': 'is groter dan',
        '<': 'is kleiner dan',
        '>_DATE': 'is vroeger dan',
        '<_DATE': 'is later dan',
        '=_DATE': 'is'
      };
      dutchTranslations = _.merge(dutchTranslations, queryFieldTranslations.nl);

      $translateProvider
        .translations('nl', dutchTranslations)
        .preferredLanguage('nl');
      // end of translation configuration

      uiSelectConfig.theme = 'bootstrap';
    }])
  .run(function (udbApi, jobLogger, editableOptions) {
    udbApi.getMe();
    editableOptions.theme = 'bs3';
  });
