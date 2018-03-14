import Config from 'opencityHelsinki/src/config/config.json';
import { authorize, refresh } from 'react-native-app-auth';
import { updateProfile, loadProfile } from 'opencityHelsinki/src/profile';
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
        resolve(profile)
      } catch (error) {
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
