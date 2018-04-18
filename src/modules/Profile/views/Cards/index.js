/* @flow */
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import i18n from 'i18next';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { doAuth } from 'opencityHelsinki/src/utils/auth';
import { fetchRegisteredCards } from 'src/modules/Profile/CardManager';
import { loadProfile, updateProfile, deleteProfile } from 'opencityHelsinki/src/profile';
import colors from 'src/config/colors';
import BackIcon from 'opencityHelsinki/img/arrow_back.png';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';

class Cards extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      cards: this.props.navigation.state.params ? this.props.navigation.state.params.cards : [],
    };
  }

  componentWillMount() {
    const { cards } = this.props.navigation.state.params;
    console.warn(cards)
    if (!cards || cards.length === 0) {
      this.loadCards()
    } else {
      this.setState({
        loading: false,
      })
    }
  }

  loadCards = async () => {
    // const profile = await loadProfile();
    // if (profile.cards) {
    //   this.setState({ cards: profile.cards });
    // }

    try {
      let { profile } = this.props.navigation.state.params;
      if (!profile) profile = await loadProfile();
      const newProfile = await fetchRegisteredCards(profile)
      this.setState({
        cards: newProfile.cards,
        profile: newProfile,
        loading: false,
      });
      // this.setState({ cards: profile.cards })
    } catch (error) {
      this.setState({
        loading: false,
      });
      console.warn(error)
    }
  }

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
        <View style={styles.subHeader}><Text style={styles.title}>{i18n.t('profileTab:info') + ' / ' + i18n.t('customerShip:cards')}</Text></View>
        <ScrollView style={{ flex: 1, backgroundColor: '#94C2E8' }}>
          <View style={styles.container}>
            <Text style={styles.description}>
              {i18n.t('customerShip:linkInfo')}
            </Text>

            { this.state.loading &&
              <View style={{ marginTop: 32, }}>
                <ActivityIndicator
                  size='large'
                  color={EStyleSheet.value('$colors.med')}
                />
              </View>
            }

            { !this.state.loading && this.state.cards.map((card) => {
                return (
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('CardDetail', {
                      card,
                    })}
                  >
                    <View style={styles.card}>
                      <View style={styles.buttonIcon}>
                        <Icon name="credit-card" size={32} color="black" />
                      </View>
                      <Text style={styles.cardText}>{i18n.t('customerShip:libraryCard')}</Text>
                      {!card.cardPin &&
                        <View style={styles.buttonIcon}>
                          <Icon name="error-outline" size={32} color="red" />
                        </View>
                      }
                    </View>
                  </TouchableOpacity>
                );
              })
            }
            {/* TODO proper card hangling by cardType when several cards are supported */}
            { !this.state.loading && !this.state.cards[0] &&
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('AddCard')}
              >
                <View style={styles.connectButton}>
                  <View style={styles.buttonIcon}>
                    <Icon name="add-circle-outline" size={24} color="white" />
                  </View>
                  <Text style={styles.buttonText}>{i18n.t('customerShip:linkLibraryCard')}</Text>
                  <View style={styles.buttonIcon}>
                    <Icon name="add-circle-outline" size={24} color="white" />
                  </View>
                </View>
              </TouchableOpacity>
            }
          </View>
        </ScrollView>
      </View>

    );
  }
}

export default Cards;
