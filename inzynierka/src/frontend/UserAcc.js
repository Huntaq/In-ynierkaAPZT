import React, { useEffect, useState, useRef } from 'react';
import '../css/stats.css';
import Distance from './Components/Distance';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import earthImage from './Components/earth.png';
import meter from './Components/meter.png';
import PLN from './Components/PLN';
import Chart from './Components/Chart';
import MonthSelector from './Components/MonthSelector';
import { jwtDecode } from "jwt-decode";
import SettingsPopup from './Components/SettingsPopup';
import TrophyList from './Components/TrophyList';
import { useNavigate } from 'react-router-dom';

const UserAcc = () => {
  const [user, setUser] = useState(null);
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
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [transportMode, setTransportMode] = useState(1);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState({});
  const [popupVisible1, setPopupVisible1] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationPopupVisible, setNotificationPopupVisible] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);

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


  const defaultSections = [
    { id: 'co2', label: 'CO2 Saved', visible: true },
    { id: 'pln', label: 'PLN Saved', visible: true },
    { id: 'streak', label: 'Current Streak', visible: true },
    { id: 'Test', label: 'Test', visible: false },
    // tu bedzie wiecej sekcji 
  ];

  const [sections, setSections] = useState(() => {
    const savedSections = localStorage.getItem('userSections');
    return savedSections ? JSON.parse(savedSections) : defaultSections;
  });

  useEffect(() => {
    localStorage.setItem('userSections', JSON.stringify(sections));
  }, [sections]);

  const toggleSectionVisibility = (id) => {
    setSections(prevSections =>
      prevSections.map(section =>
        section.id === id ? { ...section, visible: !section.visible } : section
      )
    );
  };

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
            if (userData[0].id === 48) {
              setShowAdminButton(true);
            }
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('cooldownTimestamp');
            navigate('/');
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
            calculateStreaks(routesData);

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

            const showPopup = localStorage.getItem('showPopup') === 'true';



            if (showPopup) {
              const notificationsResponse = await fetch(`http://localhost:5000/api/notifications/popup`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (notificationsResponse.ok) {
                const notificationsData = await notificationsResponse.json();
                setNotifications(notificationsData);
                setNotificationPopupVisible(notificationsData.length > 0);
              } else {
                setError('Błąd podczas pobierania powiadomień');
              }
            }
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
  }, [navigate]);
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
        setNotificationPopupVisible(false);
        localStorage.setItem('showPopup', 'false');
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popupRef, notificationPopupVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupVisible && popupRef.current && !popupRef.current.contains(event.target)) {
        setPopupVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [popupVisible]);
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const calculateStreaks = (routes) => {
    const uniqueDates = Array.from(new Set(
      routes.map(route => normalizeDate(new Date(route.date)).toDateString())
    ));
    const sortedDates = uniqueDates
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => a - b);

    let longestStreakCount = 0;
    let currentStreakCount = 0;
    let previousDate = null;

    sortedDates.forEach((date, index) => {
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
    });

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (sortedDates.length > 0) {
      const lastActivityDate = sortedDates[sortedDates.length - 1];
      const dayDifferenceWithYesterday = (yesterday - lastActivityDate) / (1000 * 60 * 60 * 24);
      const dayDifferenceWithToday = (today - lastActivityDate) / (1000 * 60 * 60 * 24);

      if (dayDifferenceWithYesterday > 1 && dayDifferenceWithToday > 1) {
        currentStreakCount = 0;
      }
    } else {
      currentStreakCount = 0;
    }

    setCurrentStreak(currentStreakCount);
    setLongestStreak(longestStreakCount);
  };

  const normalizeDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  const handleTransportChange = (selectedMode) => {
    setTransportMode(selectedMode);
  };
  const totalCO2 = userRoutes.reduce((acc, route) => acc + route.CO2, 0);
  const totalMoney = userRoutes.reduce((acc, route) => acc + route.money, 0);

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 30);

  const averageCO2PerKm = 0.12;
  const savedKm = totalCO2 / averageCO2PerKm;
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const showNextNotification = () => {
    setCurrentNotificationIndex((prevIndex) =>
      (prevIndex + 1) % notifications.length
    );
  };

  const showPreviousNotification = () => {
    setCurrentNotificationIndex((prevIndex) =>
      (prevIndex - 1 + notifications.length) % notifications.length
    );
  };
  return (

    <div className='container'>
      <Sidebar isOpen={sidebarOpen} user={user} toggleSidebar={toggleSidebar} userRoutes={userRoutes} />
      <Header
        user={user}
        theme={theme}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
      />

      <div className='row layout'>
        {showAdminButton && (
          <button onClick={() => navigate('/AdminPanel')} className="button admin">
            Admin
          </button>
        )}
        <button className="button " onClick={() => setPopupVisible1(true)}>Layout</button>

        {popupVisible1 && (
          <SettingsPopup
            sections={sections}
            toggleSectionVisibility={toggleSectionVisibility}
            onClose={() => setPopupVisible1(false)}
          />
        )}

      </div>
      <div className='row'>
        {sections.map((section) => {

          if (!section.visible) return null;

          switch (section.id) {
            case 'co2':
              return (
                <div className='row' key={section.id}>
                  <div className='backgroundInfo'>
                    <p className='textStyleActivity'>CO2 Saved</p>
                    <Distance totalCO2={totalCO2.toFixed(2)} />
                  </div>
                  <div className='background'>
                    <p className='Co2Info'>You have saved as much CO₂ as would be produced by driving approximately {savedKm.toFixed(0)} kilometers by car.</p>
                    <img src={earthImage} alt='Earth' className='earth-image' />
                  </div>
                </div>
              );
            case 'pln':
              return (
                <div className='row' key={section.id}>
                  <div className='backgroundInfo'>
                    <p className='textStyleActivity'>PLN Saved</p>
                    <PLN totalMoney={totalMoney.toFixed(2)} />
                  </div>
                  <div className='background1'>
                    <MonthSelector onMonthChange={handleMonthChange} onTransportChange={handleTransportChange} />
                    <Chart month={month} year={year} transportMode={transportMode} userRoutes={userRoutes} />
                  </div>
                </div>
              );
            case 'streak':
              return (
                <div className='row' key={section.id}>
                  <div className='backgroundInfo'>
                    <p className='textStyleActivity'>Current Streak</p>
                    <div className='row'>
                      <p className='StreakInfo'>{currentStreak} </p>
                      <img src={meter} alt='Earth' className='meterimage inline' />
                    </div>
                    <p className='textStyleActivity'>Longest Streak 🔥: {longestStreak}</p>
                  </div>
                  <div className='background2'>
                    <h2>🏅 Your Trophies 🏅</h2>
                    <TrophyList
                      runningDistance={runningDistance}
                      cyclingDistance={cyclingDistance}
                      Co2Saved={Co2Saved}
                      CaloriesBurned={CaloriesBurned}
                      MoneySaved={MoneySaved}
                      handleTrophyClick={handleTrophyClick}
                    />
                    {notifications.length > 0 && (
                      <>
                        <div className={`notification-overlay ${notificationPopupVisible ? 'visible' : ''}`}></div>
                        <div className={`notification-popup ${notificationPopupVisible ? 'visible' : ''}`} ref={popupRef}>
                          <div className="notification-content">
                            <div className='row'>
                            <h3>{notifications[currentNotificationIndex]?.header} </h3>
                            </div>
                            <div className='row popupNotification'>
                            <p>{notifications[currentNotificationIndex]?.content}</p>
                            </div>
                          </div>
                          <div className="notification-controls">
                            <button className='button' onClick={showPreviousNotification} disabled={notifications.length <= 1}>
                              Previous
                            </button>
                            <button  className='button'onClick={showNextNotification} disabled={notifications.length <= 1}>
                              Next
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            case 'Test':
              return (
                <div className='row' key={section.id}>
                  <div className='backgroundInfo'>
                    <p>Test1</p>
                  </div>
                  <div className='background1'>
                    <p>Test2</p>
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
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

export default UserAcc;
