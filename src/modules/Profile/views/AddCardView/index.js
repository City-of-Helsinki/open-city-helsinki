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
  NativeModules
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { doAuth } from 'opencityHelsinki/src/utils/auth';
import { loadProfile, updateProfile, deleteProfile } from 'opencityHelsinki/src/profile';
import colors from 'src/config/colors';
import BackIcon from 'opencityHelsinki/img/arrow_back.png';
import FormInput from 'opencityHelsinki/src/modules/Profile/components/FormInput';
import CardManager from 'opencityHelsinki/src/modules/Profile/CardManager';
import styles from './styles';

class AddCardView extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: '',
      cardPin: '',
      cardNumberError: false,
      cardPinError: false,
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
    })
  }

  cardPinChangeListener = (value) =>{
    this.setState({
      cardPin: value,
      cardPinError: false,
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

  addCard = async () => {
    console.warn('adding card')
    const cardInfo = {
      cardNumber: this.state.cardNumber,
      cardPin: parseInt(this.state.cardPin),
    };

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Profile' })],
    });

    NativeModules.HostCardManager.setCardInfo(cardInfo).then((response) => {
      console.warn(response);
      NativeModules.HostCardManager.startNfcService();
      this.props.navigation.dispatch(resetAction)
    })
    // const cardManager = new CardManager();
    // const card = await cardManager.addCard(this.state.cardNumber, this.state.cardPin, 'library')
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
            onChangeText={this.cardNumberChangeListener}
            error={this.state.cardNumberError ? 'Kortin numero on 14 merkkiä pitkä.' : null}
          />

          <FormInput
            keyboardType='numeric'
            secureTextEntry
            label={'PIN koodi'}
            onChangeText={this.cardPinChangeListener}
            error={this.state.cardPinError ? 'Pin-koodi on 4 merkkiä pitkä.' : null}
          />

          <TouchableOpacity onPress={() => {
            if (this.validateFields()) this.addCard()
          }}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Jatka</Text>
            </View>
          </TouchableOpacity>

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
