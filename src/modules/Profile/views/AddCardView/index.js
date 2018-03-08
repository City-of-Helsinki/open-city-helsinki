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
import { StackNavigator } from 'react-navigation';
import { doAuth } from 'opencityHelsinki/src/utils/auth';
import { loadProfile, updateProfile, deleteProfile } from 'opencityHelsinki/src/profile';
import colors from 'src/config/colors';
import BackIcon from 'opencityHelsinki/img/arrow_back.png';
import FormInput from 'opencityHelsinki/src/modules/Profile/components/FormInput';
import CardManager from 'opencityHelsinki/src/modules/Profile/CardManager';

class AddCardView extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: '',
      cardPin: '',
    }
  }

  componentWillMount() {
    this.loadCards();
    NativeModules.HostCardManager.getCards().then((response) => {
      console.warn(response)
    })
  }

  loadCards = async () => {
    const profile = await loadProfile();
    if (profile.cards) {
      this.setState({ cards: profile.cards })
    }
    console.warn(profile)
  }

  cardNumberChangeListener = (value) =>{
    this.setState({ cardNumber: value })
  }

  cardPinChangeListener = (value) =>{
    this.setState({ cardPin: value })
  }

  validateFields = () => {
    if (this.state.cardNumber.length <= 0 ||
      this.state.cardPin.length <= 0) {
      return false;
    }

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

    NativeModules.HostCardManager.setCardInfo(cardInfo).then((response) => {
      console.warn(response);
      if (response === true) {
        NativeModules.HostCardManager.startNfcService().then((response) => {
          console.warn(response)
        });
      }
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

        <ScrollView style={{flex: 1, backgroundColor: colors.min,}}>
        <View style={styles.container}>
          <Text style={styles.title}>Yhdistä kirjastokortti</Text>
          <Text style={styles.description}>
            Yhdistämällä kirjastokorttisi oma.helsinki tiliisi voit käyttää laitettasi lähiluettavana kirjastokorttina kirjastojen itsepalvelupisteillä.
          </Text>

          <FormInput
            label={'Kirjastokortin numero'}
            keyboardType='numeric'
            onChangeText={this.cardNumberChangeListener}
          />

          <FormInput
            keyboardType='numeric'
            secureTextEntry
            label={'PIN koodi'}
            onChangeText={this.cardPinChangeListener}
          />

          <TouchableOpacity onPress={() => this.addCard()}>
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

styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: colors.max,
  },
  description: {
    fontSize: 20,
    color: colors.max,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginVertical: 16,
    color: colors.max,
  },
  subHeader: {
    backgroundColor: 'gray',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  menuButton: {
    flexDirection: 'row',
    backgroundColor: colors.med,
    padding: 16,
    marginVertical: 4,
  },
  connectButton: {
    flexDirection: 'row',
    backgroundColor: colors.med,
    padding: 16,
    marginVertical: 16,
    marginHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: colors.max,
    fontSize: 20,
    padding: 16,
    fontWeight: 'bold'
  },
  container: {
    padding: 20,
    backgroundColor: colors.min,
    flex: 1,
  },
  button: {
    marginVertical: 20,
    borderWidth: 2,
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  link: {
    color: 'royalblue',
    fontWeight: 'bold',
    fontSize: 16,
  },
  changeLanguage: {
    alignSelf: 'stretch',
  },
});

export default AddCardView;
