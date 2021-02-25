/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
import React, { useState } from 'react';
import './App.sass';
import Card from './Card/Card';
import data from '../../public/data';

function shuffleArray(array) {
  console.log(array);

  return array.sort(() => Math.random() - 0.5);
}

function generateCards(count) {
  console.log(data);

  const cards = shuffleArray(data.cards)
    .slice(0, count)
    .map((src, index) => ({
      id: index,
      imgURL: `../../public/cards/${src}`,
      isFlip: false,
    }));

  console.log(cards);

  return cards;
}

function App() {
  //const [totalCards, setTotalCards] = useState(8);
  //const [typeCards, setTypeCards] = useState();

  //const [flipCards, setFlipCards] = useState(null);
  const [cards, setCards] = useState(generateCards(8));

  return (
    <div className="game-container">
      <h1>React Game</h1>
      <div className="cards-container">
        {cards.map((card) => <Card key={card.id} imgURL={card.imgURL} />)}
      </div>
    </div>
  );
}

export default App;
