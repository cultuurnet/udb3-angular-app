'use strict';

/**
 * @ngdoc service
 * @name udbApp.evenTagger
 * @description
 * # eventTagger
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
     * @param {UdbEvent} event
     * @param {string} label
     */
    this.tag = function (event, label) {
      var jobPromise = UdbApi.tagEvent(event.id, label);

      jobPromise.success(function (jobData) {
        event.tag(label);
        jobLogger.createTranslationJob(
          jobData.commandId,
          'Tag "'+ event.name.nl +'" met label: ' + label + '.',
          event);
      });
    };

    /**
     * Untag a label from an event
     * @param {UdbEvent} event
     * @param {string} label
     */
    this.untag = function (event, label) {
      var jobPromise = UdbApi.untagEvent(event.id, label);

      jobPromise.success(function (jobData) {
        event.untag(label);
        jobLogger.createTranslationJob(
          jobData.commandId,
          'Verwijder ' + label + '  van "' + event.name.nl + '".',
          event);
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
