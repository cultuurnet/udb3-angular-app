'use strict';

/**
 * @ngdoc directive
 * @name udbApp.directive:udbQueryEditorDaterangepicker
 * @description
 * # udbQueryEditorDaterangepicker
 */
angular.module('udbApp')
  .directive('udbQueryEditorDaterangepicker', function () {
    return {
      templateUrl: 'views/query-editor-daterangepicker.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var dateRangePicker = {
          startOpened: false,
          endOpened: false,
          dateFormat: 'yyyy-MM-dd'
        };

        dateRangePicker.openStart = function ($event) {
          $event.preventDefault();
          $event.stopPropagation();

          dateRangePicker.startOpened = true;
          dateRangePicker.endOpened = false;
        };

        dateRangePicker.openEnd = function ($event) {
          $event.preventDefault();
          $event.stopPropagation();

          dateRangePicker.startOpened = false;
          dateRangePicker.endOpened = true;
        };

        scope.drp = dateRangePicker;
      }
    };
  });
