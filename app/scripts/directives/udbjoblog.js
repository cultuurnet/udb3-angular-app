'use strict';

/**
 * @ngdoc directive
 * @name udbApp.directive:udbJobLog
 * @description
 * # udbJobLog
 */
angular.module('udbApp')
  .directive('udbJobLog', function (jobLogger) {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        scope.jobs = jobLogger.getJobs();
      }
    };
  });
