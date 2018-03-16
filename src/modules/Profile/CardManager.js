/* @flow */
import * as React from 'react';
import {
  View,
} from 'react-native';
import { doAuth } from 'opencityHelsinki/src/utils/auth';
import { loadProfile, updateProfile, deleteProfile } from 'opencityHelsinki/src/profile';
import { makeRequest } from 'opencityHelsinki/src/utils/requests';



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
  console.warn("beginning setcards")
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

export const removeCard = (cardNumber) => {
  return new Promise(async (resolve, reject) => {
    const profile = await loadProfile();
    const cards = profile.cards;
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].cardNumber === cardNumber) {
        cards[i].pop();
      }
    }

    await updateProfile({ cards });
    resolve(cards);
  })
};


export const registerCard = (card) => {
  return new Promise(async (resolve, reject) => {
    const url = 'https://api.hel.fi/sso-test/v1/user_device/';
    try {
      const profile = await loadProfile();
      if (profile.auth) {
        const token = profile.auth.accessToken;
        const headers = {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        };
        const body = {
          service: 'library',
          identifier: card.cardNumber,
          secret: card.cardPin
        }
        const result = await makeRequest(url, 'POST', headers, body);
        resolve(result)
      }


    } catch (error) {
      reject(error);
    }
  })
};
