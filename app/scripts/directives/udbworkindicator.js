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

        element.click(function(){
          jobLogger.createJob(_.uniqueId('job_'), [
            { id: 'some id I made up'},
            { id: 'and another one'}
          ]);
        });

        $window.setInterval(function () {
          scope.working = jobLogger.hasUnfinishedJobs();
          element.toggleClass('working', scope.working);
        }, 2000);
      }
    };
  });
