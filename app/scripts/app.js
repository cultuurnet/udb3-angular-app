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
    'config'
  ])
  .config(function ($routeProvider, $locationProvider, $httpProvider, uiSelectConfig) {
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
  })
  .run(function (UdbApi) {
    UdbApi.getMe();
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
    this.pageSize = pageSize || 30;
    this.events = [];
    this.totalItems = 0;
    this.currentPage = 1;
    this.grouped = false;
    this.startIndex = 0;
    this.endIndex = 0;
    this.loading = false;
    this.selectedIds = [];
  };

  searchResultViewer.prototype = {
    setPage: function (index) {
      this.currentPage = index;
    },
    toggleSelectId: function (id) {
      var selectedIds = this.selectedIds,
          isSelected = _.contains(selectedIds, id);

      if(isSelected) {
        _.remove(selectedIds, function(iid) { return id === iid; });
      } else {
        selectedIds.push(id);
      }
    },
    deselectAll: function () {
      this.selectedIds = [];
    },
    selectAll: function () {
      var events = this.events,
          selectedIds = this.selectedIds;

      _.each(events, function (event) {
        selectedIds.push(event['@id']);
      });

      this.selectedIds = _.uniq(selectedIds);
    },
    isIdSelected: function (id) {
      return _.contains(this.selectedIds, id);
    },
    updateEvents: function (pagedResults) {
      var viewer = this;

      viewer.pageSize = pagedResults.itemsPerPage || 30;
      viewer.events = pagedResults.member || [];
      viewer.totalItems = pagedResults.totalItems || 0;

      viewer.pageChanged();
      viewer.loading = false;
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

      this.currentPage = 1;
      this.selectedIds = [];
    }
  };

  return searchResultViewer;

}());
