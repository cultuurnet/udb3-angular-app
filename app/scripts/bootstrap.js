'use strict';

/*require('udb3-angular');
require('angular-ui-bootstrap');
var deferredBootstrapper = require('angular-deferred-bootstrap');*/

deferredBootstrapper.bootstrap({
  element: document.body,
  module: 'udbApp',
  injectorModules: ['config', 'udb.uitpas'],
  moduleResolves: [
    {
      module: 'udb.uitpas',
      resolve: {
        'ExternalUitpasLabels': [
          '$http', 'appConfig', '$q',
          function ($http, appConfig, $q) {
            var uitpasUrl = _.get(appConfig, 'uitpasUrl');

            if (!uitpasUrl) {
              return $q.resolve(undefined);
            }

            return $http
              .get(uitpasUrl + 'labels')
              .catch(function () {
                return $q.resolve(undefined);
              });
          }
        ]
      }
    }
  ],
  bootstrapConfig: {
    strictDi: true
  }
});
