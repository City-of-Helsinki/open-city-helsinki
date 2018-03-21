/* @flow */
import * as React from 'react';
import {
  View,
  Text,
  Button,
  Picker,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  NativeModules,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { doAuth } from 'opencityHelsinki/src/utils/auth';
import { loadProfile, updateProfile, deleteProfile } from 'opencityHelsinki/src/profile';
import EStyleSheet from 'react-native-extended-stylesheet';
import colors from 'src/config/colors';
import BackIcon from 'opencityHelsinki/img/arrow_back.png';
import FormInput from 'opencityHelsinki/src/modules/Profile/components/FormInput';
import CardManager from 'opencityHelsinki/src/modules/Profile/CardManager';
import styles from './styles';
import { makeRequest } from 'opencityHelsinki/src/utils/requests';

class AddCardView extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: '200000',
      cardPin: '',
      cardNumberError: false,
      cardPinError: false,
      commonError: '',
      loading: false,
    }
  }

  componentWillMount() {
    this.loadCards();

  }

  loadCards = async () => {
    const profile = await loadProfile();
    if (profile.cards) {
      this.setState({ cards: profile.cards })
    }
    console.warn(profile)
  }

  cardNumberChangeListener = (value) =>{
    this.setState({
      cardNumber: value,
      cardNumberError: false,
      commonError: '',
    })
  }

  cardPinChangeListener = (value) =>{
    this.setState({
      cardPin: value,
      cardPinError: false,
      commonError: '',
    })
  }

  validateFields = () => {
    let errors = false;
    if (this.state.cardNumber.length !== 14) {
      this.setState({ cardNumberError: true })
      errors = true;
    }

    if (this.state.cardPin.length !== 4) {
      this.setState({ cardPinError: true })
      errors = true;
    }

    if (errors) return false;

    return true;
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  registerCard = (card) => {
    console.warn(card)
    return new Promise(async (resolve, reject) => {
      const url = 'https://api.hel.fi/sso-test/v1/user_identity/';
      try {
        const profile = await loadProfile();
        if (profile.auth) {
          const token = profile.auth.accessToken;

          let body = {
            service: 'helmet',
            identifier: card.cardNumber,
            secret: card.cardPin
          }

          try {
            console.warn("fetching...")
            let res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                  Authorization: `Bearer ${token}`
                },
            });

            if (res.status != 200 && res.status != 201) {
                throw new Error("User device registration failed");
            }
            resolve(res);
          } catch (error) {
            reject(error)
          }
        }
      } catch (error) {
        reject(error);
      }
    })
  }

  addCard = async () => {
    this.setState({
      commonError: '',
      loading: true
    })
    console.warn('adding card')
    const cardInfo = {
      cardNumber: this.state.cardNumber,
      cardPin: parseInt(this.state.cardPin),
    };
    try {
      await this.registerCard(cardInfo)

      NativeModules.HostCardManager.startNfcService();
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Profile' })],
      });

      NativeModules.HostCardManager.setCardInfo(cardInfo).then((response) => {
        console.warn(response);
        this.setState({
          loading: false
        })
        ToastAndroid.show('Kortti lisätty', ToastAndroid.SHORT);

        this.props.navigation.dispatch(resetAction)
      })
    } catch (error) {
      this.setState({
        loading: false
      })
      this.setState({ commonError: 'Jokin meni pieleen, tarkista kortin tiedot ja yritä uudelleen.' })
    }
  }

  render() {
    const { Header } = this.props.screenProps;

    return (
      <KeyboardAvoidingView style={{flex: 1}}>
        <Header
          leftAction={{
            icon: BackIcon,
            action: this.goBack,
            style: {
              tintColor: colors.max
            }
          }}
        />

        <ScrollView
          style={{flex: 1, backgroundColor: colors.min,}}
          keyboardShouldPersistTaps
        >
        <View style={styles.container}>
          <Text style={styles.title}>Yhdistä kirjastokortti</Text>
          <Text style={styles.description}>
            Yhdistämällä kirjastokorttisi oma.helsinki tiliisi voit käyttää laitettasi lähiluettavana kirjastokorttina kirjastojen itsepalvelupisteillä.
          </Text>

          <FormInput
            label={'Kirjastokortin numero'}
            keyboardType='numeric'
            value={this.state.cardNumber}
            onChangeText={this.cardNumberChangeListener}
            error={this.state.cardNumberError ? 'Kortin numero on 14 merkkiä pitkä.' : null}
          />

          <FormInput
            keyboardType='numeric'
            secureTextEntry
            value={this.state.cardPin}
            label={'PIN koodi'}
            onChangeText={this.cardPinChangeListener}
            error={this.state.cardPinError ? 'Pin-koodi on 4 merkkiä pitkä.' : null}
          />

          <TouchableOpacity
            disabled={this.state.loading}
            onPress={() => {
              if (this.validateFields()) this.addCard()
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
                <Text style={styles.buttonText}>Jatka</Text>
              }
            </View>
          </TouchableOpacity>
          <Text style={styles.error}>{this.state.commonError}</Text>
          <TouchableOpacity>
            <Text style={styles.link}>Lisätiedot ja ohjeet ></Text>
          </TouchableOpacity>


        </View>
        </ScrollView>

      </KeyboardAvoidingView>

    );
  }
}


export default AddCardView;
