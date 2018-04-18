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
  ToastAndroid,
} from 'react-native';
import {
  registerDevice,
} from 'opencityHelsinki/src/utils/authentication_keys';
import { StackNavigator } from 'react-navigation';
import i18n from 'i18next';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  doAuth,
  // doRefresh,
} from 'opencityHelsinki/src/utils/auth';
import {
  isAuthed,
  loadProfile,
  updateProfile,
  // deleteProfile
} from 'opencityHelsinki/src/profile';
import { fetchRegisteredCards } from 'src/modules/Profile/CardManager';
import Cards from './views/Cards';
import AddCardView from './views/AddCardView';
import CardDetailView from './views/CardDetailView';
import ProfileDetailView from './views/ProfileDetailView';
import CardUsage from './views/CardUsage';
import AboutApp from './views/AboutApp';
import styles from './styles';
import smile from '../../../img/smile.png';
import ticket from '../../../img/ticket.png';
import globe from '../../../img/globe.png';

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
  }

  onAuthPressed = async () => {

    isAuthed().then(async (authed) => {
      this.setState({ profile: authed.profile })
      if (authed.isAuthed && authed.profile) {
        this.props.navigation.navigate('ProfileDetail', {
          profile: authed.profile,
        });
      } else if (!authed) {
        // try {
          const result = await this.authorize();
          if (result) {
            ToastAndroid.show('Tunnistautuminen onnistui', ToastAndroid.SHORT);
          }
        // } catch (error) {
        //   ToastAndroid.show('Tunnistautuminen epäonnistui', ToastAndroid.SHORT);
        // }
      }
    },
    async (error) => {
      try {
        const result = await this.authorize();
        if (result) {
          ToastAndroid.show('Tunnistautuminen onnistui', ToastAndroid.SHORT);
        }
      } catch (error) {
        ToastAndroid.show('Tunnistautuminen epäonnistui', ToastAndroid.SHORT);
      }    });
  }

  loadCards = async (profile) => {
    return new Promise(async (resolve, reject) => {
      try {
        let mProfile = profile;
        if (!mProfile) mProfile = await loadProfile();
        const newProfile = await fetchRegisteredCards(mProfile);
        this.setState({ cards: newProfile.cards, profile: newProfile });
        resolve(newProfile)
      } catch (error) {
        reject(error)
      }
    });
  }

  goToCards = async () => {
    try {
      const isUserAuthed = await isAuthed();

      if (isUserAuthed.isAuthed) {
        // const result = await this.loadCards(isUserAuthed.profile);

        this.props.navigation.navigate('Cards', {
          // cards: result.cards,
          profile: isUserAuthed.profile,
        });
      } else {
        Alert.alert(
          `${i18n.t('profileTab:loginRequired')}`,
          `${i18n.t('profileTab:cardManageAlert')}`,
          [
            { text: `${i18n.t('common:cancel')}`, onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
            {
              text: `${i18n.t('common:logIn')}`,
              onPress: async () => {
                const mProfile = await this.authorize();
                // const result = await this.loadCards(mProfile).cards;

                this.props.navigation.navigate('Cards', {
                  // cards: result.cards,
                  profile: mProfile,
                });
              },
            },
          ],
          { cancelable: false },
        );
      }
    } catch (error) {

      console.warn(error);
    }
  }

  goToInfo = () => {
    this.props.navigation.navigate('AboutApp');
  }

  authorize = async () => {
    try {
      this.setState({ loading: true });

      return new Promise(async (resolve, reject) => {
        doAuth().then((authorization) => {
          registerDevice(authorization.auth.accessToken).then(
            () => {
              this.setState({ loading: false });
              updateProfile(authorization).then((profile) => {
                this.setState({ profile })
                resolve(profile);
              }, (error) => {
                reject(new Error('Failed updating profile'));
              });
            },
            () => {
              reject(new Error('Failed registering device.'));
            },
          );
        }, (error) => {
          this.setState({ loading: false });
          reject(error);
        });
      });
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
      reject(error);
    }
  }

  render() {
    const { Header } = this.props.screenProps;

    return (
      <View style={{ flex: 1 }}>
        <Header />
        <View style={styles.subHeader}><Text style={styles.title}>{i18n.t('profileTab:info')}</Text></View>

        <View style={styles.container}>

          <TouchableOpacity
            disabled={this.state.loading}
            onPress={() => this.onAuthPressed()}
          >
            <View style={styles.menuButton}>
              <Image
                style={styles.buttonIcon}
                source={smile}
                // TODO fix color tint
              />
              <Text style={styles.buttonText}> {i18n.t('profileTab:myHelsinki')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.loading}
            onPress={() => this.goToCards()}
          >
            <View style={styles.menuButton}>
              <Image
                source={ticket}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>{i18n.t('profileTab:customerShip')}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.loading}
            onPress={() => this.goToInfo()}
          >
            <View style={styles.menuButton}>
              <Image
                source={globe}
                style={styles.buttonIcon}
              />
              <Text
                numberOfLines={2}
                ellipsizeMode="middle"
                style={styles.buttonText}
              >
                {i18n.t('profileTab:appInfo')}
              </Text>
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
    ProfileDetail: {
      screen: ProfileDetailView,
    },
    CardInfoScreen: {
      screen: CardUsage,
    },
    AboutApp: {
      screen: AboutApp,
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
      i18n.changeLanguage(this.props.screenProps.locale);
    }
  }

  componentWillReceiveProps(nextProps: ModuleProps) {
    if (this.props.screenProps.locale !== nextProps.screenProps.locale) {
      i18n.changeLanguage(nextProps.screenProps.locale);
    }
  }

  render() {
    return <ProfileStack screenProps={this.props.screenProps} />;
  }
}

export default Profile;
