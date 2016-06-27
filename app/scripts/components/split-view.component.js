'use strict';

angular
  .module('udbApp')
  .component('splitView', {
    templateUrl: 'views/split-view.html',
    controller: 'splitViewController',
    controllerAs: 'svc',
    $routeConfig: [
      {
        path: '/...',
        name: 'FooterTemplate',
        component: 'footerTemplate'
      }
    ]
  });
