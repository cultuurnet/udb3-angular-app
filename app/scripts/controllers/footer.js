'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:splitViewController
 * @description
 * # splitViewController
 * udbApp controller
 */
angular
  .module('udbApp')
  .controller('footerController', footerController);

/* @ngInject */
function footerController(ZendeskWidget) {
  var footer = this; // jshint ignore:line

  footer.activateZendeskWidget = function () {
    ZendeskWidget.activate({hideOnClose:true});
  };
}
footerController.$inject = ['ZendeskWidget'];