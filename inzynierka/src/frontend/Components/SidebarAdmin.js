import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/sidebar.css';
import leaf from './leaf.png';

const SidebarAdmin = ({isOpen, toggleSidebar, userRoutes }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const goToTrophies = () => {
        
    };
    const goToHome = () => {
        
    };
    const goToCalendar = () => {
        
    };
    const goToSettings = () => {
        
    };
    const goToRankings = () => {
        
    };
    const goToStatistics = () => {
        
    };
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('cooldownTimestamp');
        localStorage.removeItem('showPopup');
        navigate('/');
    };

    const sidebarClass = `sidebar ${isOpen ? 'open' : ''} ${
        location.pathname === '/Trophies' ? 'trophies-page' :
        location.pathname === '/UserAcc' ? 'home-page' :
        location.pathname === '/Calendar' ? 'calendar-page' :
        location.pathname === '/Settings' ? 'settings-page' :
        location.pathname === '/Rankings' ? 'rankings-page' :
        location.pathname === '/Statistics' ? 'statistics-page' :
        ''
    }`;

    return (
        <div className={sidebarClass}>
            <div className='row centerImg'>
                <p  onClick={goToHome}><img src={leaf} alt='Earth' className='leaf-image inline' /></p>
                <button className="close-btn" onClick={toggleSidebar}>X</button>
            </div>
            
            <nav className='navCenter'>
                <ul>
                    <li className='T Home' onClick={goToHome}>Overview</li>
                    <li className='T Statistics' onClick={goToStatistics}>Users</li>
                    <li className='T Rankings' onClick={goToRankings}>Events</li>
                    <li className='T Trophies' onClick={goToTrophies}>Notifictions</li>
                    <li className="logout" onClick={handleLogout}><a href=".">Logout</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default SidebarAdmin;
