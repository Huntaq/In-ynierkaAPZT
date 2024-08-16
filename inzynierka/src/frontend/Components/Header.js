import React from 'react';
import '../../css/stats.css';

const Header = ({ user, theme, toggleTheme, toggleSidebar }) => {
  return (
    <div className='row'>
      <button className="button inline margin-left" onClick={toggleSidebar}>☰</button>
      <a href="/Profile" className='user-info inline margin-left1' style={{ textDecoration: 'none' }}>
        <div className='user-icon'>{user.username[0]}</div>
      </a>
      <button className='button inline margin-right' onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
};

export default Header;
