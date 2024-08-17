import React from 'react';
import '../../css/stats.css';

const Header = ({ user, theme, toggleTheme, toggleSidebar }) => {
  return (
    <div className='row'>
      <button className="button inline margin-left" onClick={toggleSidebar}>☰</button>
      
      <button className='button inline margin-right' onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
};

export default Header;
