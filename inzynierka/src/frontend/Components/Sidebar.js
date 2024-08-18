import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/sidebar.css';

const Sidebar = ({ user, isOpen, toggleSidebar, userRoutes }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Uzyskaj bieżącą lokalizację

    const goToTrophies = () => {
        navigate('/Trophies', { state: { userRoutes: userRoutes || [] } });
    };
    const goToHome = () => {
        navigate('/UserAcc', { state: { userRoutes: userRoutes || [] } });
    };
    const goToCalendar = () => {
        navigate('/Calendar', { state: { userRoutes: userRoutes || [] } });
    };
    const goToProfile = () => {
        navigate('/Profile', { state: { userRoutes: userRoutes || [] } });
    };
    const goToSettings = () => {
        navigate('/Settings', { state: { userRoutes: userRoutes || [] } });
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('id');
        navigate('/');
    };

    // Stylizacja w zależności od lokalizacji
    const sidebarClass = `sidebar ${isOpen ? 'open' : ''} ${
        location.pathname === '/Trophies' ? 'trophies-page' :
        location.pathname === '/UserAcc' ? 'home-page' :
        location.pathname === '/Calendar' ? 'calendar-page' :
        location.pathname === '/Profile' ? 'profile-page' :
        location.pathname === '/Settings' ? 'settings-page' :
        ''
    }`;

    return (
        <div className={sidebarClass}>
            <div className='row centerImg'>
                <a href="/Profile" className='user-info inline margin-left1' style={{ textDecoration: 'none' }}>
                    {user && user.profilePicture ? (
                        <img 
                            src={user.profilePicture} 
                            alt="Profile" 
                            className='user-icon' 
                            style={{ borderRadius: '50%', width: '60px', height: '60px' }} 
                        />
                    ) : (
                        <div className='user-icon'>{user && user.username ? user.username[0] : 'U'}</div>
                    )}
                </a>
            </div>
            <button className="close-btn" onClick={toggleSidebar}>X</button>
            
            <nav>
                <ul>
                    <li className='T Home' onClick={goToHome}>Overview</li>
                    <li className='T Profile' onClick={goToProfile}>Profile</li>
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
