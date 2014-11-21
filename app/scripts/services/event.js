'use strict';

/**
 * @ngdoc service
 * @name udbApp.Event
 * @description
 * # Event
 * Factory in the udbApp.
 */
angular.module('udbApp')
  .factory('Event', function () {
    /**
     * @class Event
     * @constructor
     * @param jsonEvent
     */
    var Event = function (jsonEvent) {
      this.parseJson(jsonEvent);
    };

    Event.prototype = {
      parseJson: function (jsonEvent) {
        this.id = jsonEvent['@id'].split('/').pop();
        this.name = jsonEvent.name || {};
        this.description = jsonEvent.description || {};
        this.calendarSummary = jsonEvent.calendarSummary;
        this.location = jsonEvent.location;
        this.image = jsonEvent.image;
        this.labels = _.map(jsonEvent.concept, function(label) {
          return label;
        });
      },
      /**
       * Tag the event with a label or a list of labels
       * @param {string|string[]} label
       */
      tag: function (label) {
        var labels = [];

        if(_.isArray(label)) {
          labels = label;
        }

        if(_.isString(label)) {
          labels = [label];
        }

        this.labels = _.union(this.labels, labels);
      },
      /**
       * Untag a label from an event
       * @param {string} labelName
       */
      untag: function(labelName) {
        _.remove(event.labels, function (label) {
          return label === labelName;
        });
      }
    };

    return (Event);
  });
