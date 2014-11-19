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

        if(!scope.event.title) {
          scope.fetching = true;
          var eventPromise = UdbApi.getEventByLDId(scope.event['@id']);

          eventPromise.then(function (event) {
            eventLD = event;
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

        function translateEventProperty(event, property, lang, value) {
          event[property][lang] = value;
        };

        scope.$watch('event.name', function (name) {

          console.log({
            title: name,
            lang: scope.activeLanguage,
            changed: (name != eventLD.name[scope.activeLanguage])
          });

          if(name && name != eventLD.name[scope.activeLanguage]) {
            translateEventProperty(eventLD, 'name', scope.activeLanguage, name);
          }
        })
      }
    };

    return udbEvent;
  }]);
