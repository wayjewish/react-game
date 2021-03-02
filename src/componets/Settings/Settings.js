import React from 'react';

function Settings({
  close,
  settings,
  onSettingClick,
  audio,
  changeVolime,
  switchOnAudio,
}) {
  return (
    <div className="settings popup">

      <div className="popup__wrap">

        <button className="popup__close" type="button" onClick={close}>
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25 0L6.1783e-07 25" stroke="black" strokeWidth="3" />
            <path d="M0 0L25 25" stroke="black" strokeWidth="3" />
          </svg>
        </button>

        <h2>Настройки</h2>

        <div className="settings__list">
          <div className="settings__item setting">
            <div className="setting__name">Кол-во карточек</div>
            <div className="setting__list">
              <button className={`button${settings.totalCards === 8 ? ' active' : ''}`} type="button" name="totalCards" value="8" onClick={onSettingClick}>8</button>
              <button className={`button${settings.totalCards === 12 ? ' active' : ''}`} type="button" name="totalCards" value="12" onClick={onSettingClick}>12</button>
            </div>
          </div>

          <div className="settings__item setting">
            <div className="setting__name">Ограничение возможных ошибок</div>
            <div className="setting__list">
              <button className={`button${settings.failsLimit === 0 ? ' active' : ''}`} type="button" name="failsLimit" value="0" onClick={onSettingClick}>0</button>
              <button className={`button${settings.failsLimit === 5 ? ' active' : ''}`} type="button" name="failsLimit" value="5" onClick={onSettingClick}>5</button>
              <button className={`button${settings.failsLimit === 10 ? ' active' : ''}`} type="button" name="failsLimit" value="10" onClick={onSettingClick}>10</button>
            </div>
          </div>

          <div className="settings__item setting">
            <div className="setting__name">Вид карточек</div>
            <div className="setting__list">
              <button className={`button${settings.typeCards === 'cards' ? ' active' : ''}`} type="button" name="typeCards" value="cards" onClick={onSettingClick}>Карты</button>
              <button className={`button${settings.typeCards === 'logos' ? ' active' : ''}`} type="button" name="typeCards" value="logos" onClick={onSettingClick}>Лого</button>
            </div>
          </div>

          <div className="settings__item setting">
            <div className="setting__name">Музыка</div>
            <button name="music" className="button" type="button" onClick={switchOnAudio}>{audio.music.on ? 'Выкл' : 'Вкл'}</button>
            <input name="music" type="range" min="0" max="10" value={String(audio.music.volume * 10)} onChange={changeVolime} />
          </div>

          <div className="settings__item setting">
            <div className="setting__name">Звуки</div>
            <button name="sound" className="button" type="button" onClick={switchOnAudio}>{audio.sound.on ? 'Выкл' : 'Вкл'}</button>
            <input name="sound" type="range" min="0" max="10" value={String(audio.sound.volume * 10)} onChange={changeVolime} />
          </div>
        </div>

        <div className="settings__list hot-key">
          <div className="hot-key__item">R - Старт/Рестарт</div>
          <div className="hot-key__item">Q - Настройки</div>
          <div className="hot-key__item">S - Статистика</div>
          <div className="hot-key__item">Z - Вкл/Выкл музыку</div>
          <div className="hot-key__item">X - Вкл/Выкл звуки</div>
          <div className="hot-key__item">F - Во весь экран</div>
        </div>

      </div>
    </div>
  );
}

export default Settings;
