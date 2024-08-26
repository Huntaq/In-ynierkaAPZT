import React, { useEffect, useState } from 'react';
import '../css/stats.css';
import Distance from './Components/Distance';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import earthImage from './Components/earth.png';
import meter from './Components/meter.png';
import PLN from './Components/PLN';
import Chart from './Components/Chart';
import MonthSelector from './Components/MonthSelector';
import Trophy from './Components/Trophy';
import { jwtDecode } from "jwt-decode";
import SettingsPopup from './Components/SettingsPopup';

const UserAcc = () => {
  const [user, setUser] = useState(null);
  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [transportMode, setTransportMode] = useState(1);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [trophies, setTrophies] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);

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
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('cooldownTimestamp');
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
            calculateTrophies(routesData);
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

  const calculateTrophies = (routes) => {
    const runningDistance = routes
      .filter(route => route.transport_mode_id === 1)
      .reduce((acc, route) => acc + route.distance_km, 0);

    const cyclingDistance = routes
      .filter(route => route.transport_mode_id === 2)
      .reduce((acc, route) => acc + route.distance_km, 0);

    const trophiesList = [
      { type: 'running', isEarned: runningDistance >= 100 },
      { type: 'cycling', isEarned: cyclingDistance >= 100 }
    ];

    setTrophies(trophiesList);
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

  return (
    <div className='container'>
      <Sidebar isOpen={sidebarOpen} user={user} toggleSidebar={toggleSidebar} userRoutes={userRoutes} />
      <Header
        user={user}
        theme={theme}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
      />
      <div className='row'>
        <button className="button" onClick={() => setPopupVisible(true)}>Layout</button>

        {popupVisible && (
          <SettingsPopup
            sections={sections}
            toggleSectionVisibility={toggleSectionVisibility}
            onClose={() => setPopupVisible(false)}
          />
        )}

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
                    {trophies.length > 0 ? (
                      trophies.map((trophy) => (
                        <Trophy key={trophy.type} type={trophy.type} isEarned={trophy.isEarned} />
                      ))
                    ) : (
                      <p>No trophies earned yet</p>
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
    </div>
  );
};

export default UserAcc;
