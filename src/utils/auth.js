import Config from 'Helsinki/src/config/config.json';
import { authorize, refresh } from 'react-native-app-auth';
import { updateProfile, loadProfile } from 'Helsinki/src/profile';
import { makeRequest } from 'src/utils/requests';

const config = {
  issuer: Config.OPENID_ISSUER,
  clientId: Config.OPENID_CLIENT_ID,
  redirectUrl: Config.OPENID_REDIRECT_URL,
  scopes: Config.OPENID_SCOPES,
}

export const doAuth = () => {
  return new Promise(async (resolve, reject) => {
      try {
        const result = await authorize(config)
        const profile = { auth: result };
        updateProfile(profile);
        resolve(profile)
      } catch (error) {
        console.warn(error)
        reject(error)
      }
  });
}

export const doRefresh = (refreshToken) => {
  return new Promise(async (resolve, reject) => {
    try {

      const result = await refresh(config, {
        refreshToken: refreshToken,
      });
      const profile = { auth: result };
      profile = await updateProfile(profile);
      resolve(profile);
    } catch (error) {
      console.warn(error)
      reject(error);
    }
  });
}

export const getUserData = (accessToken) => {
  return new Promise(async (resolve, reject) => {
    try {
      const url = Config.OPENID_ISSUER + '/userinfo'
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      };

      const result = await makeRequest(url, 'GET', headers, null);
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}
