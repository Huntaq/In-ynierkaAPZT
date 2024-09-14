import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import '../css/stats.css';
import '../css/ranking.css';
import Header from './Components/Header';
import {jwtDecode} from "jwt-decode";
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const Rankings = () => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [rankingType, setRankingType] = useState('total_CO2');
  const [currentUserIndex, setCurrentUserIndex] = useState(-1);
  const navigate = useNavigate();

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
            if (userData[0].is_banned === 1) {
              navigate('/Banned');
            }
          } else {
            localStorage.removeItem('authToken');
            navigate('/');
          }

          const routesResponse = await fetch(`http://localhost:5000/api/users/${userId}/routes_with_usernames`, {
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

          const rankingResponse = await fetch(`http://localhost:5000/api/ranking/ranking`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'sessionKey': sessionKey
            },
          });

          if (rankingResponse.ok) {
            const rankingData = await rankingResponse.json();
            
            const parsedRanking = rankingData.map(entry => ({
              user_id: entry.user_id,
              total_CO2: parseFloat(entry.total_CO2) || 0,
              total_kcal: parseFloat(entry.total_kcal) || 0,
              total_money: parseFloat(entry.total_money) || 0,
            }));
            
            setRanking(parsedRanking);
          } else {
            setError('Błąd podczas pobierania rankingu');
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

  useEffect(() => {
    if (ranking.length > 0 && user) {
      const sortedRanking = [...ranking].sort((a, b) => b[rankingType] - a[rankingType]);
      const index = sortedRanking.findIndex(entry => entry.user_id === user.id);
      setCurrentUserIndex(index);
    }
  }, [ranking, user, rankingType]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    localStorage.setItem('theme', theme);
  };

  const formatValue = (value, type) => {
    const formattedValue = typeof value === 'number' ? value.toFixed(2) : '0.00';
    switch (type) {
      case 'total_CO2':
        return `${formattedValue} KG`;
      case 'total_kcal':
        return `${formattedValue} Kcal`;
      case 'total_money':
        return `${formattedValue} PLN`;
      default:
        return formattedValue;
    }
  };
  

  const handleRankingTypeChange = (event) => {
    setRankingType(`total_${event.target.value}`);
  };

  const getRankingItems = (type) => {
    const sortedRanking = [...ranking].sort((a, b) => b[type] - a[type]);
  
    return sortedRanking.map((entry, index) => (
      entry[type] !== undefined && (
        <li
          key={entry.user_id}
          className={`ranking-item ${entry.user_id === user?.id ? 'highlight' : ''} ${index === 0 ? 'first-place' : ''}`}
          onMouseEnter={index === 0 ? triggerConfetti : undefined} 
        >
          {index === 0 && <span role="img" aria-label="crown" className="crown-icon">👑</span>}
          <span className="ranking-position">{index + 1}. </span>
          <span className="user-info">
            {usernameMap[entry.user_id] || 'Unknown User'} | {formatValue(entry[type], rankingType)}
          </span>
        </li>
      )
    ));
  };
  
  

  const getUserValue = (type) => {
    const userEntry = ranking.find(entry => entry.user_id === user?.id);
    return userEntry ? userEntry[type] : 0;
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffeb3b', '#ff9800', '#f44336'],
    });
  };
  const usernameMap = userRoutes.reduce((map, route) => {
    map[route.user_id] = route.username;
    return map;
  }, {});

  return (
    <div className='container'>
      <Sidebar isOpen={sidebarOpen} user={user} toggleSidebar={toggleSidebar} userRoutes={userRoutes} />
      <Header 
        user={user} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        toggleSidebar={toggleSidebar} 
      />
      <div className="ranking">
        <div className='row'>
        <p>Ranking</p>
        <select value={rankingType.replace('total_', '')} onChange={handleRankingTypeChange} className="ranking-dropdown">
          <option value="CO2">CO2 Saved</option>
          <option value="kcal">Calories Burned</option>
          <option value="money">Money Saved</option>
        </select>
        </div>
        <div className="ranking-section">
          <ul>
            {getRankingItems(rankingType)}
          </ul>
        </div>
        {user && (
          <div className="current-user">
            <p>You</p>
            <li
              key={user.id}
              className="ranking-item highlight"
            >
              <span className="ranking-position">{currentUserIndex !== -1 ? currentUserIndex + 1 : 'N/A'}. </span>
              <span className="user-info">
                {user.username} |  {formatValue(getUserValue(rankingType))}
              </span>
            </li>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rankings;
