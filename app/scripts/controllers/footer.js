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
function footerController(ZendeskWidget, $translate) {
  var footer = this; // jshint ignore:line

  footer.activateZendeskWidget = function () {
    ZendeskWidget.activate({hideOnClose:true});
  };

  footer.language = $translate.use();
}
footerController.$inject = ['ZendeskWidget', '$translate'];
