import React from 'react';
import RSLogo from '../../../public/rs_school.svg';

function Footer({ isFullscreen, fsToggle }) {
  return (
    <div className="footer">
      <div className="footer__item footer__item_info">
        <span>Dmitry Uvarov, 2020</span>
        <a href="https://github.com/wayjewish" rel="noreferrer" target="_blank">github</a>
        <a href="https://rs.school/js/" rel="noreferrer" target="_blank"><img src={RSLogo} alt="RSSchool" /></a>
      </div>

      <div className="footer__item hot-key">
        <div className="hot-key__item">R - Старт/Рестарт</div>
        <div className="hot-key__item">Q - Настройки</div>
        <div className="hot-key__item">S - Статистика</div>
      </div>
      <div className="footer__item hot-key">
        <div className="hot-key__item">Z - Вкл/Выкл музыку</div>
        <div className="hot-key__item">X - Вкл/Выкл звуки</div>
        <div className="hot-key__item">F - Во весь экран</div>
      </div>

      <div className="footer__item">
        <button className="button" type="button" onClick={fsToggle}>{isFullscreen ? 'Выйти изполноэкранного режима' : 'Во весь экран'}</button>
      </div>
    </div>
  );
}

export default Footer;
