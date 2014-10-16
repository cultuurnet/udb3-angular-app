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
    'ui.bootstrap'
  ])
  .config(function ($routeProvider, $locationProvider) {
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
        controller: 'SearchCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

		$locationProvider.html5Mode(true);
  });

/**
 * A global object to hold all the udb specific code.
 */
var udb = udb || {};

/**
 * Creates a new Search Result Viewer.
 * @class
 */
udb.SearchResultViewer = (function () {

  /**
   * @constructs SearchResultViewer
   * @param pagSize
   */
  var searchResultViewer = function (pageSize) {
    this.pageSize = pageSize || 50;
    this.events = [];
    this.totalItems = 0;
    this.currentPage = 1;
    this.grouped = false;
    this.startIndex = 0;
    this.endIndex = 0;
    this.loading = false;
  };

  searchResultViewer.prototype = {
    setPage: function (index) {
      this.currentPage = index;
    },
    updateEvents: function (eventPromise) {
      var viewer = this;

      eventPromise.then(function (events) {
        viewer.events = events;
        viewer.totalItems = events.length;
        viewer.currentPage = 1;
        viewer.pageChanged();
        viewer.loading = false;
      }, function (error) {
        window.alert('something went wrong while looking for events');
      });
    },
    pageChanged: function () {
      this.updatePageRange();
    },
    updatePageRange: function () {
      this.startIndex = (this.currentPage - 1) * this.pageSize;
      this.endIndex = this.startIndex + this.pageSize;
      if(this.endIndex > this.totalItems) {
        this.endIndex = this.totalItems;
      }
    },
    queryChanged: function (query) {
      if(query.length) {
        this.loading = true;
      } else {
        this.loading = false;
      }
    }
  };

  return searchResultViewer;

}());
