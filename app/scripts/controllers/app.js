'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the udbApp
 */
angular
  .module('udbApp')
  .controller('AppCtrl', AppController);

/* @ngInject */
function AppController($location, uitidAuth) {
  var controller = this;

  function parseJwtToken () {
    var url = $location.url();

    var tokenIndex = url.indexOf('jwt=');
    var tokenLength = url.indexOf('&', tokenIndex);

    if (tokenIndex > 0) {
      var token;
      if (tokenLength >= 0) {
        token = url.substring(tokenIndex + 4, tokenLength);
      }
      else {
        token = url.substring(tokenIndex + 4);
      }

      if (token !== uitidAuth.getToken()) {
        uitidAuth.setToken(token);
      }
    }
  }

  controller.$onInit = parseJwtToken;
}
AppController.$inject = ['$location', 'uitidAuth'];
