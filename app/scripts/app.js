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
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.select',
    'udb.core',
    'udb.router',
    'udb.management',
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
    'uitidAuth',
    'authorizationService',
    function (udbApi, amMoment, $rootScope, $location, uitidAuth, authorizationService) {

      $rootScope.$on('$stateChangeStart', function (
        event,
        toState,
        toParams,
        fromState,
        fromParams) {
          // redirect to welcome page when arriving on main page when logged in
          if(toState.name === 'main' && !authorizationService.redirectIfLoggedIn('/dashboard')) {
            event.preventDefault();
            return false;
          }
      });

      $rootScope.$watch(function () {
        return uitidAuth.getToken();
      }, function (token) {
        udbApi.getMe();
      });

      amMoment.changeLocale('nl');

      $rootScope.$on('searchSubmitted', function () {
        $location.path('/search');
      });
  }]);

/* @ngInject */
function udbAppConfig(
  $locationProvider,
  $httpProvider,
  $sceDelegateProvider,
  $translateProvider,
  uiSelectConfig,
  appConfig,
  queryFieldTranslations,
  dutchTranslations,
  $stateProvider,
  $urlRouterProvider
) {

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

  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })
    .state('split', {
      templateUrl: 'views/split-view.html',
      controller: 'splitViewController',
      controllerAs: 'svc',
    })
    .state('split.footer', {
      templateUrl: 'views/footer-template.html'
    })
    .state('split.footer.dashboard', {
      url: '/dashboard',
      template: '<udb-dashboard>'
    })
    .state('split.footer.search', {
      url: '/search',
      templateUrl: 'templates/search.html',
      controller: 'Search'
    })
    .state('split.footer.place', {
      url: '/place/:id',
      templateUrl: 'templates/place-detail.html',
      controller: 'placeDetailUIController'
    })
    .state('split.footer.event', {
      url: '/event/:id',
      templateUrl: 'templates/event-detail.html',
      controller: 'eventDetailUIController'
    })
    .state('split.offer', {
      url: '/event',
      controller: 'offerEditorUIController',
      templateUrl: 'templates/event-form.html'
    })
    .state('split.eventEdit', {
      url: '/event/:id/edit',
      controller: 'offerEditorUIController',
      templateUrl: 'templates/event-form.html'
    })
    .state('split.placeEdit', {
      url: '/place/:id/edit',
      controller: 'offerEditorUIController',
      templateUrl: 'templates/event-form.html'
    })
}
udbAppConfig.$inject = [
  '$locationProvider',
  '$httpProvider',
  '$sceDelegateProvider',
  '$translateProvider',
  'uiSelectConfig',
  'appConfig',
  'queryFieldTranslations',
  'dutchTranslations',
  '$stateProvider',
  '$urlRouterProvider'
];

function isAuthorized(authorizationService) {
  return authorizationService.isLoggedIn();
}

function redirectIfLoggedIn(path) {
  function promiseAccess(authorizationService) {
    return authorizationService.redirectIfLoggedIn(path);
  }
  promiseAccess.$inject = ['authorizationService'];

  return promiseAccess;
}

isAuthorized.$inject = ['authorizationService'];
