'use strict';

/**
 * @ngdoc function
 * @name udbApp.service:migrationRedirect
 * @description
 * # Migration Redirect Service
 */
angular
  .module('udbApp')
  .service('migrationRedirect', MigrationRedirect);

function MigrationRedirect($state, offerLocator, udbApi, eventMigration) {
  var service = this;

  service.migrateEventBeforeEdit = function(uiEvent, toState, toParams, fromState, fromParams){
    var eventId = toParams.id;

    /**
     * @param {string[]} requiredMigrationSteps
     */
    function redirectIfMigrationIsNeeded(requiredMigrationSteps) {
      if (requiredMigrationSteps.length) {
        uiEvent.preventDefault();
        toParams.location = '✗';
        $state.transitionTo('migration.event', toParams, {location: 'replace'});
      }
    }

    if(toState.name !== 'split.eventEdit') {
      return;
    }

    if (!eventId) {
      return;
    }

    offerLocator
      .get(eventId)
      .then(udbApi.getOffer)
      .then(eventMigration.checkRequirements)
      .then(redirectIfMigrationIsNeeded);
  };
}
MigrationRedirect.$inject = ['$state', 'offerLocator', 'udbApi', 'eventMigration'];