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
    $scope.events = [];

    var SearchResultViewer = function (pageSize) {
      this.pageSize = pageSize || 50;
      this.totalItems = 0;
      this.currentPage = 1;
      this.grouped = false;
      this.startIndex = 0;
      this.endIndex = 0;
    };

    SearchResultViewer.prototype.setPage = function (index) {
      this.currentPage = index;
    };

    SearchResultViewer.prototype.updateEvents = function (events) {
      this.totalItems = events.length;
      this.currentPage = 1;
      this.pageChanged();
    };

    SearchResultViewer.prototype.pageChanged = function () {
      this.updatePageRange();
    };

    SearchResultViewer.prototype.updatePageRange = function () {
      this.startIndex = (this.currentPage - 1) * this.pageSize;
      this.endIndex = this.startIndex + this.pageSize;
      if(this.endIndex > this.totalItems) {
        this.endIndex = this.totalItems;
      }
    };

    $scope.resultViewer = new SearchResultViewer();

    $scope.$watch('searchQuery', function (query) {
      $scope.events = UdbApi.findEvent(query);
    });

    $scope.$watch('events', function (events) {
      $scope.resultViewer.updateEvents(events);
    });

  });
