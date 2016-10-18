'use strict';

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
    'udbApp.ga-tag-manager',
    'udbApp.zendesk',
    'peg',
    'config',
    'btford.socket-io',
    'btford.markdown',
    'pascalprecht.translate',
    'ngMeta'
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
    function (
      udbApi,
      amMoment,
      $rootScope,
      $location,
      $window,
      uitidAuth,
      ngMeta
    ) {
      amMoment.changeLocale('nl');

      ngMeta.init();

      $rootScope.$on('searchSubmitted', function () {
        $location.path('/search');
      });

       // track pageview on state change
      $rootScope.$on('$stateChangeSuccess', function (event) {
        if ($window.tm) {
          $window.tm.push({
            'event': 'VirtualPageview',
            'pagePath' : $location.path(),
            'pageTitle': event.targetScope.ngMeta.title
          });
        }
      });

  }]);

/* @ngInject */
function udbAppConfig(
  $locationProvider,
  $httpProvider,
  $sceDelegateProvider,
  $translateProvider,
  uiSelectConfig,
  appConfig,
  queryFieldTranslations,
  dutchTranslations,
  $stateProvider,
  $urlRouterProvider,
  ngMetaProvider
) {

  $locationProvider.html5Mode(true);

  $httpProvider.interceptors.push('udbHttpInterceptor');

  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    appConfig.baseUrl + '**'
  ]);

  // Translation configuration
  var defaultTranslations = _.merge(dutchTranslations, queryFieldTranslations.nl);
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

  $translateProvider
    .translations('nl', defaultTranslations)
    .preferredLanguage('nl');
  // end of translation configuration

  uiSelectConfig.theme = 'bootstrap';

  ngMetaProvider
    .useTitleSuffix(true)
    .setDefaultTitle('UiTdatabank')
    .setDefaultTitleSuffix(' | Voeg gratis je activiteiten toe')
    .setDefaultTag('description', 'Organiseer je een activiteit? Voeg gratis je activiteiten toe en bereik een groter publiek')
    .setDefaultTag('googleSiteVerification', _.get(appConfig, 'gaTagManager.googleSiteVerification'));

  $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl',
      resolve: {
        /* @ngInject */
        redirectDash: ['authorizationService', function (authorizationService) {
          return authorizationService
            .redirectIfLoggedIn('/dashboard');
        }]
      }
    })
    .state('split', angular.copy(splitView))
    .state('split.footer', {
      templateUrl: 'views/footer-template.html'
    })
    .state('split.footer.dashboard', {
      url: '/dashboard',
      template: '<udb-dashboard>',
      meta: {
        'titleSuffix': ' | Dashboard'
      }
    })
    .state('split.footer.search', {
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
    .state('split.footer.place', {
      url: '/place/:id',
      templateUrl: 'templates/place-detail.html',
      controller: 'placeDetailUIController',
      meta: {
        'titleSuffix': ' | Voorbeeld'
      }
    })
    .state('split.footer.event', {
      template:'<div ui-view></div>'
    })
    .state('split.footer.event.published', {
      url: '/event/:id/published',
      templateUrl: 'templates/event-detail.html',
      controller: 'eventDetailUIController',
      meta: {
        'titleSuffix': ' | Gepubliceerd'
      }
    })
    .state('split.footer.event.saved', {
      url: '/event/:id/saved',
      templateUrl: 'templates/event-detail.html',
      controller: 'eventDetailUIController',
      meta: {
        'titleSuffix': ' | Bewaard'
      }
    })
    .state('split.footer.event.preview', {
      url: '/event/:id/preview',
      templateUrl: 'templates/event-detail.html',
      controller: 'eventDetailUIController',
      meta: {
        'titleSuffix': ' | Voorbeeld'
      }
    })
    .state('split.offer', {
      url: '/event',
      controller: 'offerEditorUIController',
      templateUrl: 'templates/event-form.html',
      meta: {
        'titleSuffix': ' | Toevoegen'
      }
    })
    .state('split.eventEdit', {
      url: '/event/:id/edit',
      controller: 'offerEditorUIController',
      templateUrl: 'templates/event-form.html',
      meta: {
        'titleSuffix': ' | Evenement bewerken'
      }
    })
    .state('split.placeEdit', {
      url: '/place/:id/edit',
      controller: 'offerEditorUIController',
      templateUrl: 'templates/event-form.html',
      meta: {
        'titleSuffix': ' | Plaats bewerken'
      }
    })
    .state('useragreement', {
      url: '/user-agreement',
      template: '<div btf-markdown ng-include="\'docs/user-agreement.md\'"></div>',
      meta: {
        'titleSuffix': ' | Gebruikersovereenkomst'
      }
    })
    .state('copyright', {
      url: '/copyright',
      template: '<div btf-markdown ng-include="\'docs/copyright.md\'"></div>',
      meta: {
        'titleSuffix': ' | Auteursrecht'
      }
    })
    .state('split.savedsearches', {
      url: '/saved-searches',
      templateUrl: 'templates/saved-searches-list.html',
      controller: 'SavedSearchesListController',
      meta: {
        'titleSuffix': ' | Bewaarde zoekopdrachten'
      }
    })
    // Manage stuff
    // Labels
    .state('split.manageLabels', {
      template: '<div ui-view></div>',
      resolve: {
        /* @ngInject */
        isAuthorized: ['authorizationService', 'authorization', '$state', '$q', function (authorizationService, authorization, $state, $q) {
          return authorizationService
            .hasPermission(authorization.manageLabels)
            .then(function (hasPermission) {
              return hasPermission ? $q.resolve(true) : $state.go('split.footer.dashboard');
            });
        }]
      }
    })
    .state('split.manageLabels.list', {
      url: '/manage/labels/overview',
      controller: 'LabelsListController',
      controllerAs: 'llc',
      templateUrl: 'templates/labels-list.html',
      meta: {
        'titleSuffix': ' | Labels'
      }
    })
    .state('split.manageLabels.create', {
      url: '/manage/labels/create',
      templateUrl: 'templates/label-creator.html',
      controller: 'LabelCreatorController',
      controllerAs: 'creator',
      meta: {
        'titleSuffix': ' | Label toevoegen'
      }
    })
    .state('split.manageLabels.edit', {
      url: '/manage/labels/:id',
      templateUrl: 'templates/label-editor.html',
      controller: 'LabelEditorController',
      controllerAs: 'editor',
      meta: {
        'titleSuffix': ' | Label wijzigen'
      }
    })
    // Roles
    .state('split.manageRoles', {
      template: '<div ui-view></div>',
      resolve: {
        /* @ngInject */
        isAuthorized: ['authorizationService', 'authorization', '$state', '$q', function (authorizationService, authorization, $state, $q) {
          return authorizationService
            .hasPermission(authorization.manageUsers)
            .then(function (hasPermission) {
              return hasPermission ? $q.resolve(true) : $state.go('split.footer.dashboard');
            });
        }]
      }
    })
    .state('split.manageRoles.list', {
      url: '/manage/roles/overview',
      controller: 'RolesListController',
      controllerAs: 'rlc',
      templateUrl: 'templates/roles-list.html',
      meta: {
        'titleSuffix': ' | Rollen'
      }
    })
    .state('split.manageRoles.create', {
      url: '/manage/roles/create',
      templateUrl: 'templates/role-form.html',
      controller: 'RoleFormController',
      controllerAs: 'editor',
      meta: {
        'titleSuffix': ' | Rol toevoegen'
      }
    })
    .state('split.manageRoles.edit', {
      url: '/manage/roles/:id',
      templateUrl: 'templates/role-form.html',
      controller: 'RoleFormController',
      controllerAs: 'editor',
      meta: {
        'titleSuffix': ' | Rol bewerken'
      }
    })

    // Users
    .state('management', angular.copy(splitView))
    .state('management.users', {
      template: '<div ui-view></div>',
      resolve: {
        /* @ngInject */
        isAuthorized: ['authorizationService', 'authorization', '$state', '$q', function (authorizationService, authorization, $state, $q) {
          return authorizationService
            .hasPermission(authorization.manageUsers)
            .then(function (hasPermission) {
              return hasPermission ? $q.resolve(true) : $state.go('split.footer.dashboard');
            });
        }]
      }
    })
    .state('management.users.list', {
      url: '/manage/users/overview',
      controller: 'UsersListController',
      controllerAs: 'ulc',
      templateUrl: 'templates/users-list.html',
      meta: {
        'titleSuffix': ' | Gebruikers'
      }
    })
    .state('management.users.edit', {
      url: '/manage/users/:id',
      templateUrl: 'templates/user-editor.html',
      controller: 'UserEditorController',
      controllerAs: 'editor',
      meta: {
        'titleSuffix': ' | Gebruiker bewerken'
      }
    })

    // Organisations
    .state('split.manageOrganisations', {
      template: '<div ui-view></div>',
      resolve: {
        /* @ngInject */
        isAuthorized: ['authorizationService', 'authorization', '$state', '$q', function (authorizationService, authorization, $state, $q) {
          return authorizationService
            .hasPermission(authorization.manageOrganisations)
            .then(function (hasPermission) {
              return hasPermission ? $q.resolve(true) : $state.go('split.footer.dashboard');
            });
        }]
      },
      meta: {
        'titleSuffix': ' | Organisaties'
      }
    })
    .state('management.moderation', {
      template:'<div ui-view></div>'
    })
    .state('management.moderation.list', {
      url: '/manage/moderation/overview',
      templateUrl: 'templates/moderation-list.html',
      controller: 'ModerationListController',
      controllerAs: 'moderator',
      meta: {
        'titleSuffix': ' | Valideren'
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
  'dutchTranslations',
  '$stateProvider',
  '$urlRouterProvider',
  'ngMetaProvider'
];
