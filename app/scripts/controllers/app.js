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
function AppController($scope, appConfig, $window) {
  $scope.showJobLog = false;

  // Load Google Tag Manager only when the key is not empty
  if(appConfig.gaTagManager) {
    angular.element(document).ready(function () {
      (function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l !== 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
      })($window, document, 'script', 'tm', appConfig.gaTagManager);
    });
  }

  function toggleJobLog() {
    $scope.showJobLog = !$scope.showJobLog;
  }

  $scope.toggleJobLog = toggleJobLog;
}
AppController.$inject = ['$scope', 'appConfig', '$window'];
