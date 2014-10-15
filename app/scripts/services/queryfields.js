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
    'q',
    'title',
    'calendarSummary',
    'shortDescription',
    'image',
    'location'
  ]);
