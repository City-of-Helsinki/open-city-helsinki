/* @flow */
import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Linking,
} from 'react-native';
import i18n from 'i18next';
import { NavigationActions } from 'react-navigation';
import colors from 'src/config/colors';
import BackIcon from 'Helsinki/img/arrow_back.png';
import styles from '../styles';

class AboutApp extends Component {

  goBack = () => {
    this.props.navigation.goBack();
  }

  handleClick = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Can't open url " + url);
      }
    });
  }

  render() {
    const { Header } = this.props.screenProps;

    return (
      <View style={{ flex: 1 }}>
        <Header
          leftAction={{
            icon: BackIcon,
            action: this.goBack,
            style: {
              tintColor: colors.max,
            },
          }}
        />

        <ScrollView
          style={{
            flex: 1,
            backgroundColor: colors.min,
            padding: 20,
          }}
        >
          <Text style={styles.title}>{i18n.t('profileTab:appInfo')}</Text>
            <View style={styles.row}>
              <Text style={styles.infoTitle}>{i18n.t('info:appInfo')}</Text>
            </View>
            <View style={styles.row}>
              <Text
                style={styles.linkTitle}
                onPress={() => {
                  this.handleClick('https://digi.hel.fi/helsinki-app-privacy-policy/')
                }}
              >
                {i18n.t('info:privacyPolicy') + ' >'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text
                style={styles.linkTitle}
                onPress={() => {
                  this.handleClick('https://github.com/City-of-Helsinki/open-city-helsinki')
                }}
              >
                {i18n.t('info:sourceCode') + ' >'}
              </Text>
            </View>
        </ScrollView>
      </View>
    );
  }
}


export default AboutApp;
