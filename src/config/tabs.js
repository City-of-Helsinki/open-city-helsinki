/*  @flow */
import React from 'react';
import { Image } from 'react-native';
import { translate } from 'react-i18next';
import { withProps } from 'recompose';
import i18n from 'i18next';
import { FeedbackModule, configureFeedback, WebViewModule, HomeViewModule, configureHomeView } from 'open-city-modules';
import feedbackConfig from 'src/config/feedbackConfig.json';
import homeviewConfig from 'src/config/homeviewConfig.json';
import Profile from 'src/modules/Profile';
import home from '../../img/home.png';
import pencil from '../../img/pencil.png';
import profile from '../../img/profile.png';
import CardImage from '../../img/hand_card.png';
import colors from 'src/config/colors';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import i18n from 'src/config/translations';


const defaultPromotions = [
  {
    id: 'prom_001',
    title: 'Kirjastokortti puhelimeen',
    body: 'Voit käyttää nyt puhelimesi lähilukuominaisuutta kirjastokorttina',
    image: CardImage,
    footer: 'Ota kirjastokortti käyttöön',
    bgColor: colors.tram,
    textColor: 'white',
    targetTab: 'Profile',
  },
  {
    id: 'prom_002',
    title: 'Kuoppa tiessä?',
    body: 'Anna palautetta kaupungille ja seuraa asiasi etenemistä kartalla',
    image: pencil,
    bgColor: colors.suomenlinna,
    textColor: 'white',
    targetTab: 'Feedback',
  },
];

configureFeedback(feedbackConfig);

configureHomeView(homeviewConfig, null, defaultPromotions);


const tabs = {
  HomeView: {
    screen: withProps({})(HomeViewModule),
    navigationOptions: () => ({
      tabBarIcon: ({ focused, tintColor }) => (<Image source={home} resizeMode='contain' style={{ height: 24, width: 24, tintColor: tintColor, marginTop: 8 }} />),
      tabBarLabel: `${i18n.t('tabs:home')}`,
    }),
  },
  Feedback: {
    screen: withProps({ showSubHeader: false })(FeedbackModule),
    navigationOptions: () => ({
      tabBarIcon: ({ focused, tintColor }) => (<Image source={pencil} resizeMode='contain' style={{ height: 24, width: 24, tintColor: tintColor, marginTop: 8 }} />),
      tabBarLabel: `${i18n.t('tabs:feedback')}`,
    }),
  },
  Profile: {
    screen: translate('profileTab')(Profile),
    navigationOptions: () => ({
      tabBarIcon: ({ focused, tintColor }) => (<Image source={profile} resizeMode='contain' style={{ height: 24, width: 24, tintColor: tintColor, marginTop: 8 }} />),
      tabBarLabel: `${i18n.t('tabs:profile')}`,
    }),
  },
};

export default tabs;
