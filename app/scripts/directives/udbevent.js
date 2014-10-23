'use strict';

/**
 * @ngdoc directive
 * @name udbApp.directive:udbEvent
 * @description
 * # udbEvent
 */
angular.module('udbApp')
  .directive('udbEvent', function (UdbApi) {
    return {
      restrict: 'A',
      link: function postLink(scope) {
        if(!scope.event.title) {
          scope.fetching = true;
          var eventPromise = UdbApi.getEventByLDId(scope.event['@id']);

          eventPromise.then(function (event) {
            scope.event = event;
            scope.fetching = false;
          });
        } else {
          scope.fetching = false;
        }
      }
    };
  });
