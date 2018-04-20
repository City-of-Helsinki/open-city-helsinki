import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  ProgressBarAndroid,
  ActivityIndicatorIOS,
  AsyncStorage
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import styles from './styles';
import splashImage from '../../../img/splash_image_2.png';


// SplashScreen shown while data is being loaded
class SplashScreen extends Component {

  constructor(props, context) {
    super(props, context);

  }

  componentWillMount() {
    // this.fetchServiceRequests();
  }

  componentDidMount = () => {
    setTimeout(() => {
      // this.props.navigation.dispatch(NavigationActions.reset({
      //   index: 0,
      //   actions: [
      //     NavigationActions.navigate({routeName:'Tabs'})
      //   ]
      // }));
      this.props.navigation.navigate('Tabs')
    }, 3000)
  }

  // Fetch a fixed amount of serviceRequests from Open311 API
  // fetchServiceRequests() {
  //   var url = Config.OPEN311_SERVICE_REQUESTS_URL;
  //   var headers = {'Accept': 'application/json', 'Content-Type': 'application/json'};
  //
  //   makeRequest(url, 'GET', headers, null, null)
  //   .then(result => {
  //     Global.lastRefreshTimestamp = + new Date();
  //     this.serviceRequests = Util.parseServiceRequests(result, this.userSubmittedServiceRequests);
  //     this.navToNextView();
  //   }, error => {
  //
  //     // If an error occurs, show alert and go to the main view
  //     if (error.message === Config.TIMEOUT_MESSAGE) {
  //       showAlert(transError.serviceNotAvailableErrorTitle,
  //         transError.serviceNotAvailableErrorMessage, transError.serviceNotAvailableErrorButton);
  //       this.navToNextView();
  //     } else {
  //       showAlert(transError.networkErrorTitle, transError.networkErrorMessage,
  //         transError.networkErrorButton);
  //       this.navToNextView();
  //     }
  //   });
  // }

  // navToNextView() {
  //   try {
  //     AsyncStorage.getItem(Config.STORAGE_IS_FIRST_TIME).then((v) => {
  //       this.props.navigation.dispatch(NavigationActions.reset({
  //         index: 0,
  //         actions: [
  //           NavigationActions.navigate({routeName:'Tabs'})
  //         ]
  //       }));
  //     });
  //   } catch(error) {
  //
  //     // If an error occures with AsyncStorage just go to the main view
  //     this.props.navigation.dispatch(NavigationActions.reset({
  //       index: 0,
  //       actions: [
  //         NavigationActions.navigate({routeName:'Tabs'})
  //       ]
  //     }));
  //   }
  // }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={splashImage}
          style={styles.splashImage}/>
      </View>
    );
  }
}

export default SplashScreen;
