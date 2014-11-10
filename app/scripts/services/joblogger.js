'use strict';

/* jshint sub: true */

/**
 * @ngdoc service
 * @name udbApp.jobLogger
 * @description
 * # jobLogger
 * Service in the udbApp.
 */
angular.module('udbApp')
  .service('jobLogger', ['udbSocket', function jobLogger(udbSocket, udbApi) {
    var jobs = {};

    function jobStarted (data) {
      var job = jobs[data['job_id']] = {
        id: data['job_id'],
        events: {},
        state: 'started'
      };

      console.log('job with id: ' + job.id + ' started');
    }

    function jobFinished (data) {
      var job = jobs[data['job_id']];

      job.state = 'finished';

      console.log('job with id: ' + job.id + ' finished');
    }

    function eventWasTagged (data) {
      var jobId = data['job_id'],
          eventId = data['event_id'],
          job = jobs[jobId],
          event;

      if(job) {
        event = job.events[eventId];
        if(!event) {
          event = job.events[eventId] = {
            id: eventId
          };
        }

        event.tagged = true;
      }

      console.log('Tagged event: ' + event.id + '. ' + _.size(job.events) + ' events tagged so far.');
    }

    udbSocket.on('event_was_tagged', eventWasTagged);
    udbSocket.on('job_started', jobStarted);
    udbSocket.on('job_finished', jobFinished);

    this.getJobs = function () {
      return jobs;
    };

  }]);
