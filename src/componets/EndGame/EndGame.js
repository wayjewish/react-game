import React from 'react';

function EndGame({
  title,
  text,
  close,
}) {
  return (
    <div className="popup end-game">

      <div className="popup__wrap">

        <button className="popup__close" type="button" onClick={close}>
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 0L6.1783e-07 25" stroke="black" strokeWidth="3" />
            <path d="M0 0L25 25" stroke="black" strokeWidth="3" />
          </svg>
        </button>

        <h2 className="end-game__title">{title}</h2>
        <p className="end-game__text">{text}</p>
        <button className="popup__button" type="button" onClick={close}>Продолжить</button>

      </div>

    </div>
  );
}

export default EndGame;
