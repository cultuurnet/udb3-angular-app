'use strict';

/**
 * @ngdoc directive
 * @name udbApp.directive:udbQueryEditorDaterangepicker
 * @description
 * # udbQueryEditorDaterangepicker
 */
angular.module('udbApp')
  .directive('udbQueryEditorDaterangepicker', function ($translate, datepickerPopupConfig) {
    return {
      templateUrl: 'views/query-editor-daterangepicker.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        var dateRangePicker = {
          startOpened: false,
          endOpened: false,
          dateFormat: 'yyyy-MM-dd'
        };

        $translate(['datepicker.CURRENT', 'datepicker.CLEAR', 'datepicker.CLOSE']).then(function (translations) {
          datepickerPopupConfig.currentText = translations['datepicker.CURRENT'];
          datepickerPopupConfig.clearText = translations['datepicker.CLEAR'];
          datepickerPopupConfig.closeText = translations['datepicker.CLOSE'];
        });

        console.log(dateRangePicker);

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
