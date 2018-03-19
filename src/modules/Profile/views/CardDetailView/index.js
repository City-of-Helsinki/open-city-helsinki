/* @flow */
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  NativeModules,
  Alert,
  Image,
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { doAuth } from 'opencityHelsinki/src/utils/auth';
import { loadProfile, updateProfile, deleteProfile } from 'opencityHelsinki/src/profile';
import colors from 'src/config/colors';
import BackIcon from 'opencityHelsinki/img/arrow_back.png';
import FormInput from 'opencityHelsinki/src/modules/Profile/components/FormInput';
import CardManager from 'opencityHelsinki/src/modules/Profile/CardManager';
import styles from './styles';
import trash from '../../../../../img/trash.png';

class CardDetailView extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      cardNumber: '',
      cardPin: '',
    };
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

  onRemovePress = () => {
    Alert.alert(
      'Korttietojen poistaminen',
      'Oletko varma että haluat poistaa kortin tiedot laitteesta?',
      [
        { text: 'Peruuta', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.removeCard() },
      ],
      { cancelable: false }
    )
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  removeCard = () => {
    const { card } = this.props.navigation.state.params
    const cardInfo = {
      cardNumber: card.cardNumber,
      cardPin: parseInt(card.cardPin),
    };

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Profile' })],
    });

    NativeModules.HostCardManager.removeCard(cardInfo).then((success) => {
      if (success) {
        this.props.navigation.dispatch(resetAction)
      }
    })
  }

  render() {
    const { Header } = this.props.screenProps;
    const { card } = this.props.navigation.state.params
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
          keyboardShouldPersistTaps={true}
          keyboardDismissMode={'on-drag'}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Kirjastokortti</Text>
            <Text style={styles.description}>
              Kirjastokorttisi on nyt liitetty oma.helsinki tunnukseesi ja voit käyttää tätä laitetta kirjastokorttina lähilukua tukevilla palvelupisteillä.
            </Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Kirjastokortin omistaja</Text>
              <Text style={styles.fieldText}>Keijo Käyttäjä</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Kirjastokortin numero</Text>
              <Text style={styles.fieldText}>{card.cardNumber}</Text>
            </View>

            <TouchableOpacity onPress={() => this.onRemovePress()}>
              <View style={styles.button}>
                <Image source={trash} style={{height: 32, width: 32}} />
                <Text style={styles.buttonText}>Unohda korttitiedot</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.link}>{'Lisätiedot ja ohjeet >'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    );
  }
}

export default CardDetailView;
