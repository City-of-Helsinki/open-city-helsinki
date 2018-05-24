/* @flow */
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  ToastAndroid,
  DeviceEventEmitter,
  BackHandler,
  Platform,
} from 'react-native';
import {
  registerDevice,
} from 'Helsinki/src/utils/authentication_keys';
import { StackNavigator, NavigationActions } from 'react-navigation';
import i18n from 'i18next';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
  doAuth,
  // doRefresh,
} from 'Helsinki/src/utils/auth';
import {
  isAuthed,
  loadProfile,
  updateProfile,
  // deleteProfile
} from 'Helsinki/src/profile';
import { fetchRegisteredCards } from 'src/modules/Profile/CardManager';
import colors from 'src/config/colors';
import { getUserData } from 'src/utils/auth';
import Cards from './views/Cards';
import AddCardView from './views/AddCardView';
import CardDetailView from './views/CardDetailView';
import ProfileDetailView from './views/ProfileDetailView';
import CardUsage from './views/CardUsage';
import AboutApp from './views/AboutApp';
import AppFeedbackView from './views/AppFeedback';
import Wave from './components/Wave';
import styles from './styles';
import smile from '../../../img/smile.png';
import ticket from '../../../img/ticket.png';
import globe from '../../../img/globe.png';
import comment from '../../../img/comment.png';

class ProfileModule extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      cards: [],
      loading: false,
      name: null,
      isAuthed: false,
    };

    this.isAuthed = this.isAuthed.bind(this);
  }

  componentWillMount() {
    this.isAuthed();
  }

  isAuthed = async () => {
    const authed = await isAuthed();
    if (authed.profile) {
      try {
        const data = await getUserData(authed.profile.auth.accessToken);
        const firstName = data.name.split(' ')[0];
        const lastName = data.name.split(' ')[1];
        this.setState({
          isAuthed: true,
          firstName: firstName,
          lastName: lastName,
        });
      } catch (error) {
        console.warn(error);
      }
    }
  }

  goBack = () => {
    return true;
  }

  onAuthPressed = async () => {
    const authed = await isAuthed();
    this.setState({ profile: authed.profile })
    if (authed.isAuthed && authed.profile) {
      this.props.navigation.navigate('ProfileDetail', {
        profile: authed.profile,
      });
    } else if (!authed.isAuthed) {
      try {
        const result = await this.authorize();
        if (result) {
          this.isAuthed();
          ToastAndroid.show('Tunnistautuminen onnistui', ToastAndroid.SHORT);
        }
      } catch (error) {
        ToastAndroid.show('Tunnistautuminen epäonnistui', ToastAndroid.SHORT);
      }
    }
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
                this.isAuthed();
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

  goToAppFeedBack = () => {
    this.props.navigation.navigate('AppFeedbackView');
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
      <View style={styles.container}>
        {!!Header &&
          <Header />
        }
        {!!this.state.isAuthed &&
          <View
            style={styles.subHeader}
          >
            <Text style={styles.title}>
              {this.state.firstName}
            </Text>
            <Text style={styles.title}>
              {this.state.lastName}
            </Text>
          </View>
        }
        {!this.state.isAuthed &&
          <View
            style={styles.subHeader}
          >
            <Text style={styles.title}>
              {i18n.t('profileTab:info')}
            </Text>
          </View>
        }
        <Wave
          topColor={colors.min}
          bottomColor={colors.copper}
        />
        <View style={styles.buttonContainer}>

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
          {Platform.OS === 'android' &&
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
          }
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
          <TouchableOpacity
            disabled={this.state.loading}
            onPress={() => this.goToAppFeedBack()}
          >
            <View style={styles.menuButton}>
              <Image
                source={comment}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>
                {i18n.t('profileTab:appFeedback')}
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

const ProfileStack = StackNavigator({
  Profile: {
    screen: ProfileModule,
    navigationOptions: {
      header: null,
    },
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
  AppFeedbackView: {
    screen: AppFeedbackView,
  },
});

type ModuleProps = {
  screenProps: { locale: string },
};

class Profile extends React.Component<ModuleProps> {
  tabChangeListener: Object;

  componentWillMount() {
    if (this.props.screenProps.locale) {
      i18n.changeLanguage(this.props.screenProps.locale);
    }

    this.tabChangeListener = DeviceEventEmitter.addListener('tabChanged', this.onTabChange)

  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardWareBackPress', this.goBack);
    this.tabChangeListener.remove();
  }

  goBack = () => {
    const index = this.navigator.state.nav.index
    if (index > 0) {
      this.navigator._navigation.goBack();
      return true;
    }

    return false;
  }

  onTabChange = (params) => {
    // Reset navigator when switching tabs

    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Profile' }),
      ]
    });
    const index = this.navigator.state.nav.index

    if (params.prevRoute === 'Profile') {
      BackHandler.removeEventListener('hardWareBackPress', this.goBack);

      if(index > 0) {
        this.navigator._navigation.dispatch(resetAction);
      }
    }

    if (params.nextRoute === 'Profile') {
      const timeoutId = setTimeout(() => {
        BackHandler.addEventListener('hardwareBackPress', this.goBack)
      }, 1000);
    }

  }

  componentWillReceiveProps(nextProps: ModuleProps) {
    if (this.props.screenProps.locale !== nextProps.screenProps.locale) {
      i18n.changeLanguage(nextProps.screenProps.locale);
    }
  }

  render() {
    return <ProfileStack
      screenProps={this.props.screenProps}
      ref={(ref) => this.navigator = ref}
    />;
  }
}

export default Profile;
