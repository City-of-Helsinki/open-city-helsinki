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
          logIn: 'Log in',
          cancel: 'Cancel',
          continue: 'Continue',
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
          customerShip: 'Customerships',
          info: 'Info',
          myHelsinki: 'my.helsinki',
          loginRequired: 'Login required',
          cardManageAlert: 'You must be logged in to manage cards.',
        },
        customerShip: {
          added: 'Customership added',
          cards: 'Cards',
          libraryCard: 'Library card',
          libraryCardInfo: 'Your library card has been attached to your my.helsinki -account. You can use this device as a library card at service desks supporting contactless smart cards',
          forgetInfo: 'Forget  card details',
          libraryCardNumber: 'Number of library card',
          infoAndGuide: 'More info and guide',
          cardRemove: 'Removing card info',
          cardRemovePrompt: 'Are you sure you want to remove card info from device?',
          pin: 'PIN code',
          linkLibraryCard: 'Link library card',
          linkInfo: 'You can link different cards which you can use as contactless smart cards.',
        },
        error: {
          genericCardError: 'Something went wrong. Pleace check card details and try again.',
          pinCodeError: 'Length of pin code is 4 digits.',
          cardNumberError: 'Length of library card is 14 digits.',
        },
      },
      fi: {
        common: {
          title: 'Helsinki app common',
          next: 'Seuraava',
          previous: 'Edellinen',
          finish: 'Valmis',
          'city-change-title': 'Avaa toisen kaupungin sovellus',
          logIn: 'Kirjaudu',
          cancel: 'Peruuta',
          continue: 'Jatka',
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
          customerShip: 'Asiakkuudet',
          info: 'Tiedot',
          myHelsinki: 'oma.helsinki',
          loginRequired: 'Kirjautuminen vaadittu',
          cardManageAlert: 'Sinun on oltava kirjautunut sisään hallitaksesi kortteja.',
        },
        customerShip: {
          added: 'Asiakkuus lisätty',
          cards: 'Kortit',
          libraryCard: 'Kirjastokortti',
          libraryCardInfo: 'Kirjastokorttisi on nyt liitetty oma.helsinki tunnukseesi ja voit käyttää tätä laitetta kirjastokorttina lähilukua tukevilla palvelupisteillä.',
          forgetInfo: 'Unohda korttitiedot',
          libraryCardNumber: 'Kirjastokortin numero',
          infoAndGuide: 'Lisätiedot ja ohjeet',
          cardRemove: 'Korttietojen poistaminen',
          cardRemovePrompt: 'Oletko varma että haluat poistaa kortin tiedot laitteesta?',
          pin: 'PIN koodi',
          linkLibraryCard: 'Yhistä kirjastokortti',
          linkInfo: 'Voit yhdistää erilaisia kortteja oma.helsinki-tiliisi jolloin voit käyttää mobiililaitettasi kuin lähiluettava korttia.',
        },
        error: {
          genericCardError: 'Jokin meni pieleen, tarkista kortin tiedot ja yritä uudelleen.',
          pinCodeError: 'Pin-koodi on 4 merkkiä pitkä.',
          cardNumberError: 'Kortin numero on 14 merkkiä pitkä.',
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
