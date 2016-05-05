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
    'udb.router',
    'udbApp.ga-tag-manager',
    'peg',
    'config',
    'btford.socket-io',
    'btford.markdown',
    'pascalprecht.translate'
  ])
  .config(udbAppConfig)
  /* @ngInject */
  .run([
    'udbApi',
    'amMoment',
    '$rootScope',
    '$location',
    function (udbApi, amMoment, $rootScope, $location) {
      udbApi.getMe();
      amMoment.changeLocale('nl');

      $rootScope.$on('searchSubmitted', function () {
        $location.path('/search');
      });
  }]);

/* @ngInject */
function udbAppConfig(
  $routeProvider,
  $locationProvider,
  $httpProvider,
  $sceDelegateProvider,
  $translateProvider,
  uiSelectConfig,
  appConfig,
  queryFieldTranslations,
  dutchTranslations,
  $rootScope,
  searchHelper,
  $location
) {

  locateOfferByIdParam.$inject = ['$route', 'offerLocator'];
  function locateOfferByIdParam($route, offerLocator){
    return offerLocator.get($route.current.params.id);
  }

  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: { /* @ngInject */
        redirect: ['authorizationService', function (authorizationService) {
          return authorizationService.redirectIfLoggedIn('/dashboard');
        }]
      }
    })
    .when('/about', {
      templateUrl: 'views/about.html',
      controller: 'AboutCtrl'
    })
    .when('/dashboard', {
      templateUrl: 'templates/dashboard.html',
      controller: 'DashboardController',
      controllerAs: 'dash',
      resolve: { /* @ngInject */
        permission: ['authorizationService', function (authorizationService) {
          return authorizationService.isLoggedIn();
        }]
      }
    })
    .when('/search', {
      templateUrl: 'templates/search.html',
      controller: 'Search',
      reloadOnSearch: false,
      resolve: { /* @ngInject */
        permission: ['authorizationService', function (authorizationService) {
          return authorizationService.isLoggedIn();
        }]
      }
    })
    .when('/event/:id', {
      templateUrl: 'templates/event-detail.html',
      controller: 'EventDetailController',
      resolve: {
        eventId: locateOfferByIdParam,
        permission: /* @ngInject */ ['authorizationService', function (authorizationService) {
          return authorizationService.isLoggedIn();
        }]
      }
    })
    .when('/place/:id', {
      templateUrl: 'templates/place-detail.html',
      controller: 'PlaceDetailController',
      resolve: {
        placeId: locateOfferByIdParam,
        permission: /* @ngInject */ ['authorizationService', function (authorizationService) {
          return authorizationService.isLoggedIn();
        }]
      }
    })
    .when('/place/:id/edit', {
      templateUrl: 'templates/event-form.html',
      controller: 'EventFormController',
      resolve: {
        placeId: locateOfferByIdParam,
        eventId: function () { return null; },
        offerType: function() { return 'place'; }
      },
      excludeFooter: true
    })
    .when('/saved-searches', {
      templateUrl: 'templates/saved-searches-list.html',
      controller: 'SavedSearchesListController',
      resolve: {
        permission: /* @ngInject */ ['authorizationService', function (authorizationService) {
          return authorizationService.isLoggedIn();
        }]
      }
    })
    .when('/event', {
      templateUrl: 'templates/event-form.html',
      controller: 'EventFormController',
      resolve: {
        eventId: function () { return null; },
        placeId: function () { return null; },
        offerType: function() { return 'event'; }
      },
      excludeFooter: true
    })
    .when('/event/:id/edit', {
      templateUrl: 'templates/event-form.html',
      controller: 'EventFormController',
      resolve: {
        eventId: locateOfferByIdParam,
        placeId: function () { return null; },
        offerType: function() { return 'event'; }
      },
      excludeFooter: true
    })
    .when('/copyright', {
      template: '<div btf-markdown ng-include="\'docs/copyright.md\'"></div>'
    })
    .when('/user-agreement', {
      template: '<div btf-markdown ng-include="\'docs/user-agreement.md\'"></div>'
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
udbAppConfig.$inject = [
  '$routeProvider',
  '$locationProvider',
  '$httpProvider',
  '$sceDelegateProvider',
  '$translateProvider',
  'uiSelectConfig',
  'appConfig',
  'queryFieldTranslations',
  'dutchTranslations'
];
