'use strict';

/**
 * @ngdoc service
 * @name udbApp.queryFields
 * @description
 * # queryFields
 * Value in the udbApp.
 */
angular.module('udbApp')
  .value('queryFields', [
    'title',
    'calendarsummary',
    'shortdescription',
    'image',
    'location_label',
    'organiser_label',
    'price',
    'category_name',
    'city'
  ]);
