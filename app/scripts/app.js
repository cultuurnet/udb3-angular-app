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
    //'ngRoute',
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
  .value('$routerRootComponent', 'udbApp')
  .component('udbApp', {
    template:'<ng-outlet></ng-outlet>',
    $routeConfig: [
      {
        path: '/',
        name: 'Main',
        component: 'udbWelcome'
      },
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: 'udbDashboard'
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
    templateUrl: 'views/main.html'
  })
  .component('udbCopyright', {
    template: '<div btf-markdown ng-include="\'docs/copyright.md\'"></div>'
  })
  .component('udbUserAgreement', {
    template: '<div btf-markdown ng-include="\'docs/user-agreement.md\'"></div>'
  })
  .component('udbSavedSearches', {
    templateUrl: 'templates/saved-searches-list.html',
    controller: 'SavedSearchesListController'
  })
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

      $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl, newState, oldState) {
        var tokenIndex = newUrl.indexOf('jwt=');
        var tokenLength = newUrl.indexOf('&', tokenIndex);

        if(tokenIndex > 0) {
          var token;
          if(tokenLength >= 0) {
            token = newUrl.substring(tokenIndex + 4, tokenLength);
          }
          else {
            token = newUrl.substring(tokenIndex + 4);
          }

          if(token !== uitidAuth.getToken()) {
            uitidAuth.setToken(token);
          }
        }
      });
  }]);

/* @ngInject */
function udbAppConfig(
  //$routeProvider,
  $locationProvider,
  $httpProvider,
  $sceDelegateProvider,
  $translateProvider,
  uiSelectConfig,
  appConfig,
  queryFieldTranslations,
  dutchTranslations
) {

  locateOfferByIdParam.$inject = ['$route', 'offerLocator'];
  function locateOfferByIdParam($route, offerLocator){
    return offerLocator.get($route.current.params.id);
  }

  /*$routeProvider
    .when('/place/:id', {
      templateUrl: 'templates/place-detail.html',
      controller: 'PlaceDetailController',
      resolve: {
        placeId: locateOfferByIdParam,
        permission: /* @ngInject */ /*['authorizationService', function (authorizationService) {
          return authorizationService.isLoggedIn();
        }]
      }
    })
    .otherwise({
      redirectTo: '/'
    });*/

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
  //'$routeProvider',
  '$locationProvider',
  '$httpProvider',
  '$sceDelegateProvider',
  '$translateProvider',
  'uiSelectConfig',
  'appConfig',
  'queryFieldTranslations',
  'dutchTranslations'
];
