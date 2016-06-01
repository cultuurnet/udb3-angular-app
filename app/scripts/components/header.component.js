'use strict';

angular
  .module('udbApp')
  .component('udbHeader', {
    controller: 'HeaderController',
    controllerAs: 'header',
    templateUrl: 'views/header.html'
  });
