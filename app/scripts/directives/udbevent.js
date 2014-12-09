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

        var TranslationState = {
          ALL: { 'name': 'all', 'icon': 'fa-circle' },
          NONE: { 'name': 'none', 'icon': 'fa-circle-o' },
          SOME: { 'name': 'some', 'icon': 'fa-dot-circle-o' }
        };

        function updateTranslationState (event) {
          var languages = {'en': false, 'fr': false, 'de': false},
              properties = ['name', 'description'];

          _.forEach(languages, function (language, languageKey) {
            var translationCount = 0,
                state;

            _.forEach(properties, function(property) {
              if(event[property] && event[property][languageKey]) {
                ++translationCount;
              }
            });

            if(translationCount) {
              if(translationCount === properties.length) {
                state = TranslationState.ALL;
              } else {
                state = TranslationState.SOME;
              }
            } else {
              state = TranslationState.NONE;
            }

            languages[languageKey] = state;
          });

          event.translationState = languages;
        }

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
            updateTranslationState(event);
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
