import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/sidebar.css';
import leaf from './leaf.png';

const Sidebar = ({ user, isOpen, toggleSidebar, userRoutes }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const goToTrophies = () => {
        navigate('/Trophies', { state: { userRoutes: userRoutes || [] } });
    };
    const goToHome = () => {
        navigate('/UserAcc', { state: { userRoutes: userRoutes || [] } });
    };
    const goToCalendar = () => {
        navigate('/Calendar', { state: { userRoutes: userRoutes || [] } });
    };
    const goToSettings = () => {
        navigate('/Settings', { state: { userRoutes: userRoutes || [] } });
    };
    const goToRankings = () => {
        navigate('/Rankings', { state: { userRoutes: userRoutes || [] } });
    };
    const goToStatistics = () => {
        navigate('/Statistics', { state: { userRoutes: userRoutes || [] } });
    };
    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('cooldownTimestamp');
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
                    <li className='T Statistics' onClick={goToStatistics}>Statistics</li>
                    <li className='T Rankings' onClick={goToRankings}>Rankings</li>
                    <li className='T Trophies' onClick={goToTrophies}>Trophies</li>
                    <li className='T Calendar' onClick={goToCalendar}>Calendar</li>
                    <li className='T Settings' onClick={goToSettings}>Settings</li>
                    <li className="logout" onClick={handleLogout}><a href=".">Logout</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
