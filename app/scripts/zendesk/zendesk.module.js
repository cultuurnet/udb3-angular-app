'use strict';

require('angular');

/**
 * @ngdoc function
 * @name udbApp.module: Zendesk
 * @description
 * # Zendesk module
 * The modules configures the Zendesk widget and identifies the logged in user.
 */
angular
  .module('udbApp.zendesk', ['udbApp', 'config', 'zendeskWidget'])
  .config(configureZendeskWidget);

configureZendeskWidget.$inject = ['ZendeskWidgetProvider', 'appConfig'];
function configureZendeskWidget(ZendeskWidgetProvider, appConfig) {
  ZendeskWidgetProvider.init({
    accountUrl: _.get(appConfig, 'zendesk.accountUrl'),
    beforePageLoad: function(zE) {
      zE.hide();
      zE.setLocale('nl');
    }
  });
}


