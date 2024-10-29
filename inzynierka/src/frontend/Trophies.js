import React, { useEffect, useState, useRef } from 'react';
import '../css/trophies.css';
import Sidebar from './Components/Sidebar';
import '../css/stats.css';
import Header from './Components/Header';
import { jwtDecode } from "jwt-decode";
import TrophyList from './Components/TrophyList';
import confetti from "canvas-confetti";
import { useNavigate } from 'react-router-dom';

const Trophies = () => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [runningDistance, setRunningDistance] = useState(0);
  const [cyclingDistance, setCyclingDistance] = useState(0);
  const [Co2Saved, setCo2Saved] = useState(0);
  const [CaloriesBurned, setCaloriesBurned] = useState(0);
  const [MoneySaved, setMoneySaved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({});
  const popupRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 360,
      origin: { y: 0.6 },
      colors: ['#ff0', '#0f0', '#00f', '#f00', '#0ff', '#f0f'],
      scalar: 2,
    });
  };
  const handleTrophyEventClickConfetti = () => {
    triggerConfetti();
  };
  const getTrophyLevel = (distance) => {
    if (distance >= 100) return { level: 5, color: 'gold', next: 0 };
    if (distance >= 75) return { level: 4, color: 'silver', next: 100 - distance };
    if (distance >= 50) return { level: 3, color: 'bronze', next: 75 - distance };
    if (distance >= 20) return { level: 2, color: 'blue', next: 50 - distance };
    if (distance >= 10) return { level: 1, color: 'green', next: 20 - distance };
    return { level: 0, color: 'grey', next: 10 - distance };
  };

  const getTrophyLevelForStats = (value, thresholds) => {
    if (value >= thresholds[4]) return { level: 5, color: 'gold', next: 0 };
    if (value >= thresholds[3]) return { level: 4, color: 'silver', next: thresholds[4] - value };
    if (value >= thresholds[2]) return { level: 3, color: 'bronze', next: thresholds[3] - value };
    if (value >= thresholds[1]) return { level: 2, color: 'blue', next: thresholds[2] - value };
    if (value >= thresholds[0]) return { level: 1, color: 'green', next: thresholds[1] - value };
    return { level: 0, color: 'grey', next: thresholds[0] - value };
  };

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

            if (userData[0].is_banned === 1) {
              navigate('/Banned');
            }
            const routesResponse = await fetch(`http://localhost:5000/api/users/${id}/routes`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'sessionKey': sessionKey
              },
            });

            if (routesResponse.ok) {
              const routesData = await routesResponse.json();
              setUserRoutes(routesData);

              const runningDistance = routesData
                .filter(route => route.transport_mode_id === 1)
                .reduce((acc, route) => acc + route.distance_km, 0);
              const cyclingDistance = routesData
                .filter(route => route.transport_mode_id === 2)
                .reduce((acc, route) => acc + route.distance_km, 0);

              const totalCo2Saved = routesData.reduce((acc, route) => acc + route.CO2, 0);
              const totalCaloriesBurned = routesData.reduce((acc, route) => acc + route.kcal, 0);
              const totalMoneySaved = routesData.reduce((acc, route) => acc + route.money, 0);

              setRunningDistance(runningDistance);
              setCyclingDistance(cyclingDistance);
              setCo2Saved(totalCo2Saved);
              setCaloriesBurned(totalCaloriesBurned);
              setMoneySaved(totalMoneySaved);
            } else {
              localStorage.removeItem('authToken');
              navigate('/');
            }
            const eventsResponse = await fetch('http://localhost:5000/api/event/thropies', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'sessionKey': sessionKey,
              },
            });

            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json();

              const filteredEvents = eventsData.filter(event => {
                const userIdsArray = event.user_ids ? event.user_ids.split(',').map(id => parseInt(id, 10)) : [];
                return userIdsArray.includes(id);
              });

              setEvents(filteredEvents);
            } else {
              setError('Błąd podczas pobierania danych wydarzeń');
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleTrophyEventClick = (event) => {
    setSelectedEvent(event);
    handleTrophyEventClickConfetti();
  };
  const handleCloseEventModal = () => {
    setSelectedEvent(null);
  };
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    localStorage.setItem('theme', theme);
  };

  const runningTrophy = getTrophyLevel(runningDistance);
  const cyclingTrophy = getTrophyLevel(cyclingDistance);

  const co2Trophy = getTrophyLevelForStats(Co2Saved, [10, 20, 50, 75, 100]);
  const caloriesTrophy = getTrophyLevelForStats(CaloriesBurned, [1000, 2000, 5000, 7500, 10000]);
  const moneyTrophy = getTrophyLevelForStats(MoneySaved, [50, 100, 200, 500, 1000]);

  const handleTrophyClick = (trophyType) => {
    let content;
    switch (trophyType) {
      case 'running':
        content = {
          title: '🏃‍♂️ Running',
          level: runningTrophy.level,
          detail: `Distance covered: ${runningDistance.toFixed(2)} km`,
          fact: 'Running improves cardiovascular and lung health.',
        };
        break;
      case 'cycling':
        content = {
          title: '🚴‍♂️ Cycling',
          level: cyclingTrophy.level,
          detail: `Distance covered: ${cyclingDistance.toFixed(2)} km`,
          fact: 'Cycling is great exercise for the lower body.',
        };
        break;
      case 'co2':
        content = {
          title: '🌍 CO2 Savings',
          level: co2Trophy.level,
          detail: `CO2 saved: ${Co2Saved.toFixed(2)} kg`,
          fact: 'Saving CO2 helps combat climate change.',
        };
        break;
      case 'calories':
        content = {
          title: '🔥 Calories Burned',
          level: caloriesTrophy.level,
          detail: `Calories burned: ${CaloriesBurned.toFixed(2)} kcal`,
          fact: 'Burning calories improves overall body fitness.',
        };
        break;
      case 'money':
        content = {
          title: '💸 Money Saved',
          level: moneyTrophy.level,
          detail: `Money saved: ${MoneySaved.toFixed(2)} zł`,
          fact: 'Saving money allows for future investments.',
        };
        break;
      default:
        content = {};
    }
    setPopupContent(content);
    setPopupVisible(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        if (popupVisible) {
          setPopupVisible(false);
        }
        if (selectedEvent) {
          setSelectedEvent(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupVisible, selectedEvent]);

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
      <h2>🏅 Your Trophies 🏅</h2>
      <div className="events-container">
        {events.length > 0 && (
          <ul className="UniqueThropies ">
            {events.map(event => (
              <li key={event.id} className="UniqueThropy HoverTrophy" onClick={() => handleTrophyEventClick(event)}>
                <img src={`http://localhost/uploads/${event.TrophyImage.split('/').pop()}`} alt={event.title} />
              </li>
            ))}
          </ul>
        )}

        {selectedEvent && (
          <div className="modalEvent">
            <div className="modal-contentEvent" ref={popupRef}>
              <span className="close" onClick={handleCloseEventModal}>&times;</span>
              <div className='row EventTitle'><p>! Congratiulations !</p></div>
              <div className='row EventTitle'><p>Trophy earned by competing in</p></div>
              <div className='row EventDesc'><p>{selectedEvent.title} Event!</p></div>
            </div>
          </div>
        )}
      </div>
      <div className="trophies-container testyy">
        <TrophyList
          runningDistance={runningDistance}
          cyclingDistance={cyclingDistance}
          Co2Saved={Co2Saved}
          CaloriesBurned={CaloriesBurned}
          MoneySaved={MoneySaved}
          handleTrophyClick={handleTrophyClick}
        />
      </div>
      {popupVisible && (
        <div className="popup1">
          <div className="popup1-content" ref={popupRef}>
            <p className='headerModalTrophy'>{popupContent.title}</p>
            <p>Level: {popupContent.level}</p>
            <p>{popupContent.detail}</p>
            <p>{popupContent.fact}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trophies;
