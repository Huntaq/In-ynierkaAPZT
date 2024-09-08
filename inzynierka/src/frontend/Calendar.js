import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import '../css/stats.css';
import Modal from 'react-modal';
import Header from './Components/Header';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { jwtDecode } from "jwt-decode";
Modal.setAppElement('#root');

const Calendar1 = () => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyActivities, setDailyActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          } else {
            setError('Błąd podczas pobierania danych użytkownika');
          }

          const routesResponse = await fetch(`http://localhost:5000/api/users/${userId}/routes`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'sessionKey': sessionKey
            },
          });


          if (routesResponse.ok) {
            const routesData = await routesResponse.json();
            setUserRoutes(routesData);
          } else {
            setError('Błąd podczas pobierania tras użytkownika');
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

  useEffect(() => {
    const activities = userRoutes.filter(route => {
      const routeDate = normalizeDate(new Date(route.date));
      return (
        routeDate.getDate() === selectedDate.getDate() &&
        routeDate.getMonth() === selectedDate.getMonth() &&
        routeDate.getFullYear() === selectedDate.getFullYear()
      );
    });
    setDailyActivities(activities);
  }, [selectedDate, userRoutes]);

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const activities = userRoutes.filter(route => {
      const routeDate = normalizeDate(new Date(route.date));
      return (
        routeDate.getDate() === date.getDate() &&
        routeDate.getMonth() === date.getMonth() &&
        routeDate.getFullYear() === date.getFullYear()
      );
    });
    setDailyActivities(activities);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const normalizeDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };
  const getTransportModeName = (id) => {
    switch(id) {
      case 1:
        return 'Bieganie';
      case 2:
        return 'Rower';
      default:
        return 'Nieznany tryb';
    }
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (
    <div className='container'>
      <Sidebar isOpen={sidebarOpen} user={user} toggleSidebar={toggleSidebar} userRoutes={userRoutes} />
      <Header 
        user={user} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        toggleSidebar={toggleSidebar} 
      />
      <div className="row">
        <div className='backgroundCalendar'>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileClassName={({ date }) => {
              const isActiveDay = userRoutes.some(route => {
                const routeDate = normalizeDate(new Date(route.date));
                return (
                  routeDate.toDateString() === date.toDateString()
                );
              });
              return isActiveDay ? 'react-calendar__tile--highlighted' : null;
            }}
          />
        </div>
        
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Daily Activities"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Aktywności z dnia {selectedDate.toLocaleDateString()}</h2>
        {dailyActivities.length > 0 ? (
          <ul>
            {dailyActivities.map((activity, index) => (
              <li key={index}>
                {getTransportModeName(activity.transport_mode_id)} - {activity.distance_km} km - {activity.duration} - CO2: {activity.CO2} kg - kcal: {activity.kcal}
              </li>
            ))}
          </ul>
        ) : (
          <p>Brak aktywności na ten dzień.</p>
        )}
        <button className='button' onClick={closeModal}>Zamknij</button>
      </Modal>
    </div>
  );
};

export default Calendar1;
