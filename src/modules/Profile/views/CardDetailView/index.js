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
import { NavigationActions } from 'react-navigation';
import i18n from 'i18next';
import { loadProfile } from 'opencityHelsinki/src/profile';
import { removeCardFromTunnistamo } from 'src/modules/Profile/CardManager';
import colors from 'src/config/colors';
import BackIcon from 'opencityHelsinki/img/arrow_back.png';
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

  cardPinChangeListener = (value) => {
    this.setState({ cardPin: value });
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
      `${i18n.t('customerShip:cardRemove')}`,
      `${i18n.t('customerShip:cardRemovePrompt')}`,
      [
        { text: `${i18n.t('common:cancel')}`, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => this.removeCard() },
      ],
      { cancelable: false },
    );
  }

  cardNumberChangeListener = (value) => {
    this.setState({ cardNumber: value });
  }

  loadCards = async () => {
    const profile = await loadProfile();
    if (profile.cards) {
      this.setState({ cards: profile.cards });
    }
    console.warn(profile);
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  removeCard = async () => {
    try {
      const { card } = this.props.navigation.state.params;
      const cardInfo = {
        cardNumber: card.cardNumber,
        cardPin: parseInt(card.cardPin),
      };
      await removeCardFromTunnistamo(card);
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Profile' })],
      });

      NativeModules.HostCardManager.removeCard(cardInfo).then(async (success) => {
        if (success) {
          this.props.navigation.dispatch(resetAction);
        }
      });
    } catch (error) {
      console.warn(error)
    }
  }

  render() {
    const { Header } = this.props.screenProps;
    const { card } = this.props.navigation.state.params;
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
            <Text style={styles.title}>{i18n.t('customerShip:libraryCard')}</Text>
            <Text style={styles.description}>
              {i18n.t('customerShip:libraryCardInfo')}
            </Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>{i18n.t('customerShip:libraryCardNumber')}</Text>
              <Text style={styles.fieldText}>{card.cardNumber}</Text>
            </View>

            <TouchableOpacity onPress={() => this.onRemovePress()}>
              <View style={styles.button}>
                <Image source={trash} style={{ height: 32, width: 32 }} />
                <Text style={styles.buttonText}>{i18n.t('customerShip:forgetInfo')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.link}>{`${i18n.t('customerShip:infoAndGuide')} >`}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default CardDetailView;
