'use strict';

/**
 * @ngdoc directive
 * @name udbApp.directive:udbEvent
 * @description
 * # udbEvent
 */
angular.module('udbApp')
  .directive('udbEvent', ['udbApi', 'jsonLDLangFilter', 'eventTranslator', 'eventTagger',
    function factory(udbApi, jsonLDLangFilter, eventTranslator, eventTagger) {
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

        // The event object that's returned from the server
        var event;

        if(!scope.event.title) {
          scope.fetching = true;
          var eventPromise = udbApi.getEventByLDId(scope.event['@id']);

          eventPromise.then(function (eventObject) {
            event = eventObject;
            scope.availableLabels = _.union(event.labels, eventTagger.recentLabels);
            scope.event = jsonLDLangFilter(event, scope.activeLanguage);
            scope.fetching = false;
          });
        } else {
          scope.fetching = false;
        }

        scope.setLanguage = function (lang) {
          scope.activeLanguage = lang;
          scope.event = jsonLDLangFilter(event, scope.activeLanguage);
        };

        function translateEventProperty (property, translation, apiProperty) {
          var language = scope.activeLanguage,
              udbProperty = apiProperty || property;

          if(translation && translation !== event[property][language]) {
            eventTranslator.translateProperty(event, udbProperty, language, translation);
          }
        }

        scope.updateName = function (value) {
          translateEventProperty('name', value, 'title');
        };

        scope.updateDescription = function (value) {
          translateEventProperty('description', value);
        };

        scope.labelAdded = function (label) {
          eventTagger.tag(event, label);
        };

        scope.labelRemoved = function (label) {
          eventTagger.untag(event, label);
        };
      }
    };

    return udbEvent;
  }]);
