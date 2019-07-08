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
function footerController(ZendeskWidget, $translate, $filter) {
  var footer = this; // jshint ignore:line

  footer.activateZendeskWidget = function () {
    ZendeskWidget.activate({hideOnClose:true});
  };

  footer.language = $translate.use();
  footer.legalPath = $filter('translate')('footer.legalPath');
}
footerController.$inject = ['ZendeskWidget', '$translate', '$filter'];
