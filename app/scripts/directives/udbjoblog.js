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

        scope.hasJobs = function () {
          return !!_.size(scope.jobs);
        };

        scope.giveJobBarType = function (job) {
          var barType = 'info',
            failedTags = _.filter(job.events, function (event) {
              return typeof event.tagged !== 'undefined' && event.tagged === false;
            });

          if(failedTags.length) {
            barType = 'warning';
            job.warning = failedTags.length + ' mislukt';
          } else if(job.progress === 100) {
            barType = 'success';
          }

          return barType;
        };
      }
    };
  });
