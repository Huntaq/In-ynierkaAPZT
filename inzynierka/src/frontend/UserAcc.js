import React, { useEffect, useState } from 'react';
import '../css/stats.css';
import Distance from './Components/Distance';
import RecentDistance from './Components/RecentDistance';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import Footer from './Components/Footer';
import earthImage from './Components/earth.png';
import PLN from './Components/PLN';
import Chart from './Components/Chart';
import MonthSelector from './Components/MonthSelector';


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
        setLoading(false);
      } else {
        setError('Użytkownik nie jest zalogowany');
        setLoading(false);
      }
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
    // Normalizowanie i sortowanie dat od najstarszej do najnowszej
    const uniqueDates = Array.from(new Set(
      routes.map(route => normalizeDate(new Date(route.date)).toDateString())
    ));
    const sortedDates = uniqueDates
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => a - b); // Sortowanie rosnąco

    let currentStreakCount = 0;
    let longestStreakCount = 0;
    let previousDate = null;

    // Obliczanie streaków
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
    });

    setCurrentStreak(currentStreakCount);
    setLongestStreak(longestStreakCount);
  };

  const normalizeDate = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', options);
  };
  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };
  
  const handleTransportChange = (selectedMode) => {
    setTransportMode(selectedMode);
  };
  
  
  const totalDistance = userRoutes.reduce((acc, route) => acc + route.distance_km, 0);
  const totalKcal = userRoutes.reduce((acc, route) => acc + route.kcal, 0);
  const totalCO2 = userRoutes.reduce((acc, route) => acc + route.CO2, 0);
  const totalMoney = userRoutes.reduce((acc, route) => acc + route.money, 0);

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 30);
  
  const recentRoutes = userRoutes.filter(route => new Date(route.date) >= threeDaysAgo);
  const recentDistance = recentRoutes.reduce((acc, route) => acc + route.distance_km, 0);
  const recentKcal = recentRoutes.reduce((acc, route) => acc + route.kcal, 0);
  const recentCO2 = recentRoutes.reduce((acc, route) => acc + route.CO2, 0);
  const recentMoney = recentRoutes.reduce((acc, route) => acc + route.money, 0);

  const formattedRecentDistance = recentDistance.toFixed(2);
  const formattedRecentKcal = recentKcal.toFixed(2);
  const formattedRecentCO2 = recentCO2.toFixed(2);
  const formattedRecentMoney = recentMoney.toFixed(2);
  const averageCO2PerKm = 0.12;
  const savedKm = totalCO2 / averageCO2PerKm;
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const sortedUserRoutes = [...userRoutes].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className='container'>
      <Sidebar isOpen={sidebarOpen}user={user}  toggleSidebar={toggleSidebar} userRoutes={userRoutes} />
  <Header 
    user={user} 
    theme={theme} 
    toggleTheme={toggleTheme} 
    toggleSidebar={toggleSidebar} 
  />
      <div className='row'>
      {/* <div className={`activities background ${theme === 'light' ? 'light' : 'dark'}`}>
        <div className='row textAcc'><p className='textStyleActivity'>Your stats</p></div>
        <Distance 
            totalDistance={totalDistance.toFixed(2)}
            totalKcal={totalKcal.toFixed(2)}
            totalCO2={totalCO2.toFixed(2)}
            totalMoney={totalMoney.toFixed(2)}
          />
        
        <RecentDistance 
            recentDistance={formattedRecentDistance} 
            recentKcal={formattedRecentKcal} 
            recentCO2={formattedRecentCO2} 
            recentMoney={formattedRecentMoney}
          />
        </div> */}
        {/* <div className={`activities background ${theme === 'light' ? 'light' : 'dark'}`}>
          <div className='row textAcc'><p className='textStyleActivity'>Your activities</p></div>
          {sortedUserRoutes.map((route, index) => (
            <div key={index} className='activity-card'>
              <p className='activity-date'>{formatDate(route.date)}</p>
              <p><strong>Distance:</strong> {route.distance_km} km</p>
              <p><strong>Kcal burnt:</strong> {route.kcal}</p>
              <p><strong>CO2 saved:</strong> {route.CO2}</p>
              <p><strong>Money saved:</strong> {route.money} PLN</p>
              <p><strong>Activity duration:</strong> {route.duration}</p>
            </div>
          ))}
        </div> */}
        <div className='row'>
        <div className='backgroundInfo'>
            <p className='textStyleActivity'>CO2 Saved</p>
            <Distance 
            totalCO2={totalCO2.toFixed(2)}
          />
          
        </div>
        <div className='background'>
        <p className='Co2Info'>You have saved as much CO₂ as would be produced by driving approximately {savedKm.toFixed(0)} kilometers by car.</p>
          <img src={earthImage} alt='Earth' className='earth-image' />
        </div>
        </div>

        <div className='row'>
        <div className='backgroundInfo'>
            <p className='textStyleActivity'>PLN Saved</p>
            <PLN totalMoney={totalMoney.toFixed(2)}/>
          
        </div>
        <div className='background1'>
        <MonthSelector onMonthChange={handleMonthChange} onTransportChange={handleTransportChange} />
        <Chart month={month} year={year} transportMode={transportMode} userRoutes={userRoutes} />
        </div>
        </div>

        <div className='row'>
        <div className='backgroundInfo'>
          <p className='Co2Info'>Current Streak {currentStreak}</p>
          <p className='Co2Info'>Longest streak {longestStreak}</p>
        </div>
        <div className='background'>
        <p className='Co2Info'>You have saved as much CO₂ as would be produced by driving approximately {savedKm.toFixed(0)} kilometers by car.</p>
          <img src={earthImage} alt='Earth' className='earth-image' />
        </div>
        </div>
        
      </div>
      <Footer/>
    </div>
  );
};

export default UserAcc;
