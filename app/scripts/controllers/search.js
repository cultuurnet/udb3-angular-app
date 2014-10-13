'use strict';

/**
 * @ngdoc function
 * @name udbAppApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the udbAppApp
 */
angular.module('udbApp')
  .controller('SearchCtrl', function ($scope, UdbApi) {
    $scope.searchQuery = '';

    var udb = {};
    udb.SearchResultViewer = (function () {

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

    $scope.resultViewer = new udb.SearchResultViewer();

    var debouncedUpdateEvents = _.debounce(function(eventPromise){
      $scope.resultViewer.updateEvents(eventPromise);
    }, 1000);

    $scope.$watch('searchQuery', function (query) {
      $scope.resultViewer.queryChanged(query);
      debouncedUpdateEvents(UdbApi.findEvents(query));
    });

  });
