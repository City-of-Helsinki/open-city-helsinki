/* @flow */
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  NativeModules,
  DeviceEventEmitter
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { doAuth } from 'opencityHelsinki/src/utils/auth';
import { loadProfile, updateProfile, deleteProfile } from 'opencityHelsinki/src/profile';
import CardManager from 'opencityHelsinki/src/modules/Profile/CardManager';
import SvgUri from 'react-native-svg-uri';
import Cards from './views/Cards';
import AddCardView from './views/AddCardView';
import CardDetailView from './views/CardDetailView';
import styles from './styles';
import smile from '../../../img/smile.svg';
import ticket from '../../../img/ticket.svg';

function randomFunction(stuff) {
  console.warn('calling random function with ' + stuff);
}

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
    NativeModules.HostCardManager.initializeJWTGenerator(randomFunction);
    const cManager = new CardManager()
    const profile = await cManager.setCards(cards);
    console.warn(profile)
    this.setState({
      cards,
      profile,
    });
  }


  authorize = async () => {
    const authorization = await doAuth();
    console.warn("authorization " + authorization)
    updateProfile(authorization);
  }

  render() {
    const { Header } = this.props.screenProps;

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
            onPress={() => {
              this.props.navigation.navigate('Cards', {
              });
            }}
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
