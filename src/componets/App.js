/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import Panel from './Panel/Panel';
import Cards from './Cards/Cards';
import Settings from './Settings/Settings';
import EndGame from './EndGame/EndGame';
import Footer from './Footer/Footer';

import {
  shuffleArray,
  sleep,
  secondsToTime,
} from '../assets/utils';

import cardsData from '../assets/cards';
import audioData from '../assets/audio';

function generateCards(count, type) {
  const cards = shuffleArray(cardsData[type])
    .slice(0, count / 2);

  const cards2 = cards.concat(cards)
    .map((item, index) => ({
      id: index,
      code: item.id,
      img: `../../public/${type}/${item.img}`,
      isFlip: false,
      isGuess: false,
    }));

  return shuffleArray(cards2);
}

function generateAudio(arr, volume) {
  const arrRes = {};

  arr.forEach((item) => {
    arrRes[item.name] = new Audio(`../../public/sound/${item.audio}`);
    arrRes[item.name].volume = volume;
  });

  return arrRes;
}

function App() {
  const [settings, setSettings] = useState({
    totalCards: 12, //кол-во карт
    typeCards: 'cards', //вид карт
    failsLimit: 0, //лимит ошибок
  });//настройки

  const [time, setTime] = useState('00:00');//время
  const [fails, setFails] = useState(0);//ошибок

  const [audio, setAudio] = useState({
    music: {
      list: generateAudio(audioData[0], 1),
      volume: 1,
      on: false,
    },
    sound: {
      list: generateAudio(audioData[1], 1),
      volume: 1,
      on: true,
    },
  });//аудио

  const [popups, setPopups] = useState({
    showEndGame: false,
    title: '',
    text: '',
    showSettings: false,
    showStats: false,
  });//попапы

  const [workGame, setWorkGame] = useState(false);//работает ли игра
  const [endGame, setEndGame] = useState(false);//закончена ли игра
  const [disabledClick, setDisabledClick] = useState(false);//временный блок на нажатия

  const [cards, setCards] = useState(generateCards(12, 'cards'));//карточки
  const [firstCard, setFirstCard] = useState(null);//первая активная карта
  const [secondCard, setSecondCard] = useState(null);//вторая активная карта
  const [guessCards, setGuessCards] = useState(0);//кол-во угаданных карт

  const [timer, setTimer] = useState({
    on: false, //запущен ли таймер
    counter: 0, //секунд
  });

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

      changePopup('showEndGame', true);
      changePopup('title', 'Победа');
      changePopup('text', 'Выигрыш есть - можно поесть');

      return;
    }

    if (settings.failsLimit !== 0 && fails >= settings.failsLimit) { //проверка на луз
      console.log('lose');

      playAudio('lose', 'sound');
      setCounter(false, timer.counter);
      setWorkGame(false);
      setEndGame(true);

      changePopup('showEndGame', true);
      changePopup('title', 'Проигрыш');
      changePopup('text', 'Если ты проиграл, значит, ты не выйграл');
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
    }, 2000);

    setTimeout(() => {
      setDisabledClick(false);
      setCounter(true, 0);
    }, 3000);
  }

  async function resetGame() {
    console.log('resetGame');

    resetFirstAndSecondCards();
    console.log('тут');
    setFails(0);
    setCounter(false, 0);

    if (guessCards !== 0 || firstCard) {
      setGuessCards(0);
      setCardFlipAll(false);
      await sleep(1000);
    }

    const newCards = await generateCards(settings.totalCards, settings.typeCards);
    console.log(newCards);
    setCards(newCards);//я сосал
    await sleep(1000);//меня ебали
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

  function changeVolime(id, value) {
    const newAudio = { ...audio };
    const { list } = audio[id];

    newAudio[id].volume = value;
    setAudio(newAudio);

    Object.keys(list).forEach((key) => {
      list[key].volume = value;
    });
  }

  function changeVolimeMusic(input) {
    const id = 'music';
    const value = Number(input.target.value) / 10;

    changeVolime(id, value);
  }

  function changeVolimeSound(input) {
    const id = 'sound';
    const value = Number(input.target.value) / 10;

    changeVolime(id, value);
  }

  function switchMusic() {
    const id = 'music';

    const newAudio = { ...audio };
    newAudio[id].on = !newAudio[id].on;
    setAudio(newAudio);
  }
  function switchSound() {
    const id = 'sound';

    const newAudio = { ...audio };
    newAudio[id].on = !newAudio[id].on;
    setAudio(newAudio);
  }

  useEffect(() => {
    const { fon } = audio.music.list;

    if (!fon.loop) fon.loop = true;
    if (fon.paused && audio.music.on) fon.play();
    if (!fon.paused && !audio.music.on) fon.pause();
  }, [audio]);

  /*-------------------settings-----------------------*/

  function changeSetting(name, value) {
    if (settings[name] === value) return;

    const newSettings = { ...settings };

    Object.keys(newSettings).forEach((key) => {
      if (key === name) newSettings[key] = value;
    });

    console.log(newSettings);

    setSettings(newSettings);
  }

  function onSettingClick(el) {
    if (disabledClick) return;

    const name = el.target.getAttribute('name');
    let value = el.target.getAttribute('value');
    if (name === 'totalCards' || name === 'failsLimit') {
      value = Number(value);
    }

    changeSetting(name, value);
  }

  useEffect(() => {
    setWorkGame(false);

    console.log(settings);
    resetGame();
  }, [settings]);

  /*-------------------popup-----------------------*/

  function changePopup(name, value) {
    if (popups[name] === value) return;

    const newPopups = { ...popups };

    Object.keys(newPopups).forEach((key) => {
      if (key === name) newPopups[key] = value;
    });

    setPopups(newPopups);
  }

  function closePopupEndGame() {
    changePopup('showEndGame', false);
    changePopup('title', '');
    changePopup('text', '');
  }

  /*-------------------counter-----------------------*/

  function setCounter(on, counter) {
    const newTimer = { ...timer };
    newTimer.on = on;
    newTimer.counter = counter;
    setTimer(newTimer);

    setTime(secondsToTime(counter));
  }

  useEffect(() => {
    const setRunTimer = timer.on > 0
    && setInterval(() => {
      const newTimer = { ...timer };
      newTimer.counter = timer.counter + 1;

      setTime(secondsToTime(newTimer.counter));

      setTimer(newTimer);
    }, 1000);

    return () => clearInterval(setRunTimer);
  }, [timer]);

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
          onChangeVolimeMusic={(input) => changeVolimeMusic(input)}
          onChangeVolimeSound={(input) => changeVolimeSound(input)}
          switchMusic={() => switchMusic}
          switchSound={() => switchSound}
        />
        )}
      { popups.showEndGame > 0
        && (
        <EndGame
          title={popups.title}
          text={popups.text}
          onClick={() => closePopupEndGame}
        />
        )}
      <Footer />
    </div>
  );
}

export default App;
