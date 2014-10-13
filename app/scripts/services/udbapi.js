'use strict';

/**
 * @ngdoc service
 * @name udbAppApp.UdbApi
 * @description
 * # UdbApi
 * Service in the udbAppApp.
 */
angular.module('udbApp')
  .service('UdbApi', function UdbApi() {
    /**
     * @param {string} queryString - The query used to find events.
     */
    this.findEvent = function (queryString) {
      var events = [],
          exampleEvent = {
            'title': queryString,
            'calendarSummary' : 'someday',
            'shortDescription': 'This is a short description',
            'image' : 'http://lorempixel.com/300/300/',
            'location': ' De Hoorn'
          };

      if(queryString.length) {
          _.times(9000, function (n) {
            var event = _.clone(exampleEvent);
            event.title = event.title + ' ' + (n+1);
            events.push(event);
          });
      }

      return events;
    };
  });
