import React from 'react';

function Panel({
  fails,
  time,
  textButton,
  startGame,
  showSettings,
  showStats,
}) {
  return (
    <div className="panel">
      <div className="panel__params params">
        <div className="params__time">{`Время: ${time}`}</div>
        <div className="params__movies">{`Ошибок: ${fails}`}</div>
      </div>
      <button className="params__new-game button" type="button" onClick={startGame}>{textButton}</button>
      <button className="params__settings button" type="button" onClick={showSettings}>Настройки</button>
      <button className="params__stats button" type="button" onClick={showStats}>Статистика</button>
    </div>
  );
}

export default Panel;
