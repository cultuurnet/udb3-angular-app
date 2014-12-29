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

      $translateProvider
        .translations('nl', {
          'EN_ADJECTIVE': 'Engelse',
          'FR_ADJECTIVE': 'Franse',
          'DE_ADJECTIVE': 'Duitse',
          'NL_ADJECTIVE': 'Nederlandse',
          'TYPE' : 'type',
          'CDBID' : 'cdbid',
          'TITLE' : 'titel',
          'KEYWORDS' : 'label',
          'ORGANISER_KEYWORDS': 'organiser-tag',
          'CITY' : 'gemeente',
          'ZIPCODE' : 'postcode',
          'COUNTRY' : 'land',
          'PHYSICAL_GIS' : 'geo',
          'CATEGORY_NAME' : 'categorie',
          'AGEFROM' : 'leeftijd-vanaf',
          'DETAIL_LANG' : 'vertaling',
          'PRICE' : 'prijs',
          'STARTDATE' : 'start-datum',
          'ENDDATE' : 'eind-datum',
          'ORGANISER_LABEL' : 'organisatie',
          'LOCATION_LABEL' : 'locatie',
          'EXTERNALID' : 'externalid',
          'LASTUPDATED' : 'laatst-aangepast',
          'LASTUPDATEDBY' : 'laatst-aangepast-door',
          'CREATIONDATE' : 'gecreeerd',
          'CREATEDBY' : 'gecreeerd-door',
          'PERMANENT' : 'permanent',
          'DATETYPE' : 'wanneer',
          'CATEGORY_EVENTTYPE_NAME' : 'event-type',
          'CATEGORY_THEME_NAME' : 'thema',
          'CATEGORY_FACILITY_NAME' : 'voorziening',
          'CATEGORY_TARGETAUDIENCE_NAME' : 'doelgroep',
          'CATEGORY_FLANDERSREGION_NAME' : 'regio',
          'CATEGORY_PUBLICSCOPE_NAME' : 'publieksbereik',
          'LIKE_COUNT' : 'aantal-likes',
          'RECOMMEND_COUNT' : 'keren-aanbevolen',
          'ATTEND_COUNT' : 'aantal-ik-ga',
          'COMMENT_COUNT' : 'aantal-commentaar',
          'PRIVATE' : 'prive',
          'AVAILABLEFROM' : 'datum-beschikbaar'
        })
        .preferredLanguage('nl');

      uiSelectConfig.theme = 'bootstrap';
    }])
  .run(function (udbApi, jobLogger, editableOptions) {
    udbApi.getMe();
    editableOptions.theme = 'bs3';
  });
