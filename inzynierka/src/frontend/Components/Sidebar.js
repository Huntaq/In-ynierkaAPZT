import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './img/earthLogo.png';
import Home from './img/home.png';
import Calendar from './img/calendar.svg';
import Chart from './img/Chart.svg';
import crown from './img/crown.svg';
import settings from './img/settings.svg';
import trophies from './img/trophies.svg';
import logout from './img/logout.svg';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const goToHome = () => {
        navigate('/UserAcc');
    };

    const goToPage = (path) => navigate(path);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('cooldownTimestamp');
        localStorage.removeItem('showPopup');
        navigate('/');
    };

    return (
        <div className={`block overflow-x-hidden h-full flex flex-col max-w-[95%] `}>
            <div className='flex mt-[20px] justify-center items-center'>
                <p onClick={goToHome}><img src={Logo} alt='Earth' className='w-[40px] h-[40px] hover:cursor-pointer' /></p>
            </div>

            <nav className='text-center mt-[20px] max-w-[95%] justify-items-center place-self-center '>
                <ul className='[&>li]:cursor-pointer [&>li]:w-[95%] [&>li]:max-w-[95%] [&>li]:min-w-[95%] [&>li]:p-[10px] [&>li]:mt-[10px] justify-items-center [&>li]:text-[#3B4A3F] [&>li]:rounded [&>li]:font-bold'>
                    <li className={`${location.pathname === '/UserAcc' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={() => goToPage('/UserAcc')}>
                        <img src={Home} alt='Home' className='w-[40px] h-[40px] justify-self-center' />
                        <p className='CustomXSM:hidden'>Home</p>
                    </li>
                    <li className={`${location.pathname === '/Statistics' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={() => goToPage('/Statistics')}>
                        <img src={Chart} alt='Chart' className='w-[40px] h-[40px] justify-self-center' />
                        <p className='CustomXSM:hidden'>Statistics</p>
                    </li>
                    <li className={`${location.pathname === '/Rankings' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={() => goToPage('/Rankings')}>
                        <img src={crown} alt='crown' className='w-[40px] h-[40px] justify-self-center' />
                        <p className='CustomXSM:hidden'>Rankings</p>
                    </li>
                    <li className={`${location.pathname === '/Trophies' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={() => goToPage('/Trophies')}>
                        <img src={trophies} alt='trophy' className='w-[40px] h-[40px] justify-self-center' />
                        <p className='CustomXSM:hidden'>Trophies</p>
                    </li>
                    <li className={`${location.pathname === '/Calendar' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={() => goToPage('/Calendar')}>
                        <img src={Calendar} alt='Calendar' className='w-[40px] h-[40px] justify-self-center' />
                        <p className='CustomXSM:hidden'>Calendar</p>
                    </li>
                    <li className={`${location.pathname === '/Settings' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={() => goToPage('/Settings')}>
                        <img src={settings} alt='settings' className='w-[40px] h-[40px] justify-self-center' />
                        <p className='CustomXSM:hidden'>Settings</p>
                    </li>
                </ul>
            </nav>
            <div className="mt-[30px] rounded w-[90px] p-[10px] hover:bg-[#409A55] justify-items-center justify-center max-w-[95%] text-[#3B4A3F] font-bold " onClick={() => handleLogout('/')}>
                <img src={logout} alt='logout' className='w-[40px] h-[40px] justify-self-center' />
                <a href="."className='CustomXSM:hidden'>Logout</a>
            </div>
        </div>
    );
};

export default Sidebar;
