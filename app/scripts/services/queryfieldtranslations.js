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
        LOCATION_LABEL: 'location_label',
        ORGANISER_LABEL: 'organiser_label',
        CATEGORY_NAME: 'category_name',
        PRICE: 'price',
        CITY: 'city',
        TITLE: 'title',
        SHORT_DESCRIPTION: 'shortdescription',
        CALENDAR_SUMMARY: 'calendarsummary'
    },
    fr: {
        LOCATION: 'location',
        TITLE: 'titre'
    },
    nl: {
        LOCATION_LABEL: 'locatie',
        ORGANISER_LABEL: 'organisator',
        CATEGORY_NAME: 'categorie',
        PRICE: 'prijs',
        CITY: 'gemeente',
        TITLE: 'titel',
        SHORT_DESCRIPTION: 'kortebeschrijving',
        CALENDAR_SUMMARY: 'tijdsinformatie',
    }
  });
