import React from 'react';
import '../../css/stats.css';
import leaf from './leaf.png';

const ToggleSwitch = ({ theme, toggleTheme }) => {
  return (
    <div className={`toggle-switch buttonMode margin-right1 ${theme}`} onClick={toggleTheme}>
      <div className={`toggle-thumb ${theme}`}>
        <img src={leaf} alt="Leaf" className="leaf-icon" />
      </div>
    </div>
  );
};

const Header = ({ user, theme, toggleTheme, toggleSidebar }) => {
  return (
    <div className='row'>
       <div className='profile-container'>
        <button className="button btncos" onClick={toggleSidebar}>☰</button>
        
        <div className='user-info inline title' style={{ marginLeft: '20px' }}>
          {user && user.username ? `Hello  ${user.username}!` : 'Hello : User'}
        </div>
      </div>
      <div className='profile-container'>
        <ToggleSwitch theme={theme} toggleTheme={toggleTheme} />
        <a href="/Profile" className='user-info inline' style={{ textDecoration: 'none' }}>
          {user && user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt="Profile" 
              className='user-icon' 
              style={{ borderRadius: '50%', width: '60px', height: '60px' }} 
            />
          ) : (
            <div className='user-icon'>{user && user.username ? user.username[0] : 'U'}</div>
          )}
        </a>
      </div>
    </div>
  );
};

export default Header;
