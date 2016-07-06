'use strict';

angular
  .module('udbApp')
  .component('udbSidebar', {
    controller: 'sideBarController',
    controllerAs: 'sbc',
    templateUrl: 'views/side-bar.html'
  });
