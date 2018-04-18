/* @flow */
import React, { Component } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import i18n from 'i18next';
import { NavigationActions } from 'react-navigation';
import colors from 'src/config/colors';
import BackIcon from 'Helsinki/img/arrow_back.png';
import styles from '../styles';

class CardUsage extends Component {

  goBack = () => {
    this.props.navigation.goBack();
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
          style={{ flex: 1, backgroundColor: colors.min }}
        >
          {/* <View style={styles.container}> */}
            <View style={styles.row}>
              <Text style={styles.bulletPoint}>1.</Text>
              <Text style={styles.infoTitle}>{i18n.t('info:phoneUsage')}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.bulletPoint}>2.</Text>
              <Text style={styles.infoTitle}>{i18n.t('info:borrowing')}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.bulletPoint}>3.</Text>
              <Text style={styles.infoTitle}>{i18n.t('info:followOrders')}</Text>
            </View>
          {/* </View> */}
        </ScrollView>
      </View>
    );
  }
}


export default CardUsage;
