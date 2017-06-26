'use strict';

angular
  .module('udbApp')
  .component('udbNewsletter', {
    templateUrl: 'views/newsletter.html',
    controller: 'NewsLetterController',
    controllerAs: 'vm'
  });
