import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar, userRoutes }) => {
    const navigate = useNavigate();

    const goToTrophies = () => {
        navigate('/Trophies', { state: { userRoutes } });
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('id');
        navigate('/');
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <button className="close-btn" onClick={toggleSidebar}>X</button>
            <nav>
                <ul>
                    <li><a href="./UserAcc">Home</a></li>
                    <li><a href="#profile">Profile</a></li>
                    <li><a href="./Activities">Activities</a></li>
                    <li className='T' onClick={goToTrophies}>Trophies</li>
                    <li><a href="#settings">Settings</a></li>
                    <li className="logout" onClick={handleLogout}><a href=".">Logout</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
