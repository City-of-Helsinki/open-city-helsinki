/* @flow */
import * as React from 'react';
import {
  View,
  Text,
  Button,
  Picker,
  StyleSheet,
} from 'react-native';
import { type Profile } from 'src/types';

import colors from 'src/config/colors';

type ChoiceListProps = {
  title: string,
  choices: Array<string>,
};

let styles;

class Profile extends component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header />

      </View>
    );
  }
}



styles = StyleSheet.create({
  text: {
    fontSize: 20,
    color: colors.max,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  button: {
    marginVertical: 20,
  },
  changeLanguage: {
    alignSelf: 'stretch',
  },
});

export default ProfileTab;
