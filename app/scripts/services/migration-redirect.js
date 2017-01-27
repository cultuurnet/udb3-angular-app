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

  service.migrateEventBeforeState = function(uiEvent, toState, toParams){
    var eventId = toParams.id;
    var beforeStates = {
      'split.eventEdit': {
        state: 'split.eventEdit',
        description: 'Doorgaan met bewerken'
      },
      'duplication.event': {
        state: 'duplication.event',
        description: 'Doorgaan met kopiëren en aanpassen'
      }
    };

    /**
     * @param {string[]} requiredMigrationSteps
     */
    function redirectIfMigrationIsNeeded(requiredMigrationSteps) {
      if (requiredMigrationSteps.length) {
        uiEvent.preventDefault();
        toParams.location = 'true';
        toParams.id = eventId;
        toParams.destination = beforeStates[toState.name];
        $state.transitionTo('migration.event', toParams, {location: 'replace'});
      }
    }

    if(!_.includes(_.keys(beforeStates), toState.name)) {
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