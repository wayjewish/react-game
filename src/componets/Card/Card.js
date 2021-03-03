/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';

function Card({
  code, img, isFlip, onClick,
}) {
  return (
    <div className={`card${isFlip ? ' card_flip' : ''}`} onClick={onClick}>
      <img className="card__img" src={img} alt={code} />
      <div className="card__back" />
    </div>
  );
}

export default Card;
