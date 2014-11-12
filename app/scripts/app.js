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
    'btford.socket-io'
  ])
  .config([
    '$routeProvider',
    '$locationProvider',
    '$httpProvider',
    'uiSelectConfig',
    function ($routeProvider, $locationProvider, $httpProvider, uiSelectConfig) {

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
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/'
      });

		$locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('udbHttpInterceptor');
      
    uiSelectConfig.theme = 'bootstrap';
    }])
  .run(function (UdbApi, jobLogger) {
    UdbApi.getMe();
  });
