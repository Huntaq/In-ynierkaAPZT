import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/sidebar.css';

const Sidebar = ({user, isOpen, toggleSidebar, userRoutes }) => {
    const navigate = useNavigate();

    const goToTrophies = () => {
        navigate('/Trophies', { state: { userRoutes } });
    };
    const goToHome = () => {
        navigate('/UserAcc', { state: { userRoutes } });
    };
    const goToCalendar = () => {
        navigate('/Calendar', { state: { userRoutes } });
    };
    const goToProfile = () => {
        navigate('/Profile', { state: { userRoutes } });
    };
    const goToSettings = () => {
        navigate('/Settings', { state: { userRoutes } });
    };
    const goToActivities = () => {
        navigate('/Activities', { state: { userRoutes } });
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('id');
        navigate('/');
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
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
                    <div className='user-icon'>{user && user.username[0]}</div>
                    )}
                </a>
            </div>
            <button className="close-btn" onClick={toggleSidebar}>X</button>
            
            <nav>
                <ul>
                    <li className='T' onClick={goToHome}>Overview</li>
                    <li className='T' onClick={goToProfile}>Profile</li>
                    <li className='T' onClick={goToActivities}>Activities</li>
                    <li className='T' onClick={goToTrophies}>Trophies</li>
                    <li className='T' onClick={goToCalendar}>Calendar</li>
                    <li className='T' onClick={goToSettings}>Settings</li>
                    <li className="logout" onClick={handleLogout}><a href=".">Logout</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
