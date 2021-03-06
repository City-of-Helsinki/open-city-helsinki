/* @flow */
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  UIManager,
  LayoutAnimation
} from 'react-native';
import i18n from 'i18next';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { doAuth } from 'Helsinki/src/utils/auth';
import { fetchRegisteredCards } from 'src/modules/Profile/CardManager';
import { loadProfile, updateProfile, deleteProfile } from 'Helsinki/src/profile';
import colors from 'src/config/colors';
import BackIcon from 'Helsinki/img/arrow_back.png';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';

class Cards extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

    this.state = {
      loading: true,
      cards: (props.navigation.state.params && props.navigation.state.params.cards)
        ? props.navigation.state.params.cards
        : [],
    };
  }

  componentDidMount() {
    const { cards } = this.props.navigation.state.params;
    if (!cards || cards.length === 0) {
      this.loadCards()
    } else {
      this.setState({
        loading: false,
      })
    }
  }

  loadCards = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    try {
      let { profile } = this.props.navigation.state.params;
      if (!profile) profile = await loadProfile();
      const newProfile = await fetchRegisteredCards(profile)
      this.setState({
        cards: newProfile.cards,
        profile: newProfile,
        loading: false,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
      console.log(error)
    }
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    const { Header } = this.props.screenProps;

    return (
      <View style={styles.container}>
        {!!Header &&
          <Header
            leftAction={{
              icon: BackIcon,
              action: this.goBack,
              style: {
                tintColor: colors.max,
              },
            }}
          />
        }
        <Text style={styles.title}>
          {i18n.t('profileTab:customerShip')}
        </Text>

        <ScrollView>
          <View style={styles.scrollViewContainer}>
            <Text style={styles.description}>
              {i18n.t('customerShip:linkInfo')}
            </Text>

            { !this.state.loading && this.state.cards.map((card) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('CardDetail', {
                        card,
                        profile: this.state.profile,
                        cards: this.state.cards,
                        refresh: () => this.loadCards()
                      });
                    }}
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
            {/* TODO proper card handling by cardType when several cards are supported */}
            { !this.state.loading && !this.state.cards[0] &&
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('AddCard', {
                  profile: this.state.profile,
                  cards: this.state.cards,
                })}
              >
                <View style={styles.card}>
                  <View style={styles.buttonIcon}>
                    <Icon name="add-circle-outline" size={24} color="black" />
                  </View>
                  <Text
                    style={styles.cardText}
                  >
                      {i18n.t('customerShip:linkLibraryCard')}
                  </Text>

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
