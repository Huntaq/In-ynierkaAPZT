import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/sidebar.css';
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
        <div className={`block fixed w-0 z-50 overflow-x-hidden h-full left-0 sidebar bg-[#8ac598] ${isOpen ? 'w-[300px]' : ''}`}>
            <div className='flex mt-[20px] justify-between pr-[10px] items-center'>
                <p className='w-[60px] h-[60px]'></p>
                <p onClick={goToHome}><img src={leaf} alt='Earth' className='w-[60px] h-[60px]' /></p>
                <button className="w-[40px] h-[40px] bg-[#5ca86e] hover:bg-[#409A55] text-white rounded" onClick={toggleSidebar}>X</button>
            </div>

            <nav className='text-center mt-[100px]'>
                <ul className='[&>li]:w-[200px] [&>li]:mt-[10px] justify-items-center'>
                    <li className={` Overwiev ${location.pathname === '/UserAcc' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : ''}`}onClick={() => goToPage('/UserAcc')}>
                        Overview
                    </li>
                    <li className={`Statistics ${location.pathname === '/Statistics' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : ''}`}onClick={() => goToPage('/Statistics')}>
                        Statistics
                    </li>
                    <li className={`Rankings ${location.pathname === '/Rankings' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : ''}`}onClick={() => goToPage('/Rankings')}>
                        Rankings
                    </li>
                    <li className={`Trophies ${location.pathname === '/Trophies' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : ''}`}onClick={() => goToPage('/Trophies')}>
                        Trophies
                    </li>
                    <li className={`Calendar ${location.pathname === '/Calendar' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : ''}`}onClick={() => goToPage('/Calendar')}>
                        Calendar
                    </li>
                    <li className={`Settings ${location.pathname === '/Settings' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : ''}`}onClick={() => goToPage('/Settings')}>
                        Settings
                    </li>
                    <li className="logout" onClick={() => handleLogout('/')}>
                        <a href=".">Logout</a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
