import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import '../css/Settings.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { jwtDecode } from "jwt-decode";
const Settings = () => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
  
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const id = decodedToken.id;
          const sessionKey = decodedToken.sessionKey;

          const userResponse = await fetch(`http://localhost:5000/api/users/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'sessionKey': sessionKey
            },
          });
  
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData[0]);
          } else {
            setError('Błąd podczas pobierania danych użytkownika');
          }
        } catch (err) {
          setError('Wystąpił błąd podczas pobierania danych');
        }
      } else {
        setError('Użytkownik nie jest zalogowany');
      }
      setLoading(false);
    };
  
    fetchUserData();
  }, []);
  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    localStorage.setItem('theme', theme);
  };


  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (
    <div className='container'>
      <Sidebar 
        isOpen={sidebarOpen} 
        user={user}  
        toggleSidebar={toggleSidebar} 
        userRoutes={userRoutes} 
      />
      <Header 
        user={user} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        toggleSidebar={toggleSidebar} 
      />
      <div className='row'>
        <div className="rest-content">
          <div className='Problem FAQ'>
            <a className='none'>FAQ</a>
          </div>
          <div className='row'>
            <p>I have a problem</p>
          </div>
          <div className='row'>
            <div className='Problem'>
              siema
            </div>
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  );
  
};

export default Settings;
