import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './img/earthLogo.png';

const SidebarAdmin = ({ isOpen, toggleSidebar, toggleModal }) => {
    const navigate = useNavigate();
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [Current, setCurrent] = useState('');

    useEffect(() => {
        if (isFirstLoad) {
            toggleModal('overview');
            setCurrent('overview');
            setIsFirstLoad(false);
        }
    }, [isFirstLoad, toggleModal]);

    const showOverview = () => {
        toggleModal('overview');
        setCurrent('overview');
    };
    const showUsers = () => {
        toggleModal('users');
        setCurrent('users');
    };
    const showEvents = () => {
        toggleModal('events');
        setCurrent('events');
    };
    const showNotifications = () => {
        toggleModal('notifications');
        setCurrent('notifications');
    };
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
                <p onClick={showOverview}><img src={Logo} alt='Earth' className='w-[50px] h-[50px]' /></p>
                <button className="w-[40px] h-[40px] bg-[#5ca86e] hover:bg-[#409A55] text-white rounded" onClick={toggleSidebar}>X</button>
            </div>

            <nav className='text-center mt-[100px]'>
                <ul className='[&>li]:cursor-pointer [&>li]:w-[200px] [&>li]:mt-[10px] justify-items-center [&>li]:text-white [&>li]:rounded [&>li]:p-[10px] [&>li]:font-bold'>
                    <li className={`${Current === 'overview' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={showOverview}>
                        Overview
                    </li>
                    <li className={`${Current === 'users' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={showUsers}>
                        Users
                    </li>
                    <li className={`${Current === 'events' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={showEvents}>
                        Events
                    </li>
                    <li className={`${Current === 'notifications' ? 'bg-[#5ca86e] hover:bg-[#409A55]' : 'hover:bg-[#409A55]'}`} onClick={showNotifications}>
                        Notifictions
                    </li>
                </ul>
            </nav>
            <div className="self-center rounded w-[200px] p-[10px] hover:bg-[#409A55] flex justify-center mt-auto text-white font-bold mb-[50px]" onClick={handleLogout}>
                <a href=".">Logout</a>
            </div>
        </div>
    );
};

export default SidebarAdmin;
