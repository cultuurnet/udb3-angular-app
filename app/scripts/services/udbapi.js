'use strict';

/**
 * @ngdoc service
 * @name udbApp.UdbApi
 * @description
 * # UdbApi
 * Service in the udbApp.
 */
angular.module('udbApp')
  .service('UdbApi', function UdbApi($q) {
    /**
     * @param {string} queryString - The query used to find events.
     */
    this.findEvents = function (queryString) {
      var deferredEvents = $q.defer(),
          events = [],
          exampleEvent = {
            'title': queryString,
            'calendarSummary' : 'someday',
            'shortDescription': 'This is a short description',
            'image' : 'http://placehold.it/300x200',
            'location': ' De Hoorn'
          };

      if(queryString.length) {
        _.times(9000, function (n) {
          var event = _.clone(exampleEvent);
          event.title = event.title + ' ' + (n+1);
          events.push(event);
        });

        window.setTimeout(function () {
          deferredEvents.resolve(events);
        }, 300);
      } else {
        deferredEvents.resolve(events);
      }


      return deferredEvents.promise;
    };
  });
