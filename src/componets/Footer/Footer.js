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

      <div className="footer__item">
        <button className="button" type="button" onClick={fsToggle}>{isFullscreen ? 'Выйти изполноэкранного режима' : 'Во весь экран'}</button>
      </div>
    </div>
  );
}

export default Footer;
