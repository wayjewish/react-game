/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import './Card.scss';

function Card({ img, isFlip, onClick }) {
  return (
    <div className={`card${isFlip ? ' card_flip' : ''}`} onClick={onClick}>
      <img className="card__img" src={img} />
      <div className="card__back" />
    </div>
  );
}

export default Card;
