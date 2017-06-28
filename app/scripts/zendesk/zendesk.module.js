'use strict';

/**
 * @ngdoc function
 * @name udbApp.module: Zendesk
 * @description
 * # Zendesk module
 * The modules configures the Zendesk widget and identifies the logged in user.
 */
angular
  .module('udbApp.zendesk', ['udbApp', 'config', 'zendeskWidget'])
  .config(configureZendeskWidget)
  .run(identifyUser);

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

identifyUser.$inject = ['ZendeskWidget', '$rootScope'];
function identifyUser(ZendeskWidget, $rootScope) {
  $rootScope.$on('userLoggedIn', function (event, userInfo) {
    if (typeof userInfo.mbox !== 'undefined') {
      ZendeskWidget.identify({
        name: userInfo.nick || '',
        email: userInfo.mbox || '',
        externalId: userInfo.id || ''
      });
    }
  });
}
