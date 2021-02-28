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
    'fon.mp3',
  ],
  [
    'start.mp3',
    'success.mp3',
    'fail.mp3',
    'lose.mp3',
    'win.mp3',
  ],
];

function generateAudio(arr, volume) {
  const arrRes = arr.map((item) => new Audio(`../../public/sound/${item}`));

  arrRes.forEach((item) => {
    item.volume = volume;
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
      list: generateAudio(arrAudio[0], 1),
      volume: 1,
      on: true,
    },
    sound: {
      list: generateAudio(arrAudio[1], 1),
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

  function resetFirstAndSecondCards() {
    setFirstCard(null);
    setSecondCard(null);
  }

  function onSuccessGuess() {
    setCardGuess(firstCard, true);
    setCardGuess(secondCard, true);

    audio.sound.list[1].play();
    setGuessCards((prevCount) => prevCount + 2);

    resetFirstAndSecondCards();
  }

  function onFailureGuess() {
    setDisabledClick(true);

    audio.sound.list[2].play();
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

  function onCardClick(card) {
    if (!workGame || disabledClick || card.isFlip) return;

    setCardFlip(card, true);

    if (firstCard) {
      setSecondCard(card);
    } else {
      setFirstCard(card);
    }
  }

  function setCardFlipAll(activeFlip) {
    setCards((prev) => prev.map((card) => ({ ...card, isFlip: activeFlip })));
  }

  async function startGame() {
    if (disabledClick) return;
    setDisabledClick(true);

    if (workGame) {
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
      audio.sound.list[0].play();
      setCardFlipAll(false);
    }, 2000);

    setTimeout(() => {
      setDisabledClick(false);
    }, 3000);
  }

  function changeVolime(input) {
    const { id } = input.target;
    const value = Number(input.target.value) / 10;

    const newAudio = { ...audio };
    newAudio[id].volume = value;
    setAudio(newAudio);

    audio[id].list.forEach((item) => {
      item.volume = value;
    });
  }

  useEffect(() => {
    if (audio.music.list[0].paused && audio.music.on) {
      audio.music.list[0].play();
      audio.music.list[0].loop = true;
    }
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
        onChange={(input) => changeVolime(input)}
      />
    </div>
  );
}

export default App;
