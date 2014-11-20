'use strict';

/**
 * @ngdoc directive
 * @name udbApp.directive:udbEvent
 * @description
 * # udbEvent
 */
angular.module('udbApp')
  .directive('udbEvent', ['UdbApi', 'jsonLDLangFilter', 'EventTranslator', 'eventTagger',
    function factory(UdbApi, jsonLDLangFilter, EventTranslator, eventTagger) {
    var udbEvent = {
      restrict: 'A',
      link: function postLink(scope, iElement, iAttrs) {
        scope.activeLanguage = 'nl';
        scope.languageSelector = [
          {'lang': 'nl'},
          {'lang': 'fr'},
          {'lang': 'en'}
        ];
        scope.availableLabels = eventTagger.recentLabels;

        // The json-LD object that's return from the server
        var eventLD = {};
        // stores the ID parsed from the json-LD object
        var eventID = '';

        if(!scope.event.title) {
          scope.fetching = true;
          var eventPromise = UdbApi.getEventByLDId(scope.event['@id']);

          eventPromise.then(function (event) {
            eventLD = event;
            eventID = event['@id'].split('/').pop();
            scope.availableLabels = _.union(event.labels, eventTagger.recentLabels);
            scope.event = jsonLDLangFilter(event, scope.activeLanguage);
            scope.fetching = false;
          });
        } else {
          scope.fetching = false;
        }

        scope.setLanguage = function (lang) {
          scope.activeLanguage = lang;
          scope.event = jsonLDLangFilter(eventLD, scope.activeLanguage);
        };

        function translateEventProperty (property, translation, apiProperty) {
          var language = scope.activeLanguage,
              udbProperty = apiProperty || property;

          if(translation && translation !== eventLD[property][language]) {
            EventTranslator.translateProperty(eventID, udbProperty, language, translation);
            eventLD[property][language] = translation;
          }
        }

        scope.updateName = function (value) {
          translateEventProperty('name', value, 'title');
        };

        scope.updateDescription = function (value) {
          translateEventProperty('description', value);
        };

        scope.labelAdded = function (label) {
          eventTagger.tag(eventID, label);
          eventLD.labels = _.remove(eventLD.labels, label);
        };

        scope.labelRemoved = function (label) {
          eventTagger.untag(eventID, label);
          eventLD.labels.push(label);
        };
      }
    };

    return udbEvent;
  }]);
