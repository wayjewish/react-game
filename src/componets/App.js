/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import Panel from './Panel/Panel';
import Cards from './Cards/Cards';
import Settings from './Settings/Settings';
import Stats from './Stats/Stats';
import EndGame from './EndGame/EndGame';
import Footer from './Footer/Footer';

import {
  sleep,
  secondsToTime,
  saveLS,
  removeLS,
  generateCards,
  generateAudio,
} from '../assets/utils';

import audioData from '../assets/audio';

function App({
  inputSettings,
  inputStats,
  inputGame,
}) {
  const [settings, setSettings] = useState(inputSettings.settings);//настройки

  const [time, setTime] = useState(inputGame.time);//время
  const [fails, setFails] = useState(inputGame.fails);//ошибок

  const [audio, setAudio] = useState({
    music: {
      list: generateAudio(audioData[0], inputSettings.audio.music.volume),
      volume: inputSettings.audio.music.volume,
      on: inputSettings.audio.music.on,
    },
    sound: {
      list: generateAudio(audioData[1], inputSettings.audio.sound.volume),
      volume: inputSettings.audio.sound.volume,
      on: inputSettings.audio.sound.on,
    },
  });//аудио

  const [popups, setPopups] = useState({
    showEndGame: false,
    title: '',
    text: '',
    showSettings: false,
    showStats: false,
  });//попапы

  const [workGame, setWorkGame] = useState(inputGame.workGame);//работает ли игра
  const [endGame, setEndGame] = useState(false);//закончена ли игра
  const [disabledClick, setDisabledClick] = useState(false);//временный блок на нажатия

  const [cards, setCards] = useState(inputGame.cards);//карточки
  const [firstCard, setFirstCard] = useState(inputGame.firstCard);//первая активная карта
  const [secondCard, setSecondCard] = useState(inputGame.secondCard);//вторая активная карта
  const [guessCards, setGuessCards] = useState(inputGame.guessCards);//кол-во угаданных карт

  const [timer, setTimer] = useState(inputGame.timer);

  const [stats, setStats] = useState(inputStats);

  const [isFullscreen, setIsFullscreen] = useState(false);

  /*-------------------card-----------------------*/

  function setCardFlip(activeCard, activeFlip) {
    setCards((prev) => prev.map((card) => {
      if (card.id !== activeCard.id) return card;

      return { ...card, isFlip: activeFlip };
    }));
  }

  function setCardGuess(activeCard, activeGuess) {
    setCards((prev) => prev.map((card) => {
      if (card.id !== activeCard.id) return card;

      return { ...card, isGuess: activeGuess };
    }));
  }

  function setCardFlipAll(activeFlip) {
    setCards((prev) => prev.map((card) => ({ ...card, isFlip: activeFlip })));
  }

  function resetFirstAndSecondCards() {
    setFirstCard(null);
    setSecondCard(null);
  }

  function onSuccessGuess() {
    setCardGuess(firstCard, true);
    setCardGuess(secondCard, true);

    playAudio('success', 'sound');
    setGuessCards((prevCount) => prevCount + 2);

    resetFirstAndSecondCards();
  }

  function onFailureGuess() {
    setDisabledClick(true);

    playAudio('fail', 'sound');
    setFails(fails + 1);

    setTimeout(() => {
      setCardFlip(firstCard, false);
    }, 900);
    setTimeout(() => {
      setCardFlip(secondCard, false);
      setDisabledClick(false);
    }, 1000);

    resetFirstAndSecondCards();
  }

  function onCardClick(card) {
    if (!workGame || endGame || disabledClick || card.isFlip) return;

    setCardFlip(card, true);

    if (firstCard) {
      setSecondCard(card);
    } else {
      setFirstCard(card);
    }
  }

  useEffect(() => {
    if (guessCards === settings.totalCards) { //проверка на вин
      console.log('win');

      playAudio('win', 'sound');
      setCounter(false, timer.counter);
      setWorkGame(false);
      setEndGame(true);

      setPopups({
        ...popups,
        showEndGame: true,
        title: 'Победа',
        text: 'Выигрыш есть - можно поесть',
      });

      addInStats('Победа');

      return;
    }

    if (settings.failsLimit !== 0 && fails >= settings.failsLimit) { //проверка на луз
      console.log('lose');

      playAudio('lose', 'sound');
      setCounter(false, timer.counter);
      setWorkGame(false);
      setEndGame(true);

      setPopups({
        ...popups,
        showEndGame: true,
        title: 'Проигрыш',
        text: 'Если ты проиграл, значит, ты не выйграл',
      });

      addInStats('Проигрыш');

      return;
    }

    if (!firstCard || !secondCard) return;

    if (firstCard.code === secondCard.code) {
      onSuccessGuess();
    } else {
      onFailureGuess();
    }
  }, [firstCard, secondCard, guessCards]);

  /*-------------------Game-----------------------*/

  async function startGame() {
    if (disabledClick) return;
    setDisabledClick(true);

    playAudio('start', 'sound');

    if (workGame || endGame) {
      setEndGame(false);
      await resetGame();
    }

    console.log('startGame');
    setWorkGame(true);

    setCardFlipAll(true);
    setTimeout(() => {
      setCardFlipAll(false);
      setCounter(true, 0);

      setDisabledClick(false);
    }, 2000);
  }

  async function resetGame(newSettings) {
    console.log('resetGame');

    resetFirstAndSecondCards();
    setFails(0);
    setCounter(false, 0);

    if (guessCards !== 0 || firstCard) {
      setGuessCards(0);
      setCardFlipAll(false);
      await sleep(1000);
    }

    let newCards;
    if (newSettings) {
      newCards = await generateCards(newSettings.totalCards, newSettings.typeCards);
    } else {
      newCards = await generateCards(settings.totalCards, settings.typeCards);
    }

    setCards(newCards);
    await sleep(1000);
  }

  /*-------------------volime-----------------------*/

  function playAudio(name, type) {
    if (!audio[type].on) return;

    const sound = audio[type].list[name];

    if (!sound.ended) {
      sound.pause();
      sound.currentTime = 0;
    }

    sound.play();
  }

  function changeVolime(el) {
    const name = el.target.getAttribute('name');
    const value = Number(el.target.value) / 10;

    const newAudio = { ...audio };
    const { list } = audio[name];

    newAudio[name].volume = value;
    setAudio(newAudio);

    Object.keys(list).forEach((key) => {
      list[key].volume = value;
    });
  }

  function switchOnAudio(el) {
    const name = el.target.getAttribute('name');

    const newAudio = { ...audio };
    newAudio[name].on = !newAudio[name].on;
    setAudio(newAudio);
  }

  useEffect(() => {
    const { fon } = audio.music.list;

    if (!fon.loop) fon.loop = true;
    if (fon.paused && audio.music.on) fon.play();
    if (!fon.paused && !audio.music.on) fon.pause();

    saveLS('settings', {
      settings,
      audio: {
        music: {
          volume: audio.music.volume,
          on: audio.music.on,
        },
        sound: {
          volume: audio.sound.volume,
          on: audio.sound.on,
        },
      },
    });
  }, [audio]);

  /*-------------------settings-----------------------*/

  function onSettingClick(el) {
    if (disabledClick) return;

    const name = el.target.getAttribute('name');
    let value = el.target.getAttribute('value');
    if (name === 'totalCards' || name === 'failsLimit') {
      value = Number(value);
    }

    const newSettings = { ...settings };
    newSettings[name] = value;

    setSettings(newSettings);

    setWorkGame(false);
    resetGame(newSettings);

    saveLS('settings', {
      settings: newSettings,
      audio: {
        music: {
          volume: audio.music.volume,
          on: audio.music.on,
        },
        sound: {
          volume: audio.sound.volume,
          on: audio.sound.on,
        },
      },
    });
  }

  /*-------------------popup-----------------------*/

  function changePopup(name, value) {
    if (popups[name] === value) return;

    setPopups({
      ...popups,
      [name]: value,
    });
  }

  /*-------------------counter-----------------------*/

  function setCounter(on, counter) {
    setTimer({
      ...timer,
      on,
      counter,
    });

    setTime(secondsToTime(counter));
  }

  useEffect(() => {
    const setRunTimer = timer.on > 0
    && setInterval(() => {
      setTime(secondsToTime(timer.counter + 1));

      setTimer({
        ...timer,
        counter: timer.counter + 1,
      });
    }, 1000);

    return () => clearInterval(setRunTimer);
  }, [timer]);

  /*-------------------fullscreen-----------------------*/

  function fsToggle() {
    const el = document.getElementById('app');

    if (isFullscreen) {
      const rfs = document.cancelFullScreen
      || document.webkitCancelFullScreen
      || document.mozCancelFullScreen
      || document.msCancelFullScreen;
      rfs.call(document);
    } else {
      const rfs = el.requestFullscreen
      || el.webkitRequestFullScreen
      || el.mozRequestFullScreen
      || el.msRequestFullscreen;
      rfs.call(el);
    }

    setIsFullscreen(!isFullscreen);
  }

  /*-------------------stats-----------------------*/

  function addInStats(nameEndGame) {
    const newItem = {
      nameEndGame,
      fails,
      time,
      totalCards: settings.totalCards,
      typeCards: settings.typeCards,
    };

    const newStats = stats.slice(0, 9);
    newStats.unshift(newItem);

    saveLS('stats', newStats);
    setStats(newStats);
  }

  /*-------------------keyPress-----------------------*/

  function hotKey(e) {
    if (e.keyCode === 82) startGame();
    if (e.keyCode === 81) changePopup('showSettings', true);
    if (e.keyCode === 83) changePopup('showStats', true);
    if (e.keyCode === 90) {
      const newAudio = { ...audio };
      newAudio.music.on = !newAudio.music.on;
      setAudio(newAudio);
    }
    if (e.keyCode === 88) {
      const newAudio = { ...audio };
      newAudio.sound.on = !newAudio.sound.on;
      setAudio(newAudio);
    }
    if (e.keyCode === 70) {
      fsToggle();
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', hotKey);
    return () => document.removeEventListener('keydown', hotKey);
  });

  /*-------------------localStorage-----------------------*/

  useEffect(() => {
    if (!workGame) {
      removeLS('game');
      return;
    }

    const obj = {
      settings,
      time,
      fails,
      workGame,
      cards,
      firstCard,
      secondCard,
      guessCards,
      timer,
    };

    saveLS('game', obj);
  }, [audio, time, workGame]);

  /*-------------------return-----------------------*/

  return (
    <div className="game">
      <Panel
        time={time}
        fails={fails}
        textButton={workGame ? 'Рестарт' : 'Новая игра'}
        startGame={() => startGame()}
        showSettings={() => changePopup('showSettings', true)}
        showStats={() => changePopup('showStats', true)}
      />
      <Cards totalCards={settings.totalCards} cards={cards} onClick={(card) => onCardClick(card)} />
      { popups.showSettings > 0
        && (
        <Settings
          close={() => changePopup('showSettings', false)}
          settings={settings}
          onSettingClick={(el) => onSettingClick(el)}
          audio={audio}
          changeVolime={(el) => changeVolime(el)}
          switchOnAudio={(el) => switchOnAudio(el)}
        />
        )}
      { popups.showStats > 0
        && (
        <Stats
          close={() => changePopup('showStats', false)}
          stats={stats}
        />
        )}
      { popups.showEndGame > 0
        && (
        <EndGame
          title={popups.title}
          text={popups.text}
          close={() => changePopup('showEndGame', false)}
        />
        )}
      <Footer isFullscreen={isFullscreen} fsToggle={fsToggle} />
    </div>
  );
}

export default App;
