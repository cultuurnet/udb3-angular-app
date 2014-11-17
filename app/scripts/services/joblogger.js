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
    var queue = [];

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

    function touchJobEvent (job, eventId) {
      var event = job.events[eventId];

      if (!event) {
        event = job.events[eventId] = {
          id: eventId
        };
      }

      return event;
    }

    function eventWasTagged (data) {
      var jobId = data['job_id'],
          eventId = data['event_id'],
          job = jobs[jobId],
          event;

      if(job) {
        event = touchJobEvent(job, eventId);
        event.tagged = true;
        updateProgress(job);
      }

      console.log('Tagged event: ' + event.id + '. ' + job.taggedCount + ' of ' + job.eventCount + ' events tagged so far.');
    }

    function eventWasNotTagged (data) {
      var jobId = data['job_id'],
          eventId = data['event_id'],
          job = jobs[jobId],
          event;

      if (job) {
        event = touchJobEvent(job, eventId);
        event.tagged = false;
        updateProgress(job);
      }
      console.log('Tagging event failed: ' + eventId + '. Error message: ' + data.error);
    }

    function updateProgress(job) {
      ++job.taggedCount;
      job.progress =  (job.taggedCount / job.eventCount) * 100;
    }

    udbSocket.on('event_was_tagged', eventWasTagged);
    udbSocket.on('event_was_not_tagged', eventWasNotTagged);
    udbSocket.on('job_started', jobStarted);
    udbSocket.on('job_finished', jobFinished);

    this.getJobs = function () {
      return queue;
    };

    this.hasUnfinishedJobs = function () {
      var unfinishedJob = _.find(jobs, function (job) {
        return job.state !== 'finished';
      });

      return !!unfinishedJob;
    };

    this.createJob = function (jobId, events, keyword) {
      if(jobs[jobId]) {
        throw 'There\'s an existing job with this id';
      }

      var job = jobs[jobId] = {
        id: jobId,
        events: {},
        state: 'created',
        taggedCount: 0,
        progress: 0
      };

      // Check if the events parameter is an array or number and set the event count accordingly
      var eventCount = 0;
      // If it's an array add the events and count them
      if(events instanceof Array) {
        eventCount = events.length || 1;
        _.each(events, function (event) {
          job.events[event.id] = event;
        });
        // If it's a number use the number as count
      } else if (typeof events === 'number'){
        eventCount = events || 1;
      }
      // set the actual event count and a readable description
      job.eventCount = eventCount;
      job.description = 'Tag ' + eventCount+ ' evenementen met label ' + keyword;

      queue.push(job);

      console.log('job with id: ' + job.id + ' created');
    };

  }]);
