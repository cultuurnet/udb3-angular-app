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
      lead_sub: 'Ajoutez vos activités gratuitement et élargissez votre public',
      start: 'Commencez ici',
      activities: 'activités par an',
      channels: 'chaînes de publication',
      organizers: 'organisateurs',
      activities_info: 'Vous proposez un concert, une représentation, une exposition ou un film ? Ou plutôt un événement sportif, une randonnée, une soirée cartes, une kermesse ? Ou encore des cours, des ateliers ou des événements ? Tout cela trouvera sa place dans l’UiTdatabank.',
      channels_info: 'UiTdatabank alimente en outre plus de 500 agendas de loisirs imprimés et numériques qui proposent des informations à jour. Ce sont les agendas de chaînes audio-visuelles et de médias locaux ou nationaux, de villes et communes, de services touristiques ou de grandes organisations de coordination.',
      organizers_info: 'Plus de 28.000 organisateurs proposent chaque année plus de 215.000 activités. Cela peut se faire gratuitement par chacun, en ligne.',
      mission: 'Plus d\'audience pour votre activité.',
      register_prefix: 'Première fois? Créer',
      account: 'un nouveau compte',
      register_suffix: ''
    },
    footer: {
      contact: 'Contactez-nous',
      about: 'Sur UiTdatabank',
      dev: 'Pour développeurs (NL)',
      legal: 'Conditions d\'utilisation',
      legalPath: 'accord-utilisation-uitdatabank',
      privacy: 'Confidentialité',
      by: 'Un produit de',
      questions: 'Questions ou remarques?',
      changeProfile: 'Modifier mon profil',
      withSupport: 'avec le soutien de la',
      flemishGovernment: 'Communauté Flamande'
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
