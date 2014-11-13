'use strict';

/**
 * @ngdoc directive
 * @name udbApp.directive:udbWorkIndicator
 * @description
 * # udbWorkIndicator
 */
angular.module('udbApp')
  .directive('udbWorkIndicator', function ($window, jobLogger) {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        scope.working = false;
        element.text('Q');

        $window.setInterval(function () {
          scope.working = jobLogger.hasUnfinishedJobs();
          element.toggleClass('working', scope.working);
        }, 2000);
      }
    };
  });
