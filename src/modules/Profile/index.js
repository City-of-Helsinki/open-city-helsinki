/* @flow */
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  NativeModules,
  Alert,
  Image,
  ActivityIndicator,
  ToastAndroid
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';
import { doAuth, doRefresh } from 'opencityHelsinki/src/utils/auth';
import { isAuthed, loadProfile, updateProfile, deleteProfile } from 'opencityHelsinki/src/profile';
import { setCards } from 'opencityHelsinki/src/modules/Profile/CardManager';
import Cards from './views/Cards';
import AddCardView from './views/AddCardView';
import CardDetailView from './views/CardDetailView';
import styles from './styles';
import smile from '../../../img/smile.png';
import ticket from '../../../img/ticket.png';
import {
  registerDevice,
} from 'opencityHelsinki/src/utils/authentication_keys';

class ProfileModule extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      cards: [],
      loading: false,
    };
  }

  componentWillMount = () => {
    this.loadCards();
  }

  loadCards = async () => {
    console.warn('loading cards')
    const cards = await NativeModules.HostCardManager.getCards();
    try {

      const profile = await setCards(cards);
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
    try {
      this.setState({ loading: true })

      return new Promise(async (resolve, reject) => {
        doAuth().then((authorization) => {
          registerDevice(authorization.auth.accessToken).then(
            () => {
              this.setState({ loading: false })
              updateProfile(authorization).then((success) => {
                resolve(true)
              }, (error) => {
                reject(new Error("Failed updating profile"));
              });
            },
            () => {
              reject(new Error('Failed registering device.'))
            });
        }, (error) => {
          this.setState({ loading: false })
          reject(error)
        });
      })
    } catch (error) {
      this.setState({ loading: false })
      console.log(error)
      reject(error)
    }
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
            disabled={this.state.loading}
            onPress={async () => {
              try {
                const result = await this.authorize();
                if (result) {
                  ToastAndroid.show('Tunnistautuminen onnistui', ToastAndroid.SHORT);
                }
              } catch (error) {
                ToastAndroid.show('Tunnistautuminen epäonnistui', ToastAndroid.SHORT);
              }
            }}
          >
            <View style={styles.menuButton}>
              <View style={styles.buttonIcon}>
                <Image
                  style={{height: 32, width: 32}}
                  source={smile}
                  // TODO fix color tint
                  // fill='red'
                />
              </View>
              <Text style={styles.buttonText}>oma.helsinki</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.loading}
            onPress={() => this.goToCards()}
          >
            <View style={styles.menuButton}>
              <View style={styles.buttonIcon}>
                <Image
                  source={ticket}
                  style={{height: 32, width: 32}}
                />
              </View>
              <Text style={styles.buttonText}>Kortit</Text>
            </View>
          </TouchableOpacity>
        </View>
        { this.state.loading &&
          <View style={styles.loading}>
            <ActivityIndicator
              size={'large'}
              color={EStyleSheet.value('$colors.med')}
            />
          </View>
        }
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
