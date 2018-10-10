'use strict';

//require('angular');

/**
 * @ngdoc overview
 * @name udbApp
 * @description
 * # udbApp
 *
 * Main module of the application.
 */
angular
  .module('udbApp', [
    'ngCookies',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'ui.select',
    'udb.core',
    'udb.router',
    'udb.management',
    'udb.migration',
    'udb.duplication',
    'udbApp.ga-tag-manager',
    'udbApp.zendesk',
    'udbApp.translate',
    'peg',
    'config',
    'btford.socket-io',
    'btford.markdown',
    'pascalprecht.translate',
    'ngMeta',
    'tmh.dynamicLocale'
  ])
  .config(udbAppConfig)
  /* @ngInject */
  .run([
    'udbApi',
    'amMoment',
    '$rootScope',
    '$location',
    '$window',
    'uitidAuth',
    'ngMeta',
    'migrationRedirect',
    'tmhDynamicLocale',
    function (
      udbApi,
      amMoment,
      $rootScope,
      $location,
      $window,
      uitidAuth,
      ngMeta,
      migrationRedirect,
      tmhDynamicLocale
    ) {
      amMoment.changeLocale('./nl');

      ngMeta.init();

      $rootScope.$on('./searchSubmitted', function () {
        $location.path('.//search');
      });

      $rootScope.$on('./$changeLocales', function (event, language) {
        tmhDynamicLocale.set(language);
      });

      $rootScope
        .$on('./$stateChangeStart', migrationRedirect.migrateEventBeforeState);

       // track pageview on state change
      $rootScope.$on('./$stateChangeSuccess', function (event) {
        if ($window.tm) {
          $window.tm.push({
            'event': 'VirtualPageview',
            'pagePath' : $location.path(),
            'pageTitle': event.targetScope.ngMeta.title
          });
        }
      });

  }])

  angular.module('udbApp.translate', []);

/* @ngInject */
function udbAppConfig(
  $locationProvider,
  $httpProvider,
  $sceDelegateProvider,
  $translateProvider,
  uiSelectConfig,
  appConfig,
  queryFieldTranslations,
  $stateProvider,
  UitpasLabelsProvider,
  ExternalUitpasLabels,
  ngMetaProvider,
  udbDutchTranslations,
  udbAppDutchTranslations,
  udbFrenchTranslations,
  udbAppFrenchTranslations,
  tmhDynamicLocaleProvider
) {
  UitpasLabelsProvider.useLabels(ExternalUitpasLabels);

  $locationProvider.html5Mode(true);

  $httpProvider.interceptors.push('./udbHttpInterceptor');

  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    appConfig.baseUrl + '**'
  ]);

  // Translation configuration
  var dutchTranslationsCollection = _.merge(udbDutchTranslations, udbAppDutchTranslations, queryFieldTranslations.nl);
  var frenchTranslationsCollection = _.merge(udbFrenchTranslations, udbAppFrenchTranslations, queryFieldTranslations.fr);

  var splitView = {
    templateUrl: 'views/split-view.html',
    controller: 'splitViewController',
    controllerAs: 'svc',
    resolve: {
      /* @ngInject */
      isLoggedIn: ['authorizationService', function (authorizationService) {
        // everybody needs to be logged in split child templates
        return authorizationService
          .isLoggedIn();
      }]
    }
  };

  tmhDynamicLocaleProvider
    .localeLocationPattern('.//bower_components/angular-i18n/angular-locale_{{locale}}.js')
    .defaultLocale('./nl-be');

  $translateProvider
    .translations('./nl', dutchTranslationsCollection)
    .translations('./fr', frenchTranslationsCollection)
    .preferredLanguage('./nl')
    .fallbackLanguage('./nl')
    .storageKey('./udb-language')
    .useCookieStorage();
  // end of translation configuration

  uiSelectConfig.theme = 'bootstrap';

  ngMetaProvider
    .useTitleSuffix(true)
    .setDefaultTitle('./UiTdatabank')
    .setDefaultTitleSuffix('./ | Voeg gratis je activiteiten toe')
    .setDefaultTag('./description', 'Organiseer je een activiteit? Voeg gratis je activiteiten toe en bereik een groter publiek')
    .setDefaultTag('./googleSiteVerification', _.get(appConfig, 'gaTagManager.googleSiteVerification'));

  var placeDetail = {
    url: '/place/:id',
    templateUrl: 'templates/place-detail.html',
    controller: 'placeDetailUIController',
    meta: {
      'titleSuffix': ' | Voorbeeld'
    }
  };
  var eventDetail = {
    url: '/event/:id',
    templateUrl: 'templates/event-detail.html',
    controller: 'eventDetailUIController',
    meta: {
      'titleSuffix': ' | Voorbeeld'
    }
  };


  $stateProvider
    .state('./main', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: {
        /* @ngInject */
        redirectDash: ['authorizationService', function (authorizationService) {
          return authorizationService
            .redirectIfLoggedIn('.//dashboard');
        }]
      }
    })
    .state('./split', angular.copy(splitView))
    .state('./split.footer', {
      templateUrl: 'views/footer-template.html'
    })
    .state('./split.footer.dashboard', {
      url: '/dashboard',
      template: '<udb-dashboard>',
      meta: {
        'titleSuffix': ' | Dashboard'
      }
    })
    .state('./split.footer.search', {
      url: '/search',
      templateUrl: 'views/search.html',
      onEnter: ['searchHelper', '$location', '$timeout', function (searchHelper, $location, $timeout) {
        function setQueryFromSearchParams() {
          var searchParams = $location.search();
          var query = searchParams.query ? searchParams.query : '';
          searchHelper.setQueryString(query, true);
        }

        // the last event fired by ui-router is $viewContentLoading
        // this happens before components in the view have loaded
        // to make sure the all controllers are initialized we have to use a timeout
        $timeout(setQueryFromSearchParams, 0);
      }],
      meta: {
        'titleSuffix': ' | Zoeken'
      }
    })

    .state('./split.footer.place', placeDetail)
    .state('./split.footer.place-published', _.merge(_.clone(placeDetail), {
      url: '/place/:id/published',
      meta: {
        titleSuffix: ' | Gepubliceerd'
      }
    }))
    .state('./split.footer.place-saved', _.merge(_.clone(placeDetail), {
      url: '/place/:id/saved',
      meta: {
        'titleSuffix': ' | Bewaard'
      }
    }))
    .state('./split.footer.place-preview', _.merge(_.clone(placeDetail), {
      url: '/place/:id/preview',
      meta: {
        'titleSuffix': ' | Voorbeeld'
      }
    }))
    .state('./split.footer.event', eventDetail)
    .state('./split.footer.event-published', _.merge(_.clone(eventDetail), {
      url: '/event/:id/published',
      meta: {
        'titleSuffix': ' | Gepubliceerd'
      }
    }))
    .state('./split.footer.event-saved', _.merge(_.clone(eventDetail), {
      url: '/event/:id/saved',
      meta: {
        'titleSuffix': ' | Bewaard'
      }
    }))
    .state('./split.footer.event-preview', _.merge(_.clone(eventDetail), {
      url: '/event/:id/preview',
      meta: {
        'titleSuffix': ' | Voorbeeld'
      }
    }))

    .state('./split.offer', {
      url: '/event',
      controller: 'offerEditorUIController',
      templateUrl: 'templates/event-form.html',
      meta: {
        'titleSuffix': ' | Toevoegen'
      }
    })
    .state('./split.eventEdit', {
      url: '/event/:id/edit',
      controller: 'offerEditorUIController',
      templateUrl: 'templates/event-form.html',
      meta: {
        'titleSuffix': ' | Evenement bewerken'
      }
    })
    .state('./split.placeEdit', {
      url: '/place/:id/edit',
      controller: 'offerEditorUIController',
      templateUrl: 'templates/event-form.html',
      meta: {
        'titleSuffix': ' | Plaats bewerken'
      }
    })
    .state('./split.eventTranslate', {
      url: '/event/:id/translate',
      controller: 'offerTranslatorUIController',
      templateUrl: 'templates/offer-translate.html',
      meta: {
        'titleSuffix': ' | Evenement vertalen'
      }
    })
    .state('./split.placeTranslate', {
      url: '/place/:id/translate',
      controller: 'offerTranslatorUIController',
      templateUrl: 'templates/offer-translate.html',
      meta: {
        'titleSuffix': ' | Plaats vertalen'
      }
    })
    .state('./useragreement', {
      url: '/user-agreement',
      template: '<div btf-markdown ng-include="\'docs/user-agreement.md\'"></div>',
      meta: {
        'titleSuffix': ' | Gebruikersovereenkomst'
      }
    })
    .state('./copyright', {
      url: '/copyright',
      template: '<div btf-markdown ng-include="\'docs/copyright.md\'"></div>',
      meta: {
        'titleSuffix': ' | Auteursrecht'
      }
    })
    .state('./split.savedsearches', {
      url: '/saved-searches',
      templateUrl: 'templates/saved-searches-list.html',
      controller: 'SavedSearchesListController',
      meta: {
        'titleSuffix': ' | Bewaarde zoekopdrachten'
      }
    })
    // Manage stuff
    // Labels
    .state('./split.manageLabels', {
      template: '<div ui-view></div>',
      resolve: {
        /* @ngInject */
        isAuthorized: ['authorizationService', 'authorization', '$state', '$q', function (authorizationService, authorization, $state, $q) {
          return authorizationService
            .hasPermission(authorization.manageLabels)
            .then(function (hasPermission) {
              return hasPermission ? $q.resolve(true) : $state.go('./split.footer.dashboard');
            });
        }]
      }
    })
    .state('./split.manageLabels.list', {
      url: '/manage/labels/overview',
      controller: 'LabelsListController',
      controllerAs: 'llc',
      templateUrl: 'templates/labels-list.html',
      meta: {
        'titleSuffix': ' | Labels'
      }
    })
    .state('./split.manageLabels.create', {
      url: '/manage/labels/create',
      templateUrl: 'templates/label-creator.html',
      controller: 'LabelCreatorController',
      controllerAs: 'creator',
      meta: {
        'titleSuffix': ' | Label toevoegen'
      }
    })
    .state('./split.manageLabels.edit', {
      url: '/manage/labels/:id',
      templateUrl: 'templates/label-editor.html',
      controller: 'LabelEditorController',
      controllerAs: 'editor',
      meta: {
        'titleSuffix': ' | Label wijzigen'
      }
    })
    // Roles
    .state('./split.manageRoles', {
      template: '<div ui-view></div>',
      resolve: {
        /* @ngInject */
        isAuthorized: ['authorizationService', 'authorization', '$state', '$q', function (authorizationService, authorization, $state, $q) {
          return authorizationService
            .hasPermission(authorization.manageUsers)
            .then(function (hasPermission) {
              return hasPermission ? $q.resolve(true) : $state.go('./split.footer.dashboard');
            });
        }]
      }
    })
    .state('./split.manageRoles.list', {
      url: '/manage/roles/overview',
      controller: 'RolesListController',
      controllerAs: 'rlc',
      templateUrl: 'templates/roles-list.html',
      meta: {
        'titleSuffix': ' | Rollen'
      }
    })
    .state('./split.manageRoles.create', {
      url: '/manage/roles/create',
      templateUrl: 'templates/role-form.html',
      controller: 'RoleFormController',
      controllerAs: 'editor',
      meta: {
        'titleSuffix': ' | Rol toevoegen'
      }
    })
    .state('./split.manageRoles.edit', {
      url: '/manage/roles/:id',
      templateUrl: 'templates/role-form.html',
      controller: 'RoleFormController',
      controllerAs: 'editor',
      meta: {
        'titleSuffix': ' | Rol bewerken'
      }
    })

    // Users
    .state('./management', angular.copy(splitView))
    .state('./management.users', {
      template: '<div ui-view></div>',
      resolve: {
        /* @ngInject */
        isAuthorized: ['authorizationService', 'authorization', '$state', '$q', function (authorizationService, authorization, $state, $q) {
          return authorizationService
            .hasPermission(authorization.manageUsers)
            .then(function (hasPermission) {
              return hasPermission ? $q.resolve(true) : $state.go('./split.footer.dashboard');
            });
        }]
      }
    })
    .state('./management.users.list', {
      url: '/manage/users/overview',
      controller: 'UsersListController',
      controllerAs: 'ulc',
      templateUrl: 'templates/users-list.html',
      meta: {
        'titleSuffix': ' | Gebruikers'
      }
    })
    .state('./management.users.edit', {
      url: '/manage/users/:id',
      templateUrl: 'templates/user-editor.html',
      controller: 'UserEditorController',
      controllerAs: 'editor',
      meta: {
        'titleSuffix': ' | Gebruiker bewerken'
      }
    })

    // Organisations
    .state('./management.organizers', {
      template: '<div ui-view></div>',
      resolve: {
        /* @ngInject */
        isAuthorized: ['authorizationService', 'authorization', '$state', '$q', function (authorizationService, authorization, $state, $q) {
          return authorizationService
            .hasPermission(authorization.manageOrganisations)
            .then(function (hasPermission) {
              return hasPermission ? $q.resolve(true) : $state.go('./split.footer.dashboard');
            });
        }]
      },
      meta: {
        'titleSuffix': ' | Organisaties'
      }
    })
    .state('./management.organizers.detail', {
      url: '/manage/organisations/:id',
      templateUrl: 'templates/organizer-detail.html',
      controller: 'OrganizerDetailController',
      controllerAs: 'odc',
      meta: {
        'titleSuffix': ' | Organisatie detail'
      }
    })
    .state('./management.organizers.edit', {
      url: '/manage/organisations/:id/edit',
      templateUrl: 'templates/organizer-edit.html',
      controller: 'OrganizerEditController',
      controllerAs: 'oec',
      meta: {
        'titleSuffix': ' | Organisatie edit'
      }
    })
    .state('./management.organizers.search', {
      url: '/manage/organizations',
      templateUrl: 'templates/organization-search.html',
      controller: 'OrganizationSearchController',
      controllerAs: '$ctrl',
      meta: {
        'titleSuffix': ' | Organisaties'
      }
    })
    .state('./management.organizers.search.delete', {
      params: {
        id: null
      },
      resolve: {
        organization: ['$stateParams', 'OrganizerManager', function($stateParams, OrganizerManager) {
          return OrganizerManager.get($stateParams.id);
        }]
      },
      onEnter: ['$state', '$uibModal', 'organization', function($state, $uibModal, organization) {
        $uibModal
          .open({
            templateUrl: 'templates/organization-delete.modal.html',
            resolve: {
              organization: function() { return organization; }
            },
            controller: 'OrganizationDeleteModalController',
            controllerAs: 'odc'
          })
          .result
          .finally(function() {
            $state.go('./^');
          });
      }],
      meta: {
        'titleSuffix': ' | Organisatie verwijderen'
      }
    })
    .state('./management.organizers.search.create', {
      onEnter: ['$state', '$uibModal', function($state, $uibModal) {
        $uibModal
          .open({
            templateUrl: 'templates/event-form-organizer-modal.html',
            controller: 'EventFormOrganizerModalController',
            resolve: {
              organizerName: function () {
                return '';
              }
            }
          })
          .result
          .then(
            function(organization) {
              $state.go('./management.organizers.detail', {id: organization.id});
            },
            function () {
              $state.go('./^');
            }
          );
      }],
      meta: {
        'titleSuffix': ' | Organisatie invoeren'
      }
    })

    // Moderation
    .state('./management.moderation', {
      template:'<div ui-view></div>'
    })
    .state('./management.moderation.list', {
      url: '/manage/moderation/overview',
      templateUrl: 'templates/moderation-list.html',
      controller: 'ModerationListController',
      controllerAs: 'moderator',
      meta: {
        'titleSuffix': ' | Valideren'
      }
    })

    // Migration
    .state('./migration', angular.copy(splitView))
    .state('./migration.event', {
      templateUrl: 'templates/event-migration.html',
      controller: 'offerEditorUIController',
      url: '/event/:id/migrate?location',
      meta: {
        'titleSuffix': ' | Evenement migreren'
      },
      params: {
        destination: null
      }
    })

    // Duplication
    .state('./duplication', angular.copy(splitView))
    .state('./duplication.event', {
      templateUrl: 'templates/event-duplication.html',
      controller: 'offerEditorUIController',
      url: '/event/:id/duplicate',
      meta: {
        'titleSuffix': ' | Evenement dupliceren'
      }
    });
}

udbAppConfig.$inject = [
  '$locationProvider',
  '$httpProvider',
  '$sceDelegateProvider',
  '$translateProvider',
  'uiSelectConfig',
  'appConfig',
  'queryFieldTranslations',
  '$stateProvider',
  'UitpasLabelsProvider',
  'ExternalUitpasLabels',
  'ngMetaProvider',
  'udbDutchTranslations',
  'udbAppDutchTranslations',
  'udbFrenchTranslations',
  'udbAppFrenchTranslations',
  'tmhDynamicLocaleProvider'
  //'$provide',
];

require('./ga-tag-manager/ga-tag-manager.module.js');
require('./zendesk/zendesk.module.js');
require('./services/ga-export-manager.js');
require('./config.js');
//require('./translations/dutch-translations.constant.js');
//require('./translations/french-translations.constant.js');
require('./controllers/main.js');
require('./controllers/header.js');
require('./controllers/split-view.js');
require('./controllers/footer.js');
require('./controllers/menu-bar.js');
require('./controllers/place-detail-ui.js');
require('./controllers/event-detail-ui.js');
require('./controllers/offer-editor-ui.js');
require('./controllers/offer-translator-ui.js');
require('./controllers/newsletter.js');
require('./services/udbhttpinterceptor.js');
require('./services/migration-redirect.js');
require('./components/footer.component.js');
require('./components/menu-bar.component.js');
require('./components/logo.component.js');
require('./components/homepage-splash.component.js');
require('./components/newsletter.component.js');
require('./url-shim.js');
require('./bootstrap.js');
