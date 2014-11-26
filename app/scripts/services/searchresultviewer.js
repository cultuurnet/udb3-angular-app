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
     *
     * @property {object[]}   events       - A list of json-LD event objects
     * @property {number}     pageSize     - The current page size
     * @property {number}     totalItems   - The total items found
     * @property {number}     currentPage  - The index of the current page without zeroing
     * @property {boolean}    loading      - A flag to indicate the period between changing of the query and
     *                                       receiving of the results.
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
          var eventId = event['@id'].split('/').pop();
          selectedIds.push(eventId);
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
