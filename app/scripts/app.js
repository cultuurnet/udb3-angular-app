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
    'ngComponentRouter',
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
  .component('udbApp', {
    controller: 'AppCtrl',
    $routeConfig: [
      {
        path: '/',
        name: 'Main',
        component: 'udbWelcome',
        useAsDefault: true
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: 'dashboardComponent'
      },
      {
        path: '/search',
        name: 'Search',
        component: 'udbSearch'
      },
      {
        path: '/event/:id',
        name: 'EventDetail',
        component: 'eventDetailComponent'
      },
      {
        path: '/copyright',
        name: 'Copyright',
        component: 'udbCopyright'
      },
      {
        path: '/user-agreement',
        name: 'UserAgreement',
        component: 'udbUserAgreement'
      },
      {
        path: '/saved-searches',
        name: 'SavedSearches',
        component: 'udbSavedSearches'
      },
      {
        path: '/event',
        name: 'CreateOffer',
        component: 'offerEditorComponent'
      },
      {
        path: '/event/:id/edit',
        name: 'EditEvent',
        component: 'offerEditorComponent'
      },
      {
        path: '/place/:id/edit',
        name: 'EditPlace',
        component: 'offerEditorComponent'
      }
    ]
  })
  .component('udbWelcome', {
    controller: 'MainCtrl',
    templateUrl: 'views/main.html',
    $canActivate: redirectIfLoggedIn('dashboard')
  })
  .component('udbCopyright', {
    template: '<div btf-markdown ng-include="\'docs/copyright.md\'"></div>'
  })
  .component('udbUserAgreement', {
    template: '<div btf-markdown ng-include="\'docs/user-agreement.md\'"></div>'
  })
  .component('udbSavedSearches', {
    templateUrl: 'templates/saved-searches-list.html',
    controller: 'SavedSearchesListController',
    $canActivate: isAuthorized
  }).component('dashboardComponent', {
    templateUrl: 'templates/dashboard.html',
    controller: 'DashboardController',
    controllerAs: 'dash',
    $canActivate: isAuthorized
  })
  .value('$routerRootComponent', 'udbApp')
  /* @ngInject */
  .run([
    'udbApi',
    'amMoment',
    '$rootScope',
    '$location',
    'uitidAuth',
    function (udbApi, amMoment, $rootScope, $location, uitidAuth) {

      if(uitidAuth.getToken()) {
        udbApi.getMe();
      }
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
  dutchTranslations
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
}
udbAppConfig.$inject = [
  '$locationProvider',
  '$httpProvider',
  '$sceDelegateProvider',
  '$translateProvider',
  'uiSelectConfig',
  'appConfig',
  'queryFieldTranslations',
  'dutchTranslations'
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
