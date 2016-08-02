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
    var queryParameters = $location.search();
    var jwt = queryParameters.jwt;

    if (jwt && jwt !== uitidAuth.getToken()) {
      uitidAuth.setToken(jwt);
      $location.search('jwt', null);
    }
  }

  controller.$onInit = parseJwtToken;
}
AppController.$inject = ['$location', 'uitidAuth'];
