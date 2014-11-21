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
     * @param {Event}  event        The event that needs translating
     * @param {string} property     The name of the property to translate
     * @param {string} language     The abbreviation of the translation language
     * @param {string} translation  Translation to save
     */
    this.translateProperty = function (event, property, language, translation) {
      var jobPromise = UdbApi.translateEventProperty(event.id, property, language, translation);

      jobPromise.success(function (jobData) {
        var jobId = jobData.commandId;
        // TODO get rid of this hack;
        if(property === 'title') { property = 'name'; }
        event[property][language] = translation;
        jobLogger.createTranslationJob(
          jobId,
          'Vertaal ' + property + ' van evenement "' + event.name.nl + '".',
          event);
      });

      return jobPromise;
    };
  });
