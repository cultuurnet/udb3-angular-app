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

    if(!_.includes(_.keys(beforeStates), toState.name)) {
      return;
    }

    if (!eventId) {
      return;
    }

    offerLocator
      .get(eventId)
      .then(udbApi.getOffer);
  };
}
MigrationRedirect.$inject = ['$state', 'offerLocator', 'udbApi', 'eventMigration'];
