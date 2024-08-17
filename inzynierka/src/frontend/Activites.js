import React, { useEffect, useState } from 'react';
import Chart from './Components/Chart';
import MonthSelector from './Components/MonthSelector';
import Sidebar from './Components/Sidebar';
import '../css/stats.css';
import Modal from 'react-modal';
import Header from './Components/Header';
import Footer from './Components/Footer';
import 'react-calendar/dist/Calendar.css';

Modal.setAppElement('#root');

const Activities = () => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [transportMode, setTransportMode] = useState(1);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyActivities, setDailyActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      const id = localStorage.getItem('id');

      if (token && id) {
        try {
          const userResponse = await fetch(`http://localhost:5000/api/users/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData[0]);

            const routesResponse = await fetch(`http://localhost:5000/api/users/${id}/routes`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (routesResponse.ok) {
              const routesData = await routesResponse.json();
              setUserRoutes(routesData);
            } else {
              setError('Błąd podczas pobierania danych tras użytkownika');
            }
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
  useEffect(() => {
    const activities = userRoutes.filter(route => {
      const routeDate = new Date(route.date);
      return (
        routeDate.getDate() === selectedDate.getDate() &&
        routeDate.getMonth() === selectedDate.getMonth() &&
        routeDate.getFullYear() === selectedDate.getFullYear() &&
        route.transport_mode_id === transportMode
      );
    });
    setDailyActivities(activities);
  }, [selectedDate, userRoutes, transportMode]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleTransportChange = (selectedMode) => {
    setTransportMode(selectedMode);
  };
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    localStorage.setItem('theme', theme);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (
    <div className='container'>
      <Sidebar isOpen={sidebarOpen}user={user}  toggleSidebar={toggleSidebar} userRoutes={userRoutes} />
      <Header 
        user={user} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        toggleSidebar={toggleSidebar} 
      />
      <div className="row">
        <div className='activities backgroundChart'>
          <MonthSelector onMonthChange={handleMonthChange} onTransportChange={handleTransportChange} />
          <Chart month={month} year={year} transportMode={transportMode} userRoutes={userRoutes} />
        </div>
      </div>
      <Footer/>
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
                {activity.distance_km} km - {activity.duration} - CO2: {activity.CO2} kg - kcal: {activity.kcal}
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

export default Activities;
