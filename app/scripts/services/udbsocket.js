'use strict';

/**
 * @ngdoc service
 * @name udbApp.udbSocket
 * @description
 * # udbSocket
 * Factory in the udbApp.
 */
angular.module('udbApp')
  .factory('udbSocket', ['socketFactory', 'appConfig', function (socketFactory, appConfig) {
    var udbSocket = io.connect(appConfig.socketUrl);

    var socket = socketFactory({
      ioSocket: udbSocket
    });

    return socket;
  }]);
