import React, { useEffect, useState } from 'react';
import '../css/stats.css';
import Distance from './Components/Distance';
import RecentDistance from './Components/RecentDistance';
import Sidebar from './Components/Sidebar';


const UserAcc = () => {
  const [user, setUser] = useState(null);
  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

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

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', options);
  };
  
  const totalDistance = userRoutes.reduce((acc, route) => acc + route.distance_km, 0);
  const totalKcal = userRoutes.reduce((acc, route) => acc + route.kcal, 0);
  const totalCO2 = userRoutes.reduce((acc, route) => acc + route.CO2, 0);
  const totalMoney = userRoutes.reduce((acc, route) => acc + route.money, 0);
  const formattedDistance = totalDistance.toFixed(2);
  const formattedtotalKcal = totalKcal.toFixed(2);
  const formattedtotalCO2 = totalCO2.toFixed(2);
  const formattedtotalMoney = totalMoney.toFixed(2);

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const sortedUserRoutes = [...userRoutes].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className='container'>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className='row'>
      <button className="button inline margin-left" onClick={toggleSidebar}>☰</button>
        <h1 className='title inline margin-left'>Witaj {user.username}</h1>
        <button className='button inline margin-right' onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      <div className='row'>
      <div className={`activities background ${theme === 'light' ? 'light' : 'dark'}`}>
        <div className='row textAcc'><p className='textStyleActivity'>Your stats</p></div>
        <Distance totalDistance={formattedDistance}
        totalKcal={formattedtotalKcal}
        totalCO2={formattedtotalCO2}
            totalMoney={formattedtotalMoney}
            />
        
        <RecentDistance 
            recentDistance={formattedRecentDistance} 
            recentKcal={formattedRecentKcal} 
            recentCO2={formattedRecentCO2} 
            recentMoney={formattedRecentMoney}
          />
        </div>
        <div className={`activities background ${theme === 'light' ? 'light' : 'dark'}`}>
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
        </div>
      </div>
    </div>
  );
};

export default UserAcc;
