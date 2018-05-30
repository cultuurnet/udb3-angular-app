'use strict';
// jscs:disable maximumLineLength

/**
 * @ngdoc service
 * @name udbApp.udbAppFrenchTranslations
 * @description
 * # udbAppFrenchTranslations
 * Constant in the udbApp.
 */
angular.module('udbApp.translate')
  .constant('udbAppFrenchTranslations',
  {
    main: {
      lead: 'Organisez-vous une activité?',
      lead_sub: 'Ajoutez vos activités gratuitement et touchez un public plus large',
      start: 'Commencez ici',
    },
    menu: {
      home: 'Home',
      add: 'Remplir',
      search: 'Chercher',
      management: 'Gestion',
      Valideren: 'Valider',
      Gebruikers: 'Utilisateurs',
      Rollen: 'Rôles',
      Labels: 'Étiquettes',
      Organisaties: 'Organisateurs',
      notifications: 'Notifications',
      signOut: 'Déconnecter'
    }
  }
);
