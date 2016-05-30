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
function AppController($scope, $location, uitidAuth) {
  $scope.showJobLog = false;
  $scope.excludeFooter = false;

  // $scope.$on('$routeChangeSuccess', function(event, current) {
  //   $scope.excludeFooter = current.$$route.excludeFooter;
  // });

  function toggleJobLog() {
    $scope.showJobLog = !$scope.showJobLog;
  }

  this.$onInit = parseJwtToken;

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

      console.log(token);
      if (token !== uitidAuth.getToken()) {
        uitidAuth.setToken(token);
      }
    }
  }

  $scope.toggleJobLog = toggleJobLog;
}
AppController.$inject = ['$scope', '$location', 'uitidAuth'];
