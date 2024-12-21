import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/stats.css';
import { useLocation } from 'react-router-dom';



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

const Header = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  function GoToProfile(){
    navigate('/Profile');
  }
  return (
    <div className='pl-[50px] pr-[50px] flex items-center w-full justify-between mt-[5px] p-[5px] box-border'>
      <div>
        <div className='flex-1 hidden sm:block content-center text-[#3B4A3F] font-bold text-[36px]'>
          {getGreetingMessage(user, location)}
        </div>
      </div>
      <div className='flex-1 flex justify-end items-center gap-4 '>
        
        <div onClick={GoToProfile} className='hover:scale-105 hover:cursor-pointer'>
          {user && user.profilePicture ? (
            <img
              src={`http://localhost:3000/uploads/${user.profilePicture.split('/').pop()}`}
              alt="Profile"
              className='w-[60px] h-[60px] rounded-[50%] hover:scale-105 shadow-[2px_2px_5px_rgba(0,0,0,0.2)]'
            />
          ) : (
            <div className='bg-white font-bold text-black content-center text-center w-[60px] h-[60px] rounded-[50%]  border-[#409A55] hover:scale-105'>{user && user.username ? <img className='w-[60px] h-[60px] rounded-[50%]' src='./empty-avatar.jpg'/> : 'U'}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
