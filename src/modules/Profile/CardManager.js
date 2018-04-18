/* @flow */
import * as React from 'react';
import {
  View,
  NativeModules,
} from 'react-native';
import { doAuth, doRefresh} from 'Helsinki/src/utils/auth';
import { loadProfile, updateProfile, deleteProfile, saveProfile } from 'Helsinki/src/profile';
import { makeRequest } from 'Helsinki/src/utils/requests';



export const addCard = (cardNumber, cardPin, cardType) => {
  return new Promise(async (resolve, reject) => {
    const card = { cardNumber, cardPin, cardType };
    await updateProfile({ cards: [card] });
    resolve(card);
  })
};

export const getCards = () => {
  return new Promise(async (resolve, reject) => {
    const profile = await loadProfile();
    const cards = profile.cards;
    if (cards) {
      resolve(cards)
    }

    resolve(error)
  })
};

export const setCards = (cards) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cardArray = [];
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i].split('/');
        if (card && card.length > 1) cardArray.push({ cardNumber: card[0], cardPin: card[1] })
      }

      let profile = await loadProfile();

      if (profile) {
        profile.cards = cardArray
      } else {
        profile = { cards: cardArray }
      }

      resolve(profile)
    } catch (error) {
      reject(error)
    }
  })
};

export const removeCardFromTunnistamo = (card) => {
  return new Promise(async (resolve, reject) => {
    const profile = await loadProfile();
    const url = 'https://api.hel.fi/sso-test/v1/user_identity/' + card.tunnistamoData.id + '/';
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${profile.auth.accessToken}`,
    };

    try {
      const result = await makeRequest(url, 'DELETE', headers, null);
      resolve(result);
    } catch (error) {
      reject(error)
    }
  })
};


export const registerCard = (card) => {
  return new Promise(async (resolve, reject) => {
    const url = 'https://api.hel.fi/sso-test/v1/user_identity/';
    try {
      const profile = await loadProfile();
      if (profile.auth && profile.auth.accessToken) {
        const token = profile.auth.accessToken;

        let body = {
          service: 'helmet',
          identifier: card.cardNumber,
          secret: card.cardPin
        }

        try {
          let res = await fetch(url, {
              method: 'POST',
              body: JSON.stringify(body),
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
              },
          });

          if (res.status != 200 && res.status != 201) {
              throw new Error("User device registration failed");
          }
          resolve(res);
        } catch (error) {
          reject(error)
        }
      } else {
        reject(new Error("User has not authenticated"))
      }
    } catch (error) {
      reject(error);
    }
  })
};

export const fetchRegisteredCards = async (profile) => {
  const { accessToken, refreshToken } = profile.auth;
  return new Promise(async (resolve, reject) => {
    const url = 'https://api.hel.fi/sso-test/v1/user_identity/';
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    try {
      const result = await makeRequest(url, 'GET', headers, null);
      const cardArray = [];

      const cards = await NativeModules.HostCardManager.getCards();

      const serviceCardArray = [];
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i].split('/');
        if (card && card.length > 1) serviceCardArray.push({ cardNumber: card[0], cardPin: card[1] })
      }

      // Comparing cards found from native service and tunnistamo
      // If no matches, add tunnistamo card without PIN code
      result.map((item) => {
        if (serviceCardArray.length > 0) {
          let found = false;
          for (let i = 0; i < serviceCardArray.length; i += 1) {
            if (item.identifier === serviceCardArray[i].cardNumber) {
              found = true;
              serviceCardArray[i].tunnistamoData = item;
              cardArray.push(serviceCardArray[i]);
            }
          }

          if (!found) {
            cardArray.push({ cardNumber: item.identifier, tunnistamoData: item });
          }
        } else {
          cardArray.push({ cardNumber: item.identifier, tunnistamoData: item });
        }
      });

      // Saving cards to profile

      let profile = await loadProfile();

      if (profile) {
        profile.cards = cardArray;
      } else {
        profile = { cards: cardArray }
      }


      await saveProfile(profile);

      resolve(profile)
    } catch (error) {
      reject(error)
    }
  })
}
