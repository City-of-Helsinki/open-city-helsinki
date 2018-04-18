/* @flow */
import * as React from 'react';
import {
  View,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import { TabNavigator, TabBarBottom } from 'react-navigation';
import { withProps } from 'recompose';
import { initColors } from 'open-city-modules';
import { translate } from 'react-i18next';
import { generateToken } from 'src/utils/authentication_keys';
import mapStyles from 'src/style';
import tabs from 'src/config/tabs';
import Header from 'src/config/header';
import CityChangeModal from 'src/components/CityChangeModal';
import colors from 'src/config/colors';
// eslint-disable-next-line no-unused-vars
import i18n from 'src/config/translations';
import heroBanner from '../img/main-hero-decoration.png';
import linkedEventDecorator from '../img/main-image-decoration.png';
import map_marker from '../img/marker_pin.png';

initColors(colors);

const Tabs = TabNavigator(tabs, {
  tabBarComponent: TabBarBottom,
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  tabBarOptions: {
    activeTintColor: colors.med,
    activeBackgroundColor: colors.min,
    inactiveTintColor: colors.max,
    inactiveBackgroundColor: colors.min,
    labelStyle: { fontSize: 12 },
  },
});

type Props = { i18n: any };
type State = {
  modalVisible: boolean,
};

async function tokenRequestListener(interfaceDeviceId) {
  const deviceToken = await generateToken(interfaceDeviceId);
  NativeModules.HostCardManager.sendToken(deviceToken);
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      modalVisible: false,
    };
    // $FlowFixMe
    this.Header = withProps({
      defaultRightAction: this.showModal,
    })(Header);
  }

  componentWillMount() {
    DeviceEventEmitter.addListener('apdu', tokenRequestListener);
  }

  showModal = () => this.setState({ modalVisible: true });
  hideModal = () => this.setState({ modalVisible: false });
  render() {

    const screenProps = {
      colors,
      locale: 'fi',
      // locale: this.props.i18n.language,
      Header: this.Header,
      heroBanner: heroBanner,
      mainImage: linkedEventDecorator,
      marker: map_marker,
      customMapStyle: mapStyles,
      showFeed: false,
    };
    return (
      <View style={{ flex: 1 }}>
        <Tabs screenProps={screenProps} />
        <CityChangeModal visible={this.state.modalVisible} onClose={this.hideModal} />
      </View>
    );
  }
}

export default translate()(App);
