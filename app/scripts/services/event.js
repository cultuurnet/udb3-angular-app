'use strict';

/**
 * @ngdoc service
 * @name udbApp.UdbEvent
 * @description
 * # UdbEvent
 * UdbEvent factory
 */
angular.module('udbApp')
  .factory('UdbEvent', function () {
    /**
     * @class UdbEvent
     * @constructor
     * @param jsonEvent
     */
    var UdbEvent = function (jsonEvent) {
      this.parseJson(jsonEvent);
    };

    UdbEvent.prototype = {
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
        this.organiser = {
          name: jsonEvent.organiser.name,
          email: jsonEvent.organiser.email[0] || '-',
          phone: jsonEvent.organiser.phone[0] || '-'
        };
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

    return (UdbEvent);
  });
