import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import '../css/stats.css';
import Modal from 'react-modal';
import Header from './Components/Header';
import Footer from './Components/Footer';
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
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');

      if (token) {
        try {

          const decodedToken = jwtDecode(token);
          const id = decodedToken.id;
          
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
              calculateStreaks(routesData);
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

  const calculateStreaks = (routes) => {
  const uniqueDates = Array.from(new Set(
    routes.map(route => normalizeDate(new Date(route.date)).toDateString())
  ));
  const sortedDates = uniqueDates
    .map(dateStr => new Date(dateStr))
    .sort((a, b) => a - b)

  console.log('Sorted dates:', sortedDates);

  let currentStreakCount = 0;
  let longestStreakCount = 0;
  let previousDate = null;

  sortedDates.forEach(date => {
    if (previousDate === null) {
      currentStreakCount = 1;
    } else {
      const dayDifference = (date - previousDate) / (1000 * 60 * 60 * 24);
      if (dayDifference === 1) {
        currentStreakCount += 1;
      } else if (dayDifference > 1) {
        currentStreakCount = 1;
      }
    }

    longestStreakCount = Math.max(longestStreakCount, currentStreakCount);
    previousDate = date;

    console.log(`Processing date: ${date.toDateString()}`);
    console.log(`Day difference: ${(date - previousDate) / (1000 * 60 * 60 * 24)}`);
    console.log(`Current streak count: ${currentStreakCount}`);
    console.log(`Longest streak count: ${longestStreakCount}`);
  });

  setCurrentStreak(currentStreakCount);
  setLongestStreak(longestStreakCount);
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
      {/* <Footer/> */}
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
