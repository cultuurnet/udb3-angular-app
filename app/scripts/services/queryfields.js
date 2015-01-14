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
    'cdbid',
    'title',
    'keywords',
    'organiser_keywords',
    'city',
    'zipcode',
    'country',
    'physical_gis',
    'category_name',
    'agefrom',
    'detail_lang',
    'price',
    'startdate',
    'enddate',
    'organiser_label',
    'location_label',
    'externalid',
    'lastupdated',
    'lastupdatedby',
    'creationdate',
    'createdby',
    'permanent',
    'category_eventtype_name',
    'category_theme_name',
    'category_facility_name',
    'category_targetaudience_name',
    'category_flandersregion_name',
    'category_publicscope_name',
    'like_count',
    'recommend_count',
    'attend_count',
    'comment_count',
    'private',
    'availablefrom'
  ]);
