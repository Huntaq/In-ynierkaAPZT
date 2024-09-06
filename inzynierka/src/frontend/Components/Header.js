import React from 'react';
import '../../css/stats.css';
import leaf from './leaf.png';
import { useLocation } from 'react-router-dom';

const ToggleSwitch = ({ theme, toggleTheme }) => {
  return (
    <div className={`toggle-switch buttonMode margin-right1 ${theme}`} onClick={toggleTheme}>
      <div className={`toggle-thumb ${theme}`}>
        <img src={leaf} alt="Leaf" className="leaf-icon" />
      </div>
    </div>
  );
};

const getGreetingMessage = (user, location) => {
  switch (location.pathname) {
    case '/UserAcc':
      return `Hello ${user?.username || 'User'}!`;
    case '/Profile':
      return `Profile`;
    case '/Settings':
      return `Settings`;
      case '/Calendar':
      return `Calendar`;
    default:
      return `Hello ${user?.username || 'User'}!`;
  }
};

const Header = ({ user, theme, toggleTheme, toggleSidebar }) => {
  const location = useLocation();

  return (
    <div className='row'>
       <div className='profile-container'>
        <button className="button btncos" onClick={toggleSidebar}>☰</button>
        
        <div className='user-info inline title greeting-message' style={{ marginLeft: '10px',color: '#727272' }}>
          {getGreetingMessage(user, location)}
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
