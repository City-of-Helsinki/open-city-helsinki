/* @flow */
import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  NativeModules,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import i18n from 'i18next';
import { NavigationActions } from 'react-navigation';
import { loadProfile } from 'opencityHelsinki/src/profile';
import EStyleSheet from 'react-native-extended-stylesheet';
import colors from 'src/config/colors';
import BackIcon from 'opencityHelsinki/img/arrow_back.png';
import FormInput from 'opencityHelsinki/src/modules/Profile/components/FormInput';
import styles from './styles';

class AddCardView extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: '2 0000 0',
      cardNumberError: false,
      cardPinError: false,
      commonError: '',
      loading: false,
    };
  }

  componentWillMount() {
    this.loadCards();
  }

  loadCards = async () => {
    const profile = await loadProfile();
    if (profile.cards) {
      this.setState({ cards: profile.cards });
    }
  }

  cardNumberChangeListener = (value) => {
    const label = value.replace(/(\d{1})\D?(\d{4})\D?(\d{5})\D?(\d{4})\D?/, '$1 $2 $3 $4')
    this.setState({
      cardNumber: label,
      cardNumberError: false,
      commonError: '',
    });
  }

  validateFields = () => {
    const pin = this.state.firstChar + this.state.secondChar + this.state.thirdChar + this.state.fourthChar;
    const number = this.state.cardNumber.replace(/\s/g, '');
    let errors = false;
    if (number.length !== 14) {
      this.setState({ cardNumberError: true });
      errors = true;
    }

    if (pin.length !== 4) {
      this.setState({ cardPinError: true });
      errors = true;
    }

    if (errors) return false;

    return true;
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  registerCard = (card) => {
    return new Promise(async (resolve, reject) => {
      const url = 'https://api.hel.fi/sso-test/v1/user_identity/';
      try {
        const profile = await loadProfile();
        if (profile.auth) {
          const token = profile.auth.accessToken;

          const body = {
            service: 'helmet',
            identifier: card.cardNumber,
            secret: card.cardPin,
          };

          try {
            const res = await fetch(url, {
              method: 'POST',
              body: JSON.stringify(body),
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });

            if (res.status !== 200 && res.status !== 201) {
              throw new Error('User device registration failed');
            }
            resolve(res);
          } catch (error) {
            reject(error);
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  focusNextField = (nextField) => {
    this.refs[nextField].focus();
  }

  addCard = async () => {
    const pin = this.state.firstChar + this.state.secondChar +
    this.state.thirdChar + this.state.fourthChar;

    this.setState({
      commonError: '',
      loading: true,
    });
    const cardInfo = {
      cardNumber: this.state.cardNumber.replace(/\s/g, ''),
      cardPin: parseInt(pin),
    };
    try {
      await this.registerCard(cardInfo);

      NativeModules.HostCardManager.startNfcService();
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Profile' })],
      });

      NativeModules.HostCardManager.setCardInfo(cardInfo).then((response) => {
        this.setState({
          loading: false,
        });
        ToastAndroid.show(`${i18n.t('customerShip:added')}`, ToastAndroid.SHORT);

        this.props.navigation.dispatch(resetAction);
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
      this.setState({ commonError: `${i18n.t('error:genericCardError')}` });
    }
  }

  renderPinForm() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.pinCodeContainer}>
          <TextInput
            style={styles.pinInput}
            ref={3}
            maxLength={1}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            returnKeyType="next"
            blurOnSubmit={false}
            secureTextEntry
            value={this.state.firstChar}
            onChangeText={(text) => {
              this.setState({
                firstChar: text,
                cardPinError: false,
              });
              if (text.length === 1) this.focusNextField(4);
            }}
          />
        </View>
        <View style={styles.pinCodeContainer}>
          <TextInput
            style={styles.pinInput}
            ref={4}
            maxLength={1}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            returnKeyType="next"
            blurOnSubmit={false}
            secureTextEntry
            value={this.state.secondChar}
            onChangeText={(text) => {
              this.setState({
                secondChar: text,
                cardPinError: false,
              });
              if (text.length === 1) this.focusNextField(5);
              if (text.length === 0) this.focusNextField(3);
            }}
          />
        </View>
        <View style={styles.pinCodeContainer}>
          <TextInput
            style={styles.pinInput}
            ref={5}
            maxLength={1}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            returnKeyType="next"
            blurOnSubmit={false}
            secureTextEntry
            value={this.state.thirdChar}
            onChangeText={(text) => {
              this.setState({
                thirdChar: text,
                cardPinError: false,
              });
              if (text.length === 1) this.focusNextField(6);
              if (text.length === 0) this.focusNextField(4);
            }}
          />
        </View>
        <View style={styles.pinCodeContainer}>
          <TextInput
            style={styles.pinInput}
            ref={6}
            maxLength={1}
            underlineColorAndroid="transparent"
            keyboardType="numeric"
            returnKeyType="next"
            blurOnSubmit={true}
            secureTextEntry
            value={this.state.fourthChar}
            onChangeText={(text) => {
              this.setState({
                fourthChar: text,
                cardPinError: false,
              });
              if (text.length === 0) this.focusNextField(5);
            }}
          />
        </View>
      </View>
    );
  }

  render() {
    const { Header } = this.props.screenProps;

    return (
      <KeyboardAvoidingView style={{ flex: 1 }}>
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
          keyboardShouldPersistTaps
        >
          <View style={styles.container}>
            <Text style={styles.title}>{i18n.t('customerShip:linkLibraryCard')}</Text>
            <Text style={styles.description}>
              {i18n.t('customerShip:linkInfo')}
            </Text>

            <FormInput
              label={i18n.t('customerShip:libraryCardNumber')}
              keyboardType="numeric"
              maxLength={17}
              value={this.state.cardNumber}
              onChangeText={this.cardNumberChangeListener}
              error={this.state.cardNumberError ? `${i18n.t('error:cardNumberError')}` : null}
            />
            <Text style={styles.text}>{i18n.t('customerShip:pin')}</Text>
            {this.renderPinForm()}
            {this.state.cardPinError &&
              <Text style={styles.error}>{i18n.t('error:pinCodeError')}</Text>
            }

            <TouchableOpacity
              disabled={this.state.loading}
              onPress={() => {
                if (this.validateFields()) this.addCard();
              }}
            >
              <View style={styles.button}>
                { this.state.loading &&
                  <ActivityIndicator
                    size={'small'}
                    color={EStyleSheet.value('$colors.med')}
                  />
                }
                { !this.state.loading &&
                  <Text style={styles.buttonText}>{i18n.t('common:continue')}</Text>
                }
              </View>
            </TouchableOpacity>
            <Text style={styles.error}>{this.state.commonError}</Text>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>

    );
  }
}


export default AddCardView;
