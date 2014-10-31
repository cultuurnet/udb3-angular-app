'use strict';

/**
 * @ngdoc service
 * @name udbApp.SearchResultViewer
 * @description
 * # SearchResultViewer
 * Factory in the udbApp.
 */
angular.module('udbApp')
  .factory('SearchResultViewer', function () {

    /**
     * @class SearchResultViewer
     * @constructor
     * @param pagSize
     */
    var SearchResultViewer = function (pageSize) {
      this.pageSize = pageSize || 30;
      this.events = [];
      this.totalItems = 0;
      this.currentPage = 1;
      this.grouped = false;
      this.startIndex = 0;
      this.endIndex = 0;
      this.loading = false;
    };

    SearchResultViewer.prototype = {
      setResults: function (pagedResults) {
        var viewer = this;

        viewer.pageSize = pagedResults.itemsPerPage || 30;
        viewer.events = pagedResults.member || [];
        viewer.totalItems = pagedResults.totalItems || 0;

        viewer.loading = false;
      },
      queryChanged: function (query) {
        if (query.length) {
          this.loading = true;
        } else {
          this.loading = false;
        }

        this.currentPage = 1;
      }
    };

    return (SearchResultViewer);
  });
