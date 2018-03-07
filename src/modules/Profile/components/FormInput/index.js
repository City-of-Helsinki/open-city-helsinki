/* @flow */


import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Color from 'color'
import styles from './styles';


type Props = {
  label: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  inputHeight: ?number;
  multiline: ?boolean;
}

const FormInput = ({
  label,
  placeholder,
  inputHeight,
  onChangeText,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
}: Props) => (
  <View
    style={styles.row}
  >
    <View
      style={styles.label}
    >
      <Text
        style={styles.labelText}
      >
        {label}
      </Text>
    </View>
    <View>
      <TextInput
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[styles.input, { height: inputHeight }]}
        placeholder={placeholder}
        underlineColorAndroid="black"
        onChangeText={(text) => { onChangeText(text); }}
        multiline={multiline}
      />
    </View>
  </View>
);


export default FormInput;
