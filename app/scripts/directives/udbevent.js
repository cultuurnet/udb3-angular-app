'use strict';

/**
 * @ngdoc directive
 * @name udbApp.directive:udbEvent
 * @description
 * # udbEvent
 */
angular.module('udbApp')
  .directive('udbEvent', ['UdbApi', 'jsonLDLangFilter', function factory(UdbApi, jsonLDLangFilter) {
    var udbEvent = {
      restrict: 'A',
      link: function postLink(scope, iElement, iAttrs) {
        scope.activeLanguage = 'nl';
        scope.languageSelector = [
          {'lang': 'nl'},
          {'lang': 'fr'},
          {'lang': 'en'}
        ];

        // The json-LD object that's return from the server
        var eventLD = {};
        // stores the ID parsed from the json-LD object
        var eventID = false;

        if(!scope.event.title) {
          scope.fetching = true;
          var eventPromise = UdbApi.getEventByLDId(scope.event['@id']);

          eventPromise.then(function (event) {
            eventLD = event;
            eventID =  event['@id'].split('/').pop();
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
          var language = scope.activeLanguage;
          var udbProperty = apiProperty || property;

          if(translation && translation !== eventLD[property][language]) {
            // TODO: Move this to a service that sets up the logging
            UdbApi.translateEventProperty(eventID, udbProperty, language, translation);
          }
        }

        scope.updateName = function (value) {
          translateEventProperty('name', value, 'title');
        };

        scope.updateDescription = function (value) {
          translateEventProperty('description', value);
        };
      }
    };

    return udbEvent;
  }]);
