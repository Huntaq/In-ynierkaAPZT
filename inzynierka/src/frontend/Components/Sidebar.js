import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import leaf from './leaf.png';

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
        <div className={`shadow-[5px_0_15px_rgba(0,0,0,0.3)] block fixed w-0 z-50 overflow-x-hidden h-full left-0 transition-all duration-500 ease-in-out bg-[#8ac598] ${isOpen ? 'w-[300px]' : ''} flex flex-col`}>
            <div className='flex mt-[20px] justify-between pr-[40px] items-center'>
                <p className='w-[60px] h-[60px]'></p>
                <p onClick={goToHome}><img src={leaf} alt='Earth' className='w-[50px] h-[50px]' /></p>
                <button className="w-[40px] h-[40px] bg-[#5ca86e] hover:bg-[#409A55] text-white rounded" onClick={toggleSidebar}>X</button>
            </div>

            <nav className='text-center mt-[100px]'>
                <ul className='[&>li]:cursor-pointer [&>li]:w-[200px] [&>li]:mt-[10px] justify-items-center [&>li]:text-white [&>li]:rounded [&>li]:p-[10px] [&>li]:font-bold'>
                    <li className={`${location.pathname === '/UserAcc' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={() => goToPage('/UserAcc')}>
                        Overview
                    </li>
                    <li className={`${location.pathname === '/Statistics' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={() => goToPage('/Statistics')}>
                        Statistics
                    </li>
                    <li className={`${location.pathname === '/Rankings' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={() => goToPage('/Rankings')}>
                        Rankings
                    </li>
                    <li className={`${location.pathname === '/Trophies' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={() => goToPage('/Trophies')}>
                        Trophies
                    </li>
                    <li className={`${location.pathname === '/Calendar' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={() => goToPage('/Calendar')}>
                        Calendar
                    </li>
                    <li className={`${location.pathname === '/Settings' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={() => goToPage('/Settings')}>
                        Settings
                    </li>
                </ul>
            </nav>
            <div className="self-center rounded w-[200px] p-[10px] hover:bg-[#409A55] flex justify-center mt-auto text-white font-bold mb-[50px]" onClick={() => handleLogout('/')}>
                <a href=".">Logout</a>
            </div>
        </div>
    );
};

export default Sidebar;
