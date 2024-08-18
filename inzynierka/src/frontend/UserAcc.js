import React, { useEffect, useState } from 'react';
import '../css/stats.css';
import Distance from './Components/Distance';
import RecentDistance from './Components/RecentDistance';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import Footer from './Components/Footer';
import earthImage from './Components/earth.png';
import meter from './Components/meter.png';
import PLN from './Components/PLN';
import Chart from './Components/Chart';
import MonthSelector from './Components/MonthSelector';
import Trophy from './Components/Trophy';
import { jwtDecode } from "jwt-decode";

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
  
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
    
          const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
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
    });

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
          <p className='textStyleActivity'>Current Streak</p>
          
          <div className='row'>
            <p className='StreakInfo'>{currentStreak} </p>
            <img src={meter} alt='Earth' className='meterimage inline' />
          </div>
          <p className='textStyleActivity'>Longest Streak 🔥: {longestStreak}</p>
        </div>
        {/* {currentStreak} {longestStreak}*/}
        <div className='background2'>
            {trophies.length > 0 ? (
              trophies.map((trophy, index) => (
                <Trophy key={index} type={trophy.type} isEarned={trophy.isEarned} />
              ))
            ) : (
              <p>No trophies earned yet</p>
            )}
        </div>
        </div>
        
      </div>
      <Footer/>
    </div>
  );
};

export default UserAcc;
