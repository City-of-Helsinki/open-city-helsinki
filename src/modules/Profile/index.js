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
import Cards from './views/Cards';
import AddCardView from './views/AddCardView';

class ProfileModule extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {

    }

    this.loadProf()
  }

  loadProf = async () => {
    const profile = await loadProfile();
    console.warn(profile)
  }

  authorize = async () => {
    const authorization = await doAuth();
    console.warn("authorization " + authorization)
    updateProfile(authorization);

  }

  render() {
    const { Header } = this.props.screenProps;

    return (
      <View style={{flex: 1}}>
        <Header />
        <View style={styles.subHeader}><Text style={styles.title}>Tiedot</Text></View>

        <View style={styles.container}>

          <TouchableOpacity
            onPress={() => this.authorize()}>
            <View style={styles.menuButton}>
              <View style={styles.buttonIcon}></View>
              <Text style={styles.buttonText}>oma.helsinki</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('Cards', {
            })
          }}>
            <View style={styles.menuButton}>
              <View style={styles.buttonIcon}></View>
              <Text style={styles.buttonText}>Kortit</Text>
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
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: colors.max,
  },
  menuButton: {
    flexDirection: 'row',
    backgroundColor: colors.med,
    padding: 16,
    marginVertical: 4,
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
  subHeader: {
    backgroundColor: 'gray',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});

const ProfileStack = StackNavigator(
  {
    Profile: {
      screen: ProfileModule,
    },
    Cards: {
      screen: Cards
    },
    AddCard: {
      screen: AddCardView
    }
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
