'use strict';

deferredBootstrapper.bootstrap({
  element: document.body,
  module: 'udbApp',
  injectorModules: ['config', 'udb.uitpas'],
  moduleResolves: [
    {
      module: 'udb.uitpas',
      resolve: {
        'UitpasLabels': [
          '$http', 'appConfig', 'DefaultUitpasLabels', '$q',
          function ($http, appConfig, DefaultUitpasLabels, $q) {
            var uitpasUrl = _.get(appConfig, 'uitpasUrl');

            if (!uitpasUrl) {
              return $q.resolve(DefaultUitpasLabels);
            }

            return $http
              .get(uitpasUrl + 'labels')
              .catch(function () {
                return $q.resolve(DefaultUitpasLabels);
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