/* @flow */
import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { deleteProfile } from 'opencityHelsinki/src/profile';
import colors from 'src/config/colors';
import BackIcon from 'opencityHelsinki/img/arrow_back.png';
import styles from './styles';

class ProfileDetailView extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentWillMount() {

  }
  onSignOutPress = () => {
    Alert.alert(
      'Haluatko kirjautua ulos?',
      'Oletko varma että haluat kirjautua ulos oma.helsinki tunnukseltasi?',
      [
        { text: 'Peruuta', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'Kyllä', onPress: () => this.logout() },
      ],
      { cancelable: false }
    )
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  logout = async () => {
    deleteProfile();
    this.props.navigation.navigate('Profile', {
    });
  }

  render() {
    const { Header } = this.props.screenProps;
    const { card } = this.props.navigation.state.params
    return (
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <Header
          leftAction={{
            icon: BackIcon,
            action: this.goBack,
            style: {
              tintColor: colors.max,
            },
          }}
        />

        <ScrollView
          style={{ flex: 1, backgroundColor: colors.min }}
          keyboardShouldPersistTaps={true}
          keyboardDismissMode={'on-drag'}
        >
          <View style={styles.container}>
            <Text style={styles.title}>oma.helsinki</Text>
            <Text style={styles.description}>
              Olet kirjautunut sovellukseen oma.helsinki tunnuksellasi.
            </Text>

            <TouchableOpacity onPress={() => this.onSignOutPress()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Kirjaudu ulos</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    );
  }
}

export default ProfileDetailView;
