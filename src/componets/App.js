/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
import React, { useState, useEffect } from 'react';
import './App.scss';
import Card from './Card/Card';
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

function App() {
  const [totalCards, setTotalCards] = useState(12);
  //const [typeCards, setTypeCards] = useState();

  const [cards, setCards] = useState(generateCards(12));
  const [firstCard, setFirstCard] = useState(null);//первая активная карта
  const [secondCard, setSecondCard] = useState(null);//вторая активная карта
  const [guessCards, setGuessCards] = useState(null);//угаданные карты
  const [disabledGuess, setDisabledGuess] = useState(false);//временный блок на нажатия

  function setCardFlip(activeCard, activeFlip) {
    setCards((prev) => prev.map((card) => {
      if (card.id !== activeCard.id) return card;

      const newCard = card;
      newCard.isFlip = activeFlip;
      return newCard;
    }));

    /*setCards((prevState) => {
      const newState = prevState;
      const index = newState.indexOf(activeCard);

      newState[index].isFlip = activeFlip;
      console.log(newState, index);

      return { ...newState };
    });*/
  }

  function setCardGuess(activeCard, activeGuess) {
    setCards((prev) => prev.map((card) => {
      if (card.id !== activeCard.id) return card;

      const newCard = card;
      newCard.isGuess = activeGuess;
      return newCard;
    }));
  }

  function resetFirstAndSecondCards() {
    setFirstCard(null);
    setSecondCard(null);
  }

  function onSuccessGuess() {
    setCardGuess(firstCard, false);
    setCardGuess(secondCard, false);

    resetFirstAndSecondCards();
  }

  function onFailureGuess() {
    setDisabledGuess(true);

    setTimeout(() => {
      setCardFlip(firstCard, false);
    }, 900);
    setTimeout(() => {
      setCardFlip(secondCard, false);
      setDisabledGuess(false);
    }, 1000);

    resetFirstAndSecondCards();
  }

  useEffect(() => {
    if (!firstCard || !secondCard) return;

    if (firstCard.code === secondCard.code) {
      onSuccessGuess();
    } else {
      onFailureGuess();
    }
  }, [firstCard, secondCard]);

  function onCardClick(card) {
    if (disabledGuess || card.isFlip) return;

    setCardFlip(card, true);
    console.log(cards);

    if (firstCard) {
      setSecondCard(card);
    } else {
      setFirstCard(card);
    }
  }

  return (
    <div className="game">
      <div className={`cards cards_count${totalCards}`}>
        {cards.map((card) => (
          <Card
            key={card.id}
            img={card.img}
            isFlip={card.isFlip}
            onClick={() => onCardClick(card)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
