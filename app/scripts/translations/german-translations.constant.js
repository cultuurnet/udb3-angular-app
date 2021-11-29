'use strict';
// jscs:disable maximumLineLength

/**
 * @ngdoc service
 * @name udbApp.udbAppGermanTranslations
 * @description
 * # udbAppGermanTranslations
 * Constant in the udbApp.
 */
angular.module('udbApp.translate')
  .constant('udbAppGermanTranslations',
  {
    main: {
      lead: 'Organisieren Sie eine Aktivität?',
      lead_sub: 'Fügen Sie kostenlos Ihre Aktivitäten hinzu und erreichen Sie ein größeres Publikum',
      start: 'Starten Sie hier',
      activities: 'Aktivitäten pro Jahr',
      channels: 'verschiedene Kanäle',
      organizers: 'Organisatoren',
      activities_info: 'Ein Ausflug, eine Sportaktivität, ein Spieleabend, Jahrmarkt oder Kurs? Ein Konzert, eine Ausstellung oder ein Film? UiTdatabank steht für die verschiedensten Freizeitaktivitäten offen.',
      channels_info: 'UiTdatabank liefert Informationen an mehr als <1>{{link}}</1>, darunter UiTinvlaanderen, Webseiten von Städten und Gemeinden, Themen-Agendas, Printmedien und mobile Apps. Auch Ihre Aktivität kann auf vielen Agendas erscheinen.',
      organizers_info: 'Jährlich promoten 28.000 Organisatoren ihre Aktivitäten über die UiTdatabank. Insgesamt erreichen sie damit jährlich mehr als 3 Millionen Menschen. Fügen Sie genau wie andere Organisatoren Ihre Aktivität schnell und einfach hinzu.',
      mission: 'So machen Sie mehr Menschen Lust auf Ihre Aktivität.',
      register_prefix: 'Erstes Mal?',
      account: 'Ein neues Konto',
      register_suffix: 'erstellen'
    },
    footer: {
      contact: 'Kontaktieren Sie uns',
      about: 'Über UiTdatabank',
      dev: 'Für Entwickler',
      legal: 'Nutzungsbedingungen',
      legalPath: 'Nutzungsbedingungen-uitdatabank',
      privacy: 'Datenschutz',
      by: 'Ein Produkt vonn',
      questions: 'Haben Sie Fragen oder Feedback?',
      changeProfile: 'Mein Profil ändern',
      withSupport: 'mit Unterstützung von',
      flemishGovernment: 'Flämische Regierung'
    },
    menu: {
      home: 'Startseite',
      add: 'Eingeben',
      search: 'Suchen',
      management: 'Verwaltung',
      Valideren: 'Validieren',
      Gebruikers: 'Benutzer',
      Rollen: 'Rollen',
      Labels: 'Labels',
      Organisaties: 'Organisationen',
      notifications: 'Benachrichtigungen',
      signOut: 'Abmelden'
    }
  }
);
