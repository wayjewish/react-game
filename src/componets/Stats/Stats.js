/* eslint-disable react/no-array-index-key */
import React from 'react';

function Stats({
  close,
  stats,
}) {
  return (
    <div className="stats popup">

      <div className="popup__wrap">

        <button className="popup__close" type="button" onClick={close}>
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 0L6.1783e-07 25" stroke="black" strokeWidth="3" />
            <path d="M0 0L25 25" stroke="black" strokeWidth="3" />
          </svg>
        </button>

        <h2>Статистика</h2>

        <div className="stats__list">
          <div className="stats__head stats-head">
            <div className="stats-head__name-end-game">Результат</div>
            <div className="stats-head__name-end-game">Ошибок</div>
            <div className="stats-head__name-end-game">Время</div>
            <div className="stats-head__name-end-game">Карт</div>
            <div className="stats-head__name-end-game">Вид карт</div>
          </div>

          {stats.map((item, index) => (
            <div className="stats__item stats-game" key={index}>
              <div className="stats-game__name-end-game">{item.nameEndGame}</div>
              <div className="stats-game__name-end-game">{item.fails}</div>
              <div className="stats-game__name-end-game">{item.time}</div>
              <div className="stats-game__name-end-game">{item.totalCards}</div>
              <div className="stats-game__name-end-game">{item.typeCards}</div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default Stats;
