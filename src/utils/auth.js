import Config from 'opencityHelsinki/src/config/config.json';
import { authorize, refresh } from 'react-native-app-auth';
import { updateProfile, loadProfile } from 'opencityHelsinki/src/profile';
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
      const mRefreshToken = refreshToken;
      if (!mRefreshToken) {
        const profile = await loadProfile();
        mRefreshToken = profile.auth.refreshToken;
      }

      const result = await refresh(config, {
        refreshToken: mRefreshToken,
      });
      const profile = { auth: result };

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
