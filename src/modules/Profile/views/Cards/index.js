/* @flow */
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import i18n from 'i18next';
import { loadProfile } from 'opencityHelsinki/src/profile';
import colors from 'src/config/colors';
import BackIcon from 'opencityHelsinki/img/arrow_back.png';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import styles from './styles';

class Cards extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      cards: this.props.navigation.state.params ? this.props.navigation.state.params.cards : [],
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

            { this.state.cards.map((card) => {
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
            {!this.state.cards[0] &&
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
