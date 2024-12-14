import React, { useEffect, useState } from 'react';
import '../css/stats.css';
import Header from './Components/Header';
import { jwtDecode } from "jwt-decode";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Chart from './Components/Chart';
import BackGround from './Components/BackGround';

const Statistics = (
  month,
  year,
  transportMode
) => {

  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const calculateDistance = (routes, timeRange) => {
    const now = new Date();
    let startDate, endDate;

    if (timeRange === 'week') {
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      endDate = endOfWeek(now, { weekStartsOn: 1 });
    } else if (timeRange === 'month') {
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    } else if (timeRange === 'year') {
      startDate = startOfYear(now);
      endDate = endOfYear(now);
    }
    return routes.reduce((sum, route) => {
      const routeDate = parseISO(route.date);
      if (isWithinInterval(routeDate, { start: startDate, end: endDate })) {
        return sum + route.distance_km;
      }
      return sum;
    }, 0);
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
            if (userData[0].is_banned === 1) {
              navigate('/Banned');
            }
          } else {
            localStorage.removeItem('authToken');
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
          } else {
            setError('user_routes query/server error');
          }
        } catch (err) {
          setError('query/server error');
        }
      } else {
        navigate('/');
        setError('Token is required');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

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

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;


  const distanceThisWeek = calculateDistance(userRoutes, 'week');
  const distanceThisMonth = calculateDistance(userRoutes, 'month');
  const distanceThisYear = calculateDistance(userRoutes, 'year');

  return (

    <BackGround>
      <div className='scrollbar-hide flex w-[100%] bg-[#D9EDDF] max-h-[760px] rounded-[10px] overflow-y-scroll justify-center'>
        <div className='flex justify-start min-h-screeen items-center flex-col w-full max-w-[1600px] justify-self-center'>
          <Header user={user} theme={theme} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />
          <div className='max-w-[95%] mt-[5px] w-[1000px] min-h-[400px]  h-auto max-h-[400px] bg-[#F1FCF3] rounded-[10px] shadow-[5px_5px_10px_rgba(0,0,0,0.1]'>
            <Chart month={month} year={year} transportMode={transportMode} userRoutes={userRoutes} />
          </div>
          <div className='flex flex-wrap w-full mt-[20px] gap-[10px] justify-center text-center max-w-[95%]'>
            <div className='w-full h-[100px] max-w-[300px] bg-[#F1FCF3] p-[10px] rounded-[7px] content-center text-[#3B4A3F]'>
              <div>
                <h3>Total distance traveled this week:</h3>
                <p className='font-bold text-[#3B4A3F]'>{distanceThisWeek.toFixed(2)} km</p>
              </div>
            </div>
            <div className='w-full h-[100px] max-w-[300px] bg-[#F1FCF3] p-[10px] rounded-[7px] content-center'>
              <div>
                <h3>Total distance traveled this month:</h3>
                <p className='font-bold text-[#3B4A3F]'>{distanceThisMonth.toFixed(2)} km</p>
              </div>
            </div>
            <div className='w-full h-[100px] max-w-[300px] bg-[#F1FCF3] p-[10px] rounded-[7px] content-center'>
              <div>
                <h3>Total distance traveled this year:</h3>
                <p className='font-bold text-[#3B4A3F]'>{distanceThisYear.toFixed(2)} km</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackGround>


  );
};

export default Statistics;
