'use strict';

/**
 * @ngdoc service
 * @name udbApp.EventTranslator
 * @description
 * # EventTranslator
 * Service in the udbApp.
 */
angular.module('udbApp')
  .service('EventTranslator', function EventTranslator(jobLogger, UdbApi) {

    /**
     * Translates an event property to a given language and adds the job to the logger
     *
     * @param {string} eventId      ID of the translated event
     * @param {string} property     The name of the property to translate
     * @param {string} language     The abbreviation of the translation language
     * @param {string} translation  Translation to save
     */
    this.translateProperty = function (eventId, property, language, translation) {
      var jobPromise = UdbApi.translateEventProperty(eventId, property, language, translation);

      jobPromise.success(function (jobData) {
        var jobId = jobData.commandId;
        // TODO: Get the full event from the api to show a more meaningful message?
        jobLogger.createTranslationJob(jobId, 'Vertaal evenement ' + eventId);
      });

      return jobPromise;
    };
  });
