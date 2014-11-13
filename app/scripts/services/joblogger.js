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
      var job = jobs[data['job_id']];

      job.state = 'started';

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
        ++job.taggedCount;
        job.progress =  (job.taggedCount / job.eventCount) * 100;
      }

      console.log('Tagged event: ' + event.id + '. ' + job.taggedCount + ' of ' + job.eventCount + ' events tagged so far.');
    }

    udbSocket.on('event_was_tagged', eventWasTagged);
    udbSocket.on('job_started', jobStarted);
    udbSocket.on('job_finished', jobFinished);

    this.getJobs = function () {
      return jobs;
    };

    this.hasUnfinishedJobs = function () {
      var unfinishedJob = _.find(jobs, function (job) {
        return job.state !== 'finished';
      });

      return !!unfinishedJob;
    };

    this.createJob = function (jobId, events, keyword) {
      if(jobs[jobId]) {
        throw 'There\'s an exisiting job with this id';
      }

      var job = jobs[jobId] = {
        id: jobId,
        events: {},
        description: 'Tagging ' + events.length + ' events with keyword ' + keyword,
        state: 'created',
        eventCount: events.length || 1,
        taggedCount: 0,
        progress: 0
      };

      _.each(events, function (event) {
        job.events[event.id] = event;
      });

      console.log('job with id: ' + job.id + ' created');
    };

  }]);
