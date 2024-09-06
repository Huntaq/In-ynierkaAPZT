import React, { useEffect, useState, useRef } from 'react';
import '../css/trophies.css';
import Sidebar from './Components/Sidebar';
import '../css/stats.css';
import Header from './Components/Header';
import { jwtDecode } from "jwt-decode";

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
      if (popupVisible && popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popupVisible]);

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
      <div className="trophies-container">
        <div className="trophy-list">
          <div className={`trophy row level-${runningTrophy.level}`} onClick={() => handleTrophyClick('running')}>
            <div className="trophy-header">
              <h3 className="trophy-title">🏃‍♂️ Running </h3>
              <h3 className="trophy-level">Level {runningTrophy.level}</h3>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${(100 - (runningTrophy.next / (runningTrophy.next + runningDistance)) * 100).toFixed(2)}%` }}>
              </div>
            </div>
          </div>

          <div className={`trophy row level-${cyclingTrophy.level}`} onClick={() => handleTrophyClick('cycling')}>
            <div className="trophy-header">
              <h3 className="trophy-title">🚴‍♂️ Cycling </h3>
              <h3 className="trophy-level">Level {cyclingTrophy.level}</h3>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${(100 - (cyclingTrophy.next / (cyclingTrophy.next + cyclingDistance)) * 100).toFixed(2)}%` }}>
              </div>
            </div>
          </div>

          <div className={`trophy row level-${co2Trophy.level}`} onClick={() => handleTrophyClick('co2')}>
            <div className="trophy-header">
              <h3 className="trophy-title">🌍 CO2 Savings </h3>
              <h3 className="trophy-level">Level {co2Trophy.level}</h3>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${(100 - (co2Trophy.next / (co2Trophy.next + Co2Saved)) * 100).toFixed(2)}%` }}>
              </div>
            </div>
          </div>

          <div className={`trophy row level-${caloriesTrophy.level}`} onClick={() => handleTrophyClick('calories')}>
            <div className="trophy-header">
              <h3 className="trophy-title">🔥 Calories Burned </h3>
              <h3 className="trophy-level">Level {caloriesTrophy.level}</h3>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${(100 - (caloriesTrophy.next / (caloriesTrophy.next + CaloriesBurned)) * 100).toFixed(2)}%` }}>
              </div>
            </div>
          </div>

          <div className={`trophy row level-${moneyTrophy.level}`} onClick={() => handleTrophyClick('money')}>
            <div className="trophy-header">
              <h3 className="trophy-title">💸 Money Saved </h3>
              <h3 className="trophy-level">Level {moneyTrophy.level}</h3>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${(100 - (moneyTrophy.next / (moneyTrophy.next + MoneySaved)) * 100).toFixed(2)}%` }}>
              </div>
            </div>
          </div>
        </div>
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
