'use strict';

/**
 * @ngdoc service
 * @name udbApp.jobLogger
 * @description
 * # jobLogger
 * Service in the udbApp.
 */
angular.module('udbApp')
  .service('jobLogger', ['udbSocket', function jobLogger(udbSocket) {
    var log = [];

    var logEvent = function (event) {
      log.push(event);
      console.log(event);
    };

    udbSocket.on('event_was_tagged', function (data) {
      data.event = 'event was tagged';
      logEvent(data);
    });

    udbSocket.on('job_started', function (data) {
      data.event = 'job started';
      logEvent(data);
    });

    udbSocket.on('job_finished', function (data) {
      data.event = 'job finished';
      logEvent(data);
    });
  }]);
