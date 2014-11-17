'use strict';

/**
 * @ngdoc service
 * @name udbApp.EventTagger
 * @description
 * # EventTagger
 * Service in the udbApp.
 */
angular.module('udbApp')
  .service('eventTagger', function EventTagger(jobLogger, UdbApi) {

    /**
     * @param {string[]} eventIds
     * @param {string} label
     */
    this.tagEventsById = function (eventIds, label) {
      var jobPromise = UdbApi.tagEvents(eventIds, label);

      jobPromise.success(function (jobData) {
        var jobId = jobData.commandId;
        jobLogger.createJob(jobId, _.map(eventIds, function(id) {
          return { 'id': id };
        }), label);
      });
    };

    /**
     *
     * @param {string} query
     * @param {string} label
     */
    this.tagQuery = function (query, label, eventCount) {
      var jobPromise = UdbApi.tagQuery(query, label);
      eventCount = eventCount || 0;

      jobPromise.success(function (jobData) {
        var jobId = jobData.commandId;
        jobLogger.createJob(jobId, eventCount, label);
      });

    };
  });
