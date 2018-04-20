import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  ScrollView,
  UIManager,
  LayoutAnimation,
  StyleSheet,
  ToastAndroid
} from 'react-native';
import colors from 'src/config/colors';
import i18n from 'i18next';
import EStyleSheet from 'react-native-extended-stylesheet';
import FormInput from 'Helsinki/src/modules/Profile/components/FormInput';
import { makeRequest } from 'Helsinki/src/utils/requests';
import Config from 'Helsinki/src/config/config.json';
import BackIcon from 'Helsinki/img/arrow_back.png';
import styles from './styles';

// View for sending feedback about the application itself
class AppFeedbackView extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      descriptionText: '',
      titleText: '',
      sendEnabled: false,
    };

    // Needed for LayoutAnimation to work on android.
    if (Platform.OS === 'android') { UIManager.setLayoutAnimationEnabledExperimental(true); }
  }

  componentWillMount() {
    // this.initializeSpringAnimation();
  }

  goBack = () => {
    this.props.navigation.goBack();
  }

  onDescriptionTextChange(text) {
    // Stop adding text if the limit is reached
    if (text.length < Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
      this.setState({ descriptionText: text });
    }

    // Enable send button if the length of the description is within limits
    if (text.length >= Config.OPEN311_DESCRIPTION_MIN_LENGTH &&
        text.length <= Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
      this.setState({
        sendEnabled: true,
      });
    } else {
      this.setState({
        sendEnabled: false,
      });
    }
  }

  onSendButtonClick() {
    if (this.state.descriptionText.length >= Config.OPEN311_DESCRIPTION_MIN_LENGTH &&
        this.state.descriptionText.length <= Config.OPEN311_DESCRIPTION_MAX_LENGTH) {
      this.sendFeedback();
    } else {
      Alert.alert(
        `${i18n.t('error:descriptionLengthErrorTitle')}`,
        `${i18n.t('error:descriptionLengthErrorMessage')}`,
        [
          { text: '' },
          { text: `${i18n.t('error:descriptionErrorButton')}` },
        ],
      );
    }
  }

  async sendFeedback() {
    const url = Config.OPEN311_SEND_SERVICE_URL;
    const headers = {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    };
    let data = new FormData();

    this.setState({ spinnerVisible: true });
    data.append('api_key', Config.OPEN311_SEND_SERVICE_API_KEY);
    data.append('service_code', Config.APP_FEEDBACK_SERVICE_CODE);
    data.append('description', this.state.descriptionText);
    data.append('title', this.state.titleText !== null ? this.state.titleText : '');

    try {
      const result = await makeRequest(url, 'POST', headers, data)
      this.setState({
        spinnerVisible: false,
      });
      ToastAndroid.show('Lähettäminen onnistui', ToastAndroid.SHORT);
      this.props.navigation.goBack();
    } catch (error) {
      Alert.alert(
        `${i18n.t('error:networkErrorTitle')}`,
        `${i18n.t('error:networkErrorMessage')}`,
        [
          { text: '' },
          { text: `${i18n.t('error:networkErrorButton')}` },
        ],
      );
    }
  }

  render() {
    const { Header } = this.props.screenProps;

    return (
      <View style={styles.container}>
        <Header
          leftAction={{
            icon: BackIcon,
            action: this.goBack,
            style: {
              tintColor: colors.max,
            },
          }}
          // rightAction={{
          //   icon: this.state.sendEnabled ? sendEnabledIcon : sendDisabledIcon,
          //   action: this.onSendButtonClick.bind(this),
          // }}
        />
        <View style={styles.innerContainer}>
          <View style={styles.subHeader}><Text style={styles.title}>{i18n.t('feedBack:appFeedbackViewTitle')}</Text></View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.contentContainer}>
              <View style={styles.titleView}>
                <TextInput
                  style={styles.titleText}
                  onChangeText={(text) => { this.setState({ titleText: text }); }}
                  placeholder={i18n.t('feedBack:titlePlaceholder')}
                  autoCapitalize="sentences"
                />
              </View>

              <View style={styles.descriptionView}>
                <Text style={styles.descriptionView}>{i18n.t('feedBack:descriptionPlaceholder')}</Text>
                <TextInput
                  style={styles.descriptionText}
                  // multiline={true}
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => {
                    this.onDescriptionTextChange(text);
                  }}
                  placeholder={i18n.t('feedBack:descriptionPlaceholder')}
                  autoCapitalize="sentences"
                />
              </View>
              <TouchableOpacity
                disabled={this.state.loading}
                onPress={() => {
                  this.onSendButtonClick.bind(this);
                }}
              >
                <View style={styles.button}>
                  { this.state.loading &&
                    <ActivityIndicator
                      size={'small'}
                      color={EStyleSheet.value('$colors.med')}
                    />
                  }
                  { !this.state.loading &&
                    <Text style={styles.buttonText}>{i18n.t('common:continue')}</Text>
                  }
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

        </View>
        {this.state.spinnerVisible &&
          <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator
              size="large"
              // color={EStyleSheet.value('$color.med')}
            />
          </View>}
      </View>
    );
  }
}

export default AppFeedbackView;
