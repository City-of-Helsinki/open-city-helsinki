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

  setCards = (cards) => {
    return new Promise(async (resolve, reject) => {
      try {
        const cardArray = [];
        for (let i = 0; i < cards.length; i++) {
          const card = cards[i].split('/');
          if (card && card.length > 1) cardArray.push({ cardNumber: card[0], cardPin: card[1] })
        }
        const profile = await updateProfile({ cards: cardArray });
        resolve(profile)
      } catch (error) {
        reject(error)
      }
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
