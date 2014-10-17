'use strict';

/**
 * @ngdoc service
 * @name udbApp.queryFieldTranslations
 * @description
 * # queryFieldTranslations
 * Value in the udbApp.
 */
angular.module('udbApp')
  .value('queryFieldTranslations', {
    en: {
        LOCATION: 'location',
        TITLE: 'title'
    },
    fr: {
        LOCATION: 'location',
        TITLE: 'titre'
    },
    nl: {
        LOCATION: 'locatie',
        TITLE: 'titel'
    }
  });
