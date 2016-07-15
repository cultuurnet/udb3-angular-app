'use strict';

angular
  .module('udbApp')
  .component('udbMenubar', {
    controller: 'menuBarController',
    controllerAs: 'mbc',
    templateUrl: 'views/menu-bar.html'
  });
