import React from 'react';

function EndGame({
  title,
  text,
  onClick,
}) {
  return (
    <div className="popup">
      <h2 className="popup__title">{title}</h2>
      <p className="popup__text">{text}</p>
      <button className="popup__button" type="button" onClick={onClick}>Продолжить</button>
    </div>
  );
}

export default EndGame;
