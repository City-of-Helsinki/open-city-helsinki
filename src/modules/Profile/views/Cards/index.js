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
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { doAuth } from 'opencityHelsinki/src/utils/auth';
import { loadProfile, updateProfile, deleteProfile } from 'opencityHelsinki/src/profile';
import colors from 'src/config/colors';
import BackIcon from 'opencityHelsinki/img/arrow_back.png';

class Cards extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
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

  goBack = () => {
    this.props.navigation.goBack();
  }

  render() {
    const { Header } = this.props.screenProps;

    return (
      <View style={{flex: 1}}>
        <Header
          leftAction={{
            icon: BackIcon,
            action: this.goBack,
            style: {
              tintColor: colors.max
            }
          }}
        />
        <View style={styles.subHeader}><Text style={styles.title}>Tiedot / Kortit</Text></View>
        <View style={styles.container}>
          <Text style={styles.description}>
            Voit yhdistää erilaisia kortteja oma.helsinki-tiliisi jolloin voit käyttää mobiililaitettasi kuin lähiluettava korttia.
          </Text>

          { this.state.cards.map((card) => {
            return(
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('AddCard')}
                >
                <View style={styles.connectButton}>
                  <View style={styles.buttonIcon}></View>
                  <Text style={styles.buttonText}>{card.cardNumber}</Text>
                </View>
              </TouchableOpacity>
            )
            })
          }

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('AddCard')}
            >
            <View style={styles.connectButton}>
              <View style={styles.buttonIcon}></View>
              <Text style={styles.buttonText}>Yhdistä kirjastokortti</Text>
            </View>
          </TouchableOpacity>



        </View>
      </View>

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
    color: colors.min,
    fontSize: 24,
  },
  container: {
    padding: 20,
    backgroundColor: colors.min,
    flex: 1,
  },
  button: {
    marginVertical: 20,
  },
  changeLanguage: {
    alignSelf: 'stretch',
  },
});

export default Cards;
