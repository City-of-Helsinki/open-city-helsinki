/*  @flow */
import React from 'react';
import { translate } from 'react-i18next';
import { withProps } from 'recompose';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { FeedbackModule, configureFeedback, WebViewModule } from 'open-city-modules';
import feedbackConfig from 'src/config/feedbackConfig.json';
import ProfileTab from 'src/components/ProfileTab';
import i18n from 'src/config/translations';

configureFeedback(feedbackConfig);

const iconProvider = (name: string) => ({ tintColor }: { tintColor: string }) => (
  <Icon name={name} size={35} color={tintColor} />
);

const tabs = {

  Feedback: {
    screen: withProps({ showSubHeader: false })(FeedbackModule),
    navigationOptions: () => ({
      title: i18n.t('tabs:feedback'),
      tabBarIcon: iconProvider('history'),
    }),
  },
  Profile: {
    screen: translate('profileTab')(ProfileTab),
    navigationOptions: () => ({
      title: i18n.t('tabs:profile'),
      tabBarIcon: iconProvider('account'),
    }),
  },
};

export default tabs;
