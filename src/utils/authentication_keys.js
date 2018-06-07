import jose from 'node-jose';
import Config from 'Helsinki/src/config/config.json';
import DeviceInfo from 'react-native-device-info';
import RNSecureKeyStore from 'react-native-secure-key-store';

const TUNNISTAMO_API_BASE = 'https://api.hel.fi/sso-test';
const STORE_PREFIX = 'tunnistamo.';

let keystore = jose.JWK.createKeyStore();

export const registerDevice = async (accessToken) => {
  const os = DeviceInfo.getSystemName();
  const systemVersion = DeviceInfo.getSystemVersion();
  const appVersion = DeviceInfo.getVersion();
  const deviceModel = DeviceInfo.getModel();

  console.warn("os " + os);
  console.warn("osVersion " + systemVersion);
  console.warn("appVersion " + appVersion);
  console.warn("deviceModel " + deviceModel);

  const url = TUNNISTAMO_API_BASE + '/v1/user_device/';
  const signKey = await generateECKeyPair();
  // Save keypair
  await RNSecureKeyStore.set(STORE_PREFIX + 'privateKey', JSON.stringify(signKey.toJSON(true)));

  const data = {
    os: 'android',
    os_version: systemVersion,
    app_version: appVersion,
    device_model: deviceModel,
    public_key: signKey.toJSON()
  };

  let res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
  });

  if (res.status !== 200 && res.status !== 201) {
    console.error('User device registration failed: ' + await res.text());
    throw new Error('User device registration failed');
  }
  res = await res.json();

  const deviceId = res.id;
  await RNSecureKeyStore.set(STORE_PREFIX + 'deviceId', deviceId);
  await RNSecureKeyStore.set(STORE_PREFIX + 'userId', res.user);

  const encKey = await keystore.add(res.secret_key);
  await RNSecureKeyStore.set(STORE_PREFIX + 'secretKey', JSON.stringify(encKey.toJSON(true)));
  await RNSecureKeyStore.set(STORE_PREFIX + 'authCounter', '0');
};

export const unregisterDevice = async (accessToken) => {
  const deviceId = await RNSecureKeyStore.get(STORE_PREFIX + 'deviceId');

  if (!deviceId) throw new Error('Device not registered yet');

  const url = `${TUNNISTAMO_API_BASE}/v1/user_device/${deviceId}/`;
  let res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    }
  });

  if (res.status !== 204) throw new Error("Device unregistration failed");

  await RNSecureKeyStore.remove(STORE_PREFIX + 'deviceId');
  await RNSecureKeyStore.remove(STORE_PREFIX + 'privateKey');
  await RNSecureKeyStore.remove(STORE_PREFIX + 'secretKey');
  await RNSecureKeyStore.remove(STORE_PREFIX + 'userId');
};

const generateECKeyPair = async () => {
  const keyProps = {
    alg: 'ES256',
    use: 'sig'
  };

  const key = await keystore.generate('EC', 'P-256', keyProps);
  return key;
};

const getAndIncrementCounter = async () => {
  let counter = await RNSecureKeyStore.get(STORE_PREFIX + 'authCounter');

  counter = parseInt(counter, 10);
  counter++;
  await RNSecureKeyStore.set(STORE_PREFIX + 'authCounter', counter.toString());

  return counter;
};

const getDeviceID = async () => {
  return await RNSecureKeyStore.get(STORE_PREFIX + 'deviceId');
};

const getUserUUID = async () => {
  return await RNSecureKeyStore.get(STORE_PREFIX + 'userId');
};

export const generateToken = async (interfaceDeviceId) => {
  const payload = {
    iss: await getDeviceID(),
    sub: await getUserUUID(),
    cnt: await getAndIncrementCounter(),
    iat: Math.floor(Date.now() / 1000),
    azp: interfaceDeviceId
  };

  const nonce = Math.floor(Math.random() * 1000000000000000);

  await RNSecureKeyStore.set(STORE_PREFIX + 'nonce', nonce.toString());
  payload.nonce = nonce;

  let signKey = await RNSecureKeyStore.get(STORE_PREFIX + 'privateKey');
  signKey = await jose.JWK.asKey(JSON.parse(signKey));
  let encKey = await RNSecureKeyStore.get(STORE_PREFIX + 'secretKey');
  encKey = await jose.JWK.asKey(JSON.parse(encKey));

  const signedResult = await jose.JWS.createSign({format: 'compact'}, signKey)
    .update(JSON.stringify(payload)).final();
  // The device ID is also put in the non-encrypted header, so that
  // the receiver can determine the right decryption key.
  const encryptedResult = await jose.JWE.createEncrypt({
    format: 'compact',
    fields: {
      iss: payload.iss
    },
  }, encKey).update(signedResult).final();
  return {
    token: encryptedResult,
    nonce: nonce.toString()};
};
