import React from 'react';
import ReactDOM from 'react-dom';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import App from './componets/App';

import 'normalize.css';
import './index.scss';

import {
  getLS,
  generateCards,
} from './assets/utils';

const saveGame = getLS('game');
const saveStats = getLS('stats');
const saveSettings = getLS('settings');

const defaultProps = {
  inputSettings: {
    settings: {
      totalCards: 12,
      typeCards: 'cards',
      failsLimit: 0,
    },
    audio: {
      music: {
        volume: 1,
        on: false,
      },
      sound: {
        volume: 1,
        on: true,
      },
    },
  },
  inputStats: [],
  inputGame: {
    time: '00:00',
    fails: 0,
    workGame: false,
    cards: generateCards(saveSettings ? saveSettings.settings.totalCards : 12, saveSettings ? saveSettings.settings.typeCards : 'cards'),
    firstCard: null,
    secondCard: null,
    guessCards: 0,
    timer: {
      on: false,
      counter: 0,
    },
  },
};

console.log(saveStats);

ReactDOM.render(
  <App
    inputSettings={saveSettings || defaultProps.inputSettings}
    inputStats={saveStats || defaultProps.inputStats}
    inputGame={saveGame || defaultProps.inputGame}
  />,
  document.getElementById('app'),
);
