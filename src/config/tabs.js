/*  @flow */
import React from 'react';
import { translate } from 'react-i18next';
import { withProps } from 'recompose';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SvgUri from 'react-native-svg-uri';
import { FeedbackModule, configureFeedback, WebViewModule, HomeViewModule } from 'open-city-modules';
import feedbackConfig from 'src/config/feedbackConfig.json';
import Profile from 'src/modules/Profile';
// import i18n from 'src/config/translations';
import home from '../../img/home.svg';
import pencil from '../../img/pencil.svg';
import profile from '../../img/profile.svg';

configureFeedback(feedbackConfig);

const tabs = {
  HomeView: {
    screen: withProps({})(HomeViewModule),
    navigationOptions: () => ({
      tabBarIcon: () => (<SvgUri source={home} width="32" height="32" />),
    }),
  },
  Feedback: {
    screen: withProps({ showSubHeader: false })(FeedbackModule),
    navigationOptions: () => ({
      tabBarIcon: () => (<SvgUri source={pencil} width="32" height="32" />),
    }),
  },
  Profile: {
    screen: translate('profileTab')(Profile),
    navigationOptions: () => ({
      tabBarIcon: () => (<SvgUri source={profile} width="32" height="32" />),
    }),
  },
};

export default tabs;
