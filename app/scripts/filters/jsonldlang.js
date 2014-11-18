'use strict';

/**
 * @ngdoc filter
 * @name udbApp.filter:jsonLDLang
 * @function
 * @description
 * # jsonLDLang
 * Filter JsonLD objects by language.
 */
angular.module('udbApp')
  .filter('jsonLDLang', function () {
    return function (jsonLDObject, preferredLanguage) {
      var translatedObject = _.cloneDeep(jsonLDObject),
          containedProperties = ['name', 'shortDescription'],
          languages = ['nl', 'en', 'fr', 'de'],
          // set a default language if none is specified
          language = preferredLanguage || 'nl';

      console.log(jsonLDObject);

      _.each(containedProperties, function (property) {
        // make sure then property is set on the object
        if(translatedObject[property]) {
          var translatedProperty = translatedObject[property][language],
              langIndex = 0;

          // if there is no translation available for the provided language or default language
          // check for a default language
          while(!translatedProperty && langIndex < languages.length) {
            var fallbackLanguage = languages[langIndex];
            translatedProperty = translatedObject[property][fallbackLanguage];
            ++langIndex;
          }

          translatedObject[property] = translatedProperty;
        }
      });

      console.log(translatedObject);

      return translatedObject;
    };
  });

