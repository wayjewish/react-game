import React from 'react';

function Settings({
  audio,
  onChangeVolimeMusic,
  onChangeVolimeSound,
  switchMusic,
  switchSound,
}) {
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
            <button type="button" value="cards">Карты</button>
            <button type="button" value="logo">Лого</button>
            <button type="button" value="text">Текст</button>
          </div>
        </div>
      </div>

      <div className="settings__list setting">
        <div className="settings__item setting">
          <div className="setting__name">Музыка</div>
          <button type="button" onClick={switchMusic}>{audio.music.on ? 'Выкл' : 'Вкл'}</button>
          <input type="range" min="0" max="10" value={String(audio.music.volume * 10)} onChange={onChangeVolimeMusic} />
        </div>
        <div className="settings__item setting">
          <div className="setting__name">Звуки</div>
          <button type="button" onClick={switchSound}>{audio.sound.on ? 'Выкл' : 'Вкл'}</button>
          <input type="range" min="0" max="10" value={String(audio.sound.volume * 10)} onChange={onChangeVolimeSound} />
        </div>
      </div>
    </div>
  );
}

export default Settings;
