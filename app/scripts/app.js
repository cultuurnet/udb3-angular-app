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
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.select',
    'udb.core',
    'peg',
    'config',
    'btford.socket-io',
    'pascalprecht.translate'
  ])
  .config(udbAppConfig)
  .run(function (udbApi) {
    udbApi.getMe();
  });

/** @ngInject */
function udbAppConfig($routeProvider, $locationProvider, $httpProvider, $sceDelegateProvider, $translateProvider,
                      uiSelectConfig, appConfig, queryFieldTranslations, dutchTranslations) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: { /* @ngInject */
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
      templateUrl: 'templates/search.html',
      controller: 'Search',
      reloadOnSearch: false,
      resolve: { /* @ngInject */
        permission: function (authorizationService) {
          return authorizationService.isLoggedIn();
        }
      }
    })
    .when('/event/:eventId', {
      templateUrl: 'templates/event-detail.html',
      controller: 'EventDetailController',
      resolve: {
        eventId: /* @ngInject */ ['$route', function ($route) {
          return $route.current.params.eventId;
        }],
        permission: /* @ngInject */ function (authorizationService) {
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
  var defaultTranslations = _.merge(dutchTranslations, queryFieldTranslations.nl);

  $translateProvider
    .translations('nl', defaultTranslations)
    .preferredLanguage('nl');
  // end of translation configuration

  uiSelectConfig.theme = 'bootstrap';
}
