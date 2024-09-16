import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/sidebar.css';
import leaf from './leaf.png';

const SidebarAdmin = ({isOpen, toggleSidebar, toggleModal}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    useEffect(() => {
        if (isFirstLoad) {
            toggleModal('overview');
            setIsFirstLoad(false); 
        }
    }, [isFirstLoad, toggleModal]);

    const showOverview = () => {
        toggleModal('overview');
    };
    const showUsers = () => {
        toggleModal('users');
    };
    const showEvents = () => {
        toggleModal('events');
    };
    const showNotifications = () => {
        toggleModal('notifications');
    };
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('cooldownTimestamp');
        localStorage.removeItem('showPopup');
        navigate('/');
    };

    const sidebarClass = `sidebar ${isOpen ? 'open' : ''}`;

    return (
        <div className={sidebarClass}>
            <div className='row centerImg'>
                <p  onClick={showOverview}><img src={leaf} alt='Earth' className='leaf-image inline' /></p>
                <button className="close-btn" onClick={toggleSidebar}>X</button>
            </div>
            
            <nav className='navCenter'>
                <ul>
                    <li className='T Home' onClick={showOverview}>Overview</li>
                    <li className='T Statistics' onClick={showUsers}>Users</li>
                    <li className='T Rankings' onClick={showEvents}>Events</li>
                    <li className='T Trophies' onClick={showNotifications}>Notifictions</li>
                    <li className="logout" onClick={handleLogout}><a href=".">Logout</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default SidebarAdmin;
