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

    var eventTagger = this;

    // keep a cache of all the recently used labels
    eventTagger.recentLabels = ['some', 'recent', 'label'];

    function updateRecentLabels () {
      var labelPromise = UdbApi.getRecentLabels();

      labelPromise.then(function (labels) {
        eventTagger.recentLabels = labels;
      });
    }
    // warm up the cache
    updateRecentLabels();

    /**
     * Tag an event with a label
     * @param {string} eventId
     * @param {string} label
     */
    this.tag = function (eventId, label) {
      var jobPromise = UdbApi.tagEvent(eventId, label);

      jobPromise.success(function (jobData) {
        jobLogger.createTranslationJob(jobData.commandId, 'tag evenement met label: ' + label);
      });
    };

    /**
     * Untag a label from an event
     * @param {string} eventId
     * @param {string} label
     */
    this.untag = function (eventId, label) {
      var jobPromise = UdbApi.untagEvent(eventId, label);

      jobPromise.success(function (jobData) {
        jobLogger.createTranslationJob(jobData.commandId, label + ' verwijderen van evenement');
      });
    };

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
