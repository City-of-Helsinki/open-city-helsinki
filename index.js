import './global';
import { AppRegistry } from 'react-native';
import App from 'src/App';
import { configure } from 'src/utils/sentryUtils';
import Piwik from 'react-native-piwik';
import Config from 'src/config/config.json';

Piwik.initTracker("https://analytics.hel.ninja/piwik", 16)
configure(Config.SENTRY_ENDPOINT);
AppRegistry.registerComponent('Helsinki', () => App);
