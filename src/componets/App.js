/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import Panel from './Panel/Panel';
import Cards from './Cards/Cards';
import Settings from './Settings/Settings';

import data from '../../public/data';

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateCards(count) {
  const cards = shuffleArray(data.cards)
    .slice(0, count / 2);

  const cards2 = cards.concat(cards)
    .map((item, index) => ({
      id: index,
      code: item.id,
      img: `../../public/cards/${item.img}`,
      isFlip: false,
      isGuess: false,
    }));

  return shuffleArray(cards2);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const arrAudio = [
  [
    { name: 'fon', audio: 'fon.mp3' },
  ],
  [
    { name: 'start', audio: 'start.mp3' },
    { name: 'success', audio: 'success.mp3' },
    { name: 'fail', audio: 'fail.mp3' },
    { name: 'lose', audio: 'lose.mp3' },
    { name: 'win', audio: 'win.mp3' },
  ],
];

function generateAudio(arr, volume) {
  const arrRes = {};

  arr.forEach((item) => {
    arrRes[item.name] = new Audio(`../../public/sound/${item.audio}`);
    arrRes[item.name].volume = volume;
  });

  return arrRes;
}

function App() {
  const [totalCards, setTotalCards] = useState(12);//кол-во карт
  const [typeCards, setTypeCards] = useState(null);//вид карт
  const [time, setTimes] = useState(0);//время
  const [fails, setFails] = useState(0);//ошибок

  const [audio, setAudio] = useState({
    music: {
      list: generateAudio(arrAudio[0], 0.5),
      volume: 1,
      on: true,
    },
    sound: {
      list: generateAudio(arrAudio[1], 0.5),
      volume: 1,
      on: true,
    },
  });//аудио

  const [workGame, setWorkGame] = useState(false);//работает ли игра
  const [disabledClick, setDisabledClick] = useState(false);//временный блок на нажатия

  const [cards, setCards] = useState(generateCards(12));//карточки
  const [firstCard, setFirstCard] = useState(null);//первая активная карта
  const [secondCard, setSecondCard] = useState(null);//вторая активная карта
  const [guessCards, setGuessCards] = useState(0);//кол-во угаданных карт

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
    setFails((prevCount) => prevCount + 1);

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
    if (!workGame || disabledClick || card.isFlip) return;

    setCardFlip(card, true);

    if (firstCard) {
      setSecondCard(card);
    } else {
      setFirstCard(card);
    }
  }

  useEffect(() => {
    if (guessCards === totalCards) {
      console.log('win');
      setWorkGame(false);
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

    if (workGame) {
      resetFirstAndSecondCards();
      setFails(0);

      setCardFlipAll(false);
      await sleep(1000);

      const newCards = await generateCards(totalCards);
      setCards(newCards);//я сосал
      await sleep(1000);//я меня ебали
    }

    console.log('startGame');
    setWorkGame(true);

    setCardFlipAll(true);
    setTimeout(() => {
      playAudio('start', 'sound');
      setCardFlipAll(false);
    }, 2000);

    setTimeout(() => {
      setDisabledClick(false);
    }, 3000);
  }

  /*-------------------volime-----------------------*/

  function playAudio(name, type) {
    if (!audio[type].on) return;

    audio[type].list[name].play();
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

  return (
    <div className="game">
      <Panel
        time={time}
        fails={fails}
        textButton={workGame ? 'Рестарт' : 'Новая игра'}
        onClick={() => startGame()}
      />
      <Cards totalCards={totalCards} cards={cards} onClick={(card) => onCardClick(card)} />
      <Settings
        audio={audio}
        onChangeVolimeMusic={(input) => changeVolimeMusic(input)}
        onChangeVolimeSound={(input) => changeVolimeSound(input)}
        switchMusic={switchMusic}
        switchSound={switchSound}
      />
    </div>
  );
}

export default App;
