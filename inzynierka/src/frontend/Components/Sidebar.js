import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/sidebar.css';
import leaf from './leaf.png';

const Sidebar = ({isOpen, toggleSidebar, userRoutes }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const goToTrophies = () => {
        navigate('/Trophies' );
    };
    const goToHome = () => {
        navigate('/UserAcc' );
    };
    const goToCalendar = () => {
        navigate('/Calendar');
    };
    const goToSettings = () => {
        navigate('/Settings');
    };
    const goToRankings = () => {
        navigate('/Rankings');
    };
    const goToStatistics = () => {
        navigate('/Statistics');
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
            
            <nav className='navCenter '>
                <ul>
                    <li className='Home' onClick={goToHome}>Overview</li>
                    <li className='Statistics' onClick={goToStatistics}>Statistics</li>
                    <li className='Rankings' onClick={goToRankings}>Rankings</li>
                    <li className='Trophies' onClick={goToTrophies}>Trophies</li>
                    <li className='Calendar' onClick={goToCalendar}>Calendar</li>
                    <li className='Settings' onClick={goToSettings}>Settings</li>
                    <li className="logout" onClick={handleLogout}><a href=".">Logout</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
