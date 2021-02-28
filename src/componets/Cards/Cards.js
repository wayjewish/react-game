import React from 'react';
import Card from '../Card/Card';

function Cards({ totalCards, cards, onClick }) {
  return (
    <div className={`cards cards_count${totalCards}`}>
      {cards.map((card) => (
        <Card
          key={card.id}
          code={card.code}
          img={card.img}
          isFlip={card.isFlip}
          onClick={() => onClick(card)}
        />
      ))}
    </div>
  );
}

export default Cards;
