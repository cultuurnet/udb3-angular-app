'use strict';

/**
 * @ngdoc function
 * @name udbApp.ga-tag-manager.gaExportManager
 * @description
 * # Google Analytics Export Manager
 */
angular
  .module('udbApp.ga-tag-manager')
  .service('gaExportManager', gaExportManager);
/* @ngInject */
function gaExportManager(appConfig) {
  var service = this;
  service.exportJob = function(jobs){
    if (_.get(appConfig, 'gaTagManager.containerId')) {
        var dataLayer = window.tm = window.tm || [];
          angular.forEach(jobs,function(job) {
            if (job.details) {
                var gaObject = {
                    event : 'GAEvent',
                    eventCategory : 'export',
                    eventAction : job.details.format,
                    eventLabel : job.details.brand + ';' + job.details.user + ';' + job.details.queryString
                };
                dataLayer.push(gaObject);
            }
      });
    }
  };
}
gaExportManager.$inject = ['appConfig'];
