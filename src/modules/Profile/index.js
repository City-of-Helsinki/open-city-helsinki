/* @flow */
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  NativeModules,
  Alert,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { doAuth, doRefresh } from 'opencityHelsinki/src/utils/auth';
import { isAuthed, loadProfile, updateProfile, deleteProfile } from 'opencityHelsinki/src/profile';
import CardManager from 'opencityHelsinki/src/modules/Profile/CardManager';
import SvgUri from 'react-native-svg-uri';
import Cards from './views/Cards';
import AddCardView from './views/AddCardView';
import CardDetailView from './views/CardDetailView';
import styles from './styles';
import smile from '../../../img/smile.svg';
import ticket from '../../../img/ticket.svg';

class ProfileModule extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      cards: [],
    };
  }

  componentWillMount = () => {
    this.loadCards();
  }

  loadCards = async () => {
    console.warn('loading cards')
    const cards = await NativeModules.HostCardManager.getCards();
    const cManager = new CardManager()
    try {
      const profile = await cManager.setCards(cards);
      this.setState({
        cards: profile.cards,
        profile
      });
    } catch (error) {
      console.warn(error)
    }

  }

  goToCards = async () => {
    try {
      const isUserAuthed = await isAuthed();

      if (isUserAuthed) {

        this.props.navigation.navigate('Cards', {
          cards: this.state.cards,
        });
      } else {
        Alert.alert(
          'Kirjautuminen vaadittu',
          'Sinun on oltava kirjautunut sisään hallitaksesi kortteja.',
          [
            { text: 'Peruuta', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            { text: 'Kirjaudu', onPress: async () => {
              await this.authorize()
              this.props.navigation.navigate('Cards', {
                cards: this.state.cards,
              });
              }
            },
          ],
          { cancelable: false }
        )
      }
    } catch (error) {
      console.warn(error)
    }


  }


  authorize = async () => {
    return new Promise(async (resolve, reject) => {
      const authorization = await doAuth();
      updateProfile(authorization);
      resolve(true)
    })
  }

  render() {
    const { Header } = this.props.screenProps;
    const { cards } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Header />
        <View style={styles.subHeader}><Text style={styles.title}>Tiedot</Text></View>

        <View style={styles.container}>

          <TouchableOpacity
            onPress={() => this.authorize()}
          >
            <View style={styles.menuButton}>
              <View style={styles.buttonIcon}>
                <SvgUri
                  source={smile}
                  // TODO fix color tint
                  // fill='red'
                  width="32"
                  height="32"
                />
              </View>
              <Text style={styles.buttonText}>oma.helsinki</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.goToCards()}
          >
            <View style={styles.menuButton}>
              <View style={styles.buttonIcon}>
                <SvgUri
                  source={ticket}
                  width="32"
                  height="32"
                />
              </View>
              <Text style={styles.buttonText}>Kortit</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

    );
  }
}

const ProfileStack = StackNavigator(
  {
    Profile: {
      screen: ProfileModule,
    },
    Cards: {
      screen: Cards,
    },
    AddCard: {
      screen: AddCardView,
    },
    CardDetail: {
      screen: CardDetailView,
    },
  },
  {
    navigationOptions: {
      header: null,
      gesturesEnabled: false,
    },
  },
);

type ModuleProps = {
  screenProps: { locale: string },
};

class Profile extends React.Component<ModuleProps> {
  componentWillMount() {
    if (this.props.screenProps.locale) {
      changeLanguage(this.props.screenProps.locale);
    }
  }

  componentWillReceiveProps(nextProps: ModuleProps) {
    if (this.props.screenProps.locale !== nextProps.screenProps.locale) {
      changeLanguage(nextProps.screenProps.locale);
    }
  }

  render() {
    return <ProfileStack screenProps={this.props.screenProps} />;
  }
}

export default Profile;
