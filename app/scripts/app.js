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
          if(toState.name === 'main') {
          // redirect to welcome page when arriving on main page when logged in
            if(!authorizationService.redirectIfLoggedIn('/dashboard')) {
              event.preventDefault();
              return false;
            }
          }
          // secure all pages except home
          else if(!authorizationService.isLoggedIn()) {
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
      templateUrl: 'views/search.html'
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
    .state('useragreement', {
      url: '/user-agreement',
      template: '<div btf-markdown ng-include="\'docs/user-agreement.md\'"></div>'
    })
    .state('copyright', {
      url: '/copyright',
      template: '<div btf-markdown ng-include="\'docs/copyright.md\'"></div>'
    })
    .state('split.savedsearches', {
      url: '/saved-searches',
      templateUrl: 'templates/saved-searches-list.html',
      controller: 'SavedSearchesListController',
    })
    // Manage stuff
    // Labels
    .state('split.manageLabels', {
      url: '/manage/labels/overview',
      controller: 'LabelsListController',
      controllerAs: 'llc',
      templateUrl: 'templates/labels-list.html'
    })
    .state('split.manageLabelsCreate', {
      url: '/manage/labels/create',
      templateUrl: 'templates/label-creator.html',
      controller: 'LabelCreatorController',
      controllerAs: 'creator'
    })
    .state('split.manageLabelsEdit', {
      url: '/manage/labels/:id',
      templateUrl: 'templates/label-editor.html',
      controller: 'LabelEditorController',
      controllerAs: 'editor'
    })

    // Roles
    .state('split.manageRoles', {
      url: '/manage/roles/overview',
      controller: 'RolesListController',
      controllerAs: 'rlc',
      templateUrl: 'templates/roles-list.html'
    })

    // Users
    .state('split.manageUsers', {})

    // Organisations
    .state('split.manageOrganisations', {});
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
