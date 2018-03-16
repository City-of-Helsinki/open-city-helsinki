import jose from 'node-jose';

// FIXME: replace with https://github.com/pradeep1991singh/react-native-secure-key-store
// const secureStore = scatteredStore.create('secure');
class MockSecureStore {
  constructor() {
    this.store = {};
  }
  get(key) {
    return this.store[key];
  }
  set(key, val) {
    this.store[key] = val;
  }
  remove(key) {
    delete this.store[key];
  }
}
const secureStore = new MockSecureStore();

const TUNNISTAMO_API_BASE = 'http://192.168.0.104:8000';
const STORE_PREFIX = 'tunnistamo/';

let keystore = jose.JWK.createKeyStore();

export const registerDevice = async (accessToken) => {
    const url = TUNNISTAMO_API_BASE + '/v1/user_device/';
    const signKey = await generateECKeyPair();
    // Save keypair
    await secureStore.set(STORE_PREFIX + 'privateKey', JSON.stringify(signKey.toJSON(true)));

    const data = {
        os: 'android', // FIXME
        os_version: '7.1', // FIXME
        app_version: '0.1.1', // FIXME
        device_model: 'LG G5', // FIXME
        public_key: signKey.toJSON()
    };

    let res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (res.status != 200 && res.status != 201) {
        console.error("User device registration failed: " + await res.text());
        throw new Error("User device registration failed");
    }
    res = await res.json();

    const deviceId = res.id;
    await secureStore.set(STORE_PREFIX + 'deviceId', deviceId);
    await secureStore.set(STORE_PREFIX + 'userId', res.user);

    const encKey = await keystore.add(res.secret_key);
    await secureStore.set(STORE_PREFIX + 'secretKey', JSON.stringify(encKey.toJSON(true)));
    await secureStore.set(STORE_PREFIX + 'authCounter', 0);
}

export const unregisterDevice = async (accessToken) => {
    const deviceId = await secureStore.get(STORE_PREFIX + 'deviceId');

    if (!deviceId)
        throw new Error("Device not registered yet");

    const url = `${TUNNISTAMO_API_BASE}/v1/user_device/${deviceId}/`;
    let res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    });

    if (res.status != 204)
        throw new Error("Device unregistration failed");

    await secureStore.remove(STORE_PREFIX + 'deviceId');
    await secureStore.remove(STORE_PREFIX + 'privateKey');
    await secureStore.remove(STORE_PREFIX + 'secretKey');
    await secureStore.remove(STORE_PREFIX + 'userId');
}

const generateECKeyPair = async () => {
    const keyProps = {
        alg: 'ES256',
        use: 'sig',
    }
    const key = await keystore.generate('EC', 'P-256', keyProps);
    return key;
};

const getAndIncrementCounter = async () => {
    let counter = await secureStore.get(STORE_PREFIX + 'authCounter');

    counter = parseInt(counter, 10);
    counter++;
    await secureStore.set(STORE_PREFIX + 'authCounter', counter);

    return counter;
}

const getDeviceID = async () => {
    return await secureStore.get(STORE_PREFIX + 'deviceId');
}

const getUserUUID = async () => {
    return await secureStore.get(STORE_PREFIX + 'userId');
}

export const generateToken = async (interfaceDeviceId) => {
    const payload = {
        iss: await getDeviceID(),
        sub: await getUserUUID(),
        cnt: await getAndIncrementCounter(),
        iat: Math.floor(Date.now() / 1000),
        azp: interfaceDeviceId
    };
    const nonce = Math.floor(Math.random()*1000000000000000);

    await secureStore.set(STORE_PREFIX + 'nonce', nonce);
    payload.nonce = nonce;

    let signKey = await secureStore.get(STORE_PREFIX + 'privateKey');
    signKey = await jose.JWK.asKey(JSON.parse(signKey));
    let encKey = await secureStore.get(STORE_PREFIX + 'secretKey');
    encKey = await jose.JWK.asKey(JSON.parse(encKey));

    const signedResult = await jose.JWS.createSign({format: 'compact'}, signKey)
        .update(JSON.stringify(payload)).final();
    // The device ID is also put in the non-encrypted header, so that
    // the receiver can determine the right decryption key.
    const encryptedResult = await jose.JWE.createEncrypt({
        format: 'compact',
        fields: {
            iss: payload.iss
        }
    }, encKey).update(signedResult).final();
    return encryptedResult;
};

// const testRegistration = async () => {
//     await registerDevice('12345'); // FIXME: Use real access token
//     const deviceToken = await generateToken('603b7451-9505-4ac5-bdeb-ef6d36c85a76'); // FIXME: use real interface id
//     console.log(deviceToken);
// };

// testRegistration();
