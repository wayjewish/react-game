import React from 'react';

function Settings({ audio, onChange }) {
  return (
    <div className="settings">
      <div className="settings__list setting">
        <div className="settings__item setting">
          <div className="setting__name">Кол-во карточек</div>
          <div className="setting__list">
            <button type="button">8</button>
            <button type="button">12</button>
            <button type="button">16</button>
          </div>
        </div>

        <div className="settings__item setting">
          <div className="setting__name">Ограничение возможных ошибок</div>
          <div className="setting__list">
            <button type="button">5</button>
            <button type="button">10</button>
            <button type="button">15</button>
          </div>
        </div>

        <div className="settings__item setting">
          <div className="setting__name">Вид карточек</div>
          <div className="setting__list">
            <button type="button">Карты</button>
            <button type="button">Лого</button>
            <button type="button">Текст</button>
          </div>
        </div>
      </div>

      <div className="settings__list setting">
        <div className="settings__item setting">
          <div className="setting__name">Музыка</div>
          <button type="button">{audio.music.on ? 'Выкл' : 'Вкл'}</button>
          <input id="music" type="range" min="0" max="10" value={String(audio.music.volume * 10)} onChange={onChange} />
        </div>
        <div className="settings__item setting">
          <div className="setting__name">Звуки</div>
          <button type="button">{audio.sound.on ? 'Выкл' : 'Вкл'}</button>
          <input id="sound" type="range" min="0" max="10" value={String(audio.sound.volume * 10)} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}

export default Settings;
