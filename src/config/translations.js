/* @flow */
import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';

i18n
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    resources: {
      en: {
        common: {
          title: 'Helsinki app',
          next: 'Next',
          previous: 'Previous',
          finish: 'Finish',
          'city-change-title': 'Open another city\'s app',
        },
        tabs: {
          home: 'Home',
          profile: 'Profile',
          feedback: 'Feedback',
          feeds: 'Feeds',
        },
        languageStep: {
          question: 'Choose a language',
          options: {
            fi: 'Suomeksi',
            sv: 'På svenska',
            en: 'In english',
          },
        },
        userTypeStep: {
          title: 'Helsinki app',
          question: 'Are you',
          options: {
            local: 'Helsinki citizen',
            visitor: 'Visitor',
          },
        },
        interestStep: {
          title: 'Helsinki app',
          question: 'What are you interested in?',
          options: {
            restaurants: 'Restaurants',
            movies: 'Movies',
            family: 'Family',
            health: 'Health',
            cityPlanning: 'City Planning',
            exercise: 'Exercise',
          },
        },
        profileTab: {
          userType: 'User type',
          interests: 'Interests',
          restartOnboarding: 'Edit your choices',
          changeLanguage: 'Change language',
        },
      },
      fi: {
        common: {
          title: 'Helsinki app common',
          next: 'Seuraava',
          previous: 'Edellinen',
          finish: 'Valmis',
          'city-change-title': 'Avaa toisen kaupungin sovellus',
        },
        tabs: {
          home: 'Koti',
          profile: 'Profiili',
          feedback: 'Palaute',
          feeds: 'Ajankohtaista',
        },
        userTypeStep: {
          title: 'Helsinki app',
          question: 'Oletko',
          options: {
            local: 'Helsinkiläinen',
            visitor: 'Vierailija',
          },
        },
        interestStep: {
          title: 'Helsinki app',
          question: 'Mitkä aiheet kiinnostavat sinua?',
          options: {
            restaurants: 'Ravintolat',
            movies: 'Elokuvat',
            family: 'Perhe',
            health: 'Terveys',
            cityPlanning: 'Kaupunki-suunnittelu',
            exercise: 'Liikunta',
          },
        },
        profileTab: {
          userType: 'Käyttäjätyyppi',
          interests: 'Kiinnostuksen kohteet',
          restartOnboarding: 'Muuta valintojasi',
          changeLanguage: 'Vaihda kieltä',
        },
      },
    },

    ns: ['common'],
    defaultNS: 'common',

    debug: __DEV__,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
