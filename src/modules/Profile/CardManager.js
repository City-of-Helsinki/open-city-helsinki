/* @flow */
import * as React from 'react';
import {
  View,
} from 'react-native';
import { doAuth } from 'opencityHelsinki/src/utils/auth';
import { loadProfile, updateProfile, deleteProfile } from 'opencityHelsinki/src/profile';


class CardManager {
  constructor() {

  }

  addCard = (cardNumber, cardPin, cardType) => {
    return new Promise(async (resolve, reject) => {
      const card = { cardNumber, cardPin, cardType };
      await updateProfile({ cards: [card] });
      resolve(card);
    })
  }

  getCards = () => {
    return new Promise(async (resolve, reject) => {
      const profile = await loadProfile();
      const cards = profile.cards;
      if (cards) {
        resolve(cards)
      }

      resolve(error)
    })
  }

  removeCard = (cardNumber) => {
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
  }
}



export default CardManager;
