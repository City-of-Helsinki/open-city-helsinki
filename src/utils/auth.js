import Config from 'opencityHelsinki/src/config/config.json';
import { authorize, revoke } from 'react-native-app-auth';
import { updateProfile } from 'opencityHelsinki/src/profile';


export const doAuth = () => {
  const config = {
    issuer: Config.OPENID_ISSUER,
    clientId: Config.OPENID_CLIENT_ID,
    redirectUrl: Config.OPENID_REDIRECT_URL,
    scopes: Config.OPENID_SCOPES,
  }
  return new Promise(async (resolve, reject) => {
      try {
        const result = await authorize(config)
        const profile = { auth: result };
        resolve(profile)
      } catch (error) {
        reject(error)
      }
  });
}
