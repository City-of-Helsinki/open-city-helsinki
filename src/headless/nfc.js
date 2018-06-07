import TimerMixin from 'react-timer-mixin';
import { generateToken } from 'src/utils/authentication_keys';
import {
  NativeModules
} from 'react-native';

export default async (taskData) => {
  console.log("HEADLESS: at headless task");
  const interfaceDeviceId = taskData.interfaceDeviceId;
  console.log("HEADLESS: generating token");
  const tokenData = await generateToken(interfaceDeviceId);
  console.log("HEADLESS: generated token");
  NativeModules.HostCardManager.sendToken(tokenData.token, tokenData.nonce);
}
