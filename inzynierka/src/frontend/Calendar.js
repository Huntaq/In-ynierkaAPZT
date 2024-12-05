import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import '../css/stats.css';
import Modal from 'react-modal';
import Header from './Components/Header';
import 'react-calendar/dist/Calendar.css';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import CalendarComponent from './Components/CalendarCompontent';
import Notifications from './Components/NotificationsModal';

Modal.setAppElement('#root');

const Calendar1 = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          const sessionKey = decodedToken.sessionKey;


          const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'sessionKey': sessionKey
            },
          });


          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData[0]);
            if (userData[0].is_banned === 1) {
              navigate('/Banned');
            }
          } else {
            localStorage.removeItem('authToken');
            navigate('/');
          }

        } catch (err) {
          setError('Wystąpił błąd podczas pobierania danych');
        }
      } else {
        setError('Brak tokena uwierzytelniającego');
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
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    localStorage.setItem('theme', theme);
  };




  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (
    <div className='w-full h-full min-h-screen bg-[#6E9B7B] content-center'>
      <div className='flex w-full max-w-[1440px] min-h-[800px]  h-full justify-self-center gap-[10px] p-[10px]'>
        <div className='w-[20%] max-w-[120px]  rounded-[10px] bg-[#D9EDDF] justify-items-center max-h-[760px]'>
          <Sidebar />
        </div>
        <div className='scrollbar-hide flex w-[100%] bg-[#D9EDDF] max-h-[760px] rounded-[10px] overflow-y-scroll justify-center'>
          <div className='flex justify-start min-h-screeen items-center flex-col w-full max-w-[1600px] justify-self-center'>
            <Header
              user={user}
              theme={theme}
              toggleTheme={toggleTheme}
              toggleSidebar={toggleSidebar}
            />
            <CalendarComponent />
          </div>
        </div>
        <Notifications/>
      </div>
    </div>
  );
};

export default Calendar1;
