import React from 'react';

function Panel({
  fails, time, textButton, onClick,
}) {
  return (
    <div className="panel">
      <div className="panel__params params">
        <div className="params__time">
          Время:
          {time}
        </div>
        <div className="params__movies">
          Ошибок:
          {fails}
        </div>
      </div>
      <button className="params__new-game" type="button" onClick={onClick}>{textButton}</button>
    </div>
  );
}

export default Panel;
