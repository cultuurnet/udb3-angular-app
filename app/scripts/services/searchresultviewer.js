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
      this.loading = false;
    };

    SearchResultViewer.prototype = {
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
      setResults: function (pagedResults) {
        var viewer = this;

        viewer.pageSize = pagedResults.itemsPerPage || 30;
        viewer.events = pagedResults.member || [];
        viewer.totalItems = pagedResults.totalItems || 0;

        viewer.loading = false;
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

    return (SearchResultViewer);
  });
