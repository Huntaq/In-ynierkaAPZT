import React from 'react';
import '../../css/stats.css';
import { useLocation } from 'react-router-dom';

const ToggleSwitch = ({ theme, toggleTheme }) => {
  // return (
  //   <div className={`bg-gradient-to-r from-blue-200 to-blue-600 self-center p-[3px] w-[60px] h-[10px] relative rounded-[50px] m-[10px] brder-box toggle-switch hover:scale-105 hover:cursor-pointer`} onClick={toggleTheme}>
  //     <div className={` transition ease-linear duration-500 w-[24px] h-[24px] rounded-[50%] absolute top-1/2 translate-y-[-50%] toggle-thumb ${theme}`}>
  //       <img src={leaf} alt="Leaf" />
  //     </div>
  //   </div>
  // );
};

const getGreetingMessage = (user, location) => {
  switch (location.pathname) {
    case '/UserAcc':
      return `Hello, ${user?.username || 'User'}!`;
    case '/Profile':
      return `Profile`;
    case '/Settings':
      return `Settings`;
    case '/Calendar':
      return `Calendar`;
    case '/Trophies':
      return `Trophies`;
    case '/Rankings':
      return `Rankings`;
    case '/Statistics':
      return `Statistics`;
    default:
      return `Hello, ${user?.username || 'User'}!`;
  }
};

const Header = ({ user, theme, toggleTheme, toggleSidebar }) => {
  const location = useLocation();
  return (
    <div className='pl-[50px] pr-[50px] flex items-center w-full justify-between mt-[5px] p-[5px] box-border'>
      <div>
        <div className='flex-1 hidden sm:block content-center text-[#3B4A3F] font-bold text-[36px]'>
          {getGreetingMessage(user, location)}
        </div>
      </div>
      <div className='flex-1 flex justify-end items-center gap-4'>
        <ToggleSwitch theme={theme} toggleTheme={toggleTheme} />
        <a href="/Profile" className='' >
          {user && user.profilePicture ? (
            <img
              src={`http://localhost/uploads/${user.profilePicture.split('/').pop()}`}
              alt="Profile"
              className='w-[60px] h-[60px] rounded-[50%] hover:scale-105 shadow-[2px_2px_5px_rgba(0,0,0,0.2)]'
            />
          ) : (
            <div className='bg-white font-bold text-black content-center text-center w-[60px] h-[60px] rounded-[50%] border-[3px] border-[#409A55] hover:scale-105'>{user && user.username ? user.username[0] : 'U'}</div>
          )}
        </a>
      </div>
    </div>
  );
};

export default Header;
