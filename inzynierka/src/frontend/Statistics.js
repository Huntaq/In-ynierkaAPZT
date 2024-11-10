import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import '../css/stats.css';
import '../css/statistics.css';
import Header from './Components/Header';
import { jwtDecode } from "jwt-decode";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Statistics = () => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const calculateMetrics = (routes) => {
    const now = new Date();
    const startOfWeekDate = startOfWeek(now, { weekStartsOn: 1 });
    const endOfWeekDate = endOfWeek(now, { weekStartsOn: 1 });

    const thisWeekRoutes = routes.filter(route => {
      const routeDate = parseISO(route.date);
      return isWithinInterval(routeDate, { start: startOfWeekDate, end: endOfWeekDate });
    });

    const totalMinutes = thisWeekRoutes.reduce((sum, route) => {
      const [hours, minutes, seconds] = route.duration.split(':').map(Number);
      return sum + (hours * 60) + minutes;
    }, 0);

    const totalCalories = thisWeekRoutes.reduce((sum, route) => sum + route.kcal, 0);
    const totalCO2 = thisWeekRoutes.reduce((sum, route) => sum + route.CO2, 0);
    const totalMoney = thisWeekRoutes.reduce((sum, route) => sum + route.money, 0);

    return {
      totalMinutes,
      totalCalories,
      totalCO2,
      totalMoney
    };
  };

  const calculateFullMetrics = (routes) => {
    const totalMinutes = routes.reduce((sum, route) => {
      const [hours, minutes, seconds] = route.duration.split(':').map(Number);
      return sum + (hours * 60) + minutes;
    }, 0);

    const totalCalories = routes.reduce((sum, route) => sum + route.kcal, 0);
    const totalCO2 = routes.reduce((sum, route) => sum + route.CO2, 0);
    const totalMoney = routes.reduce((sum, route) => sum + route.money, 0);

    return {
      totalMinutes,
      totalCalories,
      totalCO2,
      totalMoney
    };
  };

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

  const findBestRoute = (routes, metric) => {
    return routes.reduce((bestRoute, route) => {
      if (route[metric] > (bestRoute[metric] || 0)) {
        return route;
      }
      return bestRoute;
    }, {});
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
        setError('Token is required');
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

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  const {
    totalMinutes: minutesThisWeek,
    totalCalories: caloriesThisWeek,
    totalCO2: co2ThisWeek,
    totalMoney: moneyThisWeek
  } = calculateMetrics(userRoutes);
  const distanceThisWeek = calculateDistance(userRoutes, 'week');
  const distanceThisMonth = calculateDistance(userRoutes, 'month');
  const distanceThisYear = calculateDistance(userRoutes, 'year');
  const {
    totalMinutes: totalMinutes,
    totalCO2: totalCO2,
  } = calculateFullMetrics(userRoutes);

  const bestRouteCO2 = findBestRoute(userRoutes, 'CO2');
  const bestRouteCalories = findBestRoute(userRoutes, 'kcal');

  return (
    <div className='w-full h-full min-h-screen bg-[#6E9B7B] content-center'>
      <div className='flex w-full max-w-[1440px] min-h-[800px]  h-full justify-self-center gap-[20px] p-[20px]'>
        <div className='w-[20%] max-w-[120px]  rounded-[10px] bg-[#D9EDDF] justify-items-center'>
          <Sidebar />
        </div>
        <div className='scrollbar-hide flex w-[100%] bg-[#D9EDDF] max-h-[760px] rounded-[10px] overflow-y-scroll justify-center'>
          <div className='flex justify-start h-screen min-h-screeen items-center flex-col w-full max-w-[1600px] justify-self-center'>
            <Header user={user} theme={theme} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} />

            <div className='stats-container '>
              <div className='stats-card11 distance-run gradientBasic'>
                <div className='stats-info'>
                  <h3>Distance traveled this week:</h3>
                  <p>{distanceThisWeek} km</p>
                  <div className='popup'>
                    Your weekly distance contributes to a healthier you and a greener planet. Keep moving!
                  </div>
                </div>
              </div>
              <div className='stats-card11 distance-week gradientAlternative'>

                <div className='stats-info'>
                  <h3>Distance traveled this month:</h3>
                  <p>{distanceThisMonth} km</p>
                  <div className='popup'>
                    Your monthly distance is a great way to track long-term progress. Keep up the good work!
                  </div>
                </div>
              </div>
              <div className='stats-card11 distance-month gradientBasic'>
                <div className='stats-info'>
                  <h3>Distance traveled this year:</h3>
                  <p>{distanceThisYear} km</p>
                  <div className='popup'>
                    Your yearly distance shows your commitment to an active lifestyle. Well done!
                  </div>
                </div>
              </div>
              <div className='stats-card11 minutes-week gradientAlternative'>
                <div className='stats-info'>
                  <h3>Minutes of activity this week:</h3>
                  <p>{minutesThisWeek} minutes</p>
                  <div className='popup'>
                    Every minute of activity is a step towards a healthier you and a greener environment.
                  </div>
                </div>
              </div>
              <div className='stats-card11 calories-week gradientBasic'>
                <div className='stats-info'>
                  <h3>Calories burned this week:</h3>
                  <p>{caloriesThisWeek} kcal</p>
                  <div className='popup'>
                    Burning calories means you’re staying active and contributing to a healthier planet. Keep it up!
                  </div>
                </div>
              </div>
              <div className='stats-card11 co2-week gradientAlternative'>
                <div className='stats-info'>
                  <h3>CO2 saved this week:</h3>
                  <p>{co2ThisWeek} kg</p>
                  <div className='popup'>
                    Your CO2 savings help fight climate change. Every bit makes a difference!
                  </div>
                </div>
              </div>
              <div className='stats-card11 money-week gradientBasic'>
                <div className='stats-info'>
                  <h3>Money saved this week:</h3>
                  <p>{moneyThisWeek} PLN</p>
                  <div className='popup'>
                    Saving money while staying active is a win-win. Keep up the great work!
                  </div>
                </div>
              </div>
              <div className='stats-card11 water-saved gradientAlternative'>
                <div className='stats-info'>
                  <h3>Water Saved from Reducing CO2:</h3>
                  <p>{(totalCO2 * 10).toFixed(2)} liters</p>
                  <div className='popup'>
                    By reducing CO2 emissions, you help conserve water. Great job!
                  </div>
                </div>
              </div>
              <div className='stats-card11 trees-planted gradientBasic'>
                <div className='stats-info'>
                  <h3>Equivalent Trees Planted:</h3>
                  <p>{(totalCO2 / 0.05).toFixed(0)} trees</p>
                  <div className='popup'>
                    Your CO2 savings are like planting trees. You’re making a big difference!
                  </div>
                </div>
              </div>
              <div className='stats-card11 energy-saved gradientAlternative'>
                <div className='stats-info'>
                  <h3>Energy Saved by Your Activities:</h3>
                  <p>{(totalMinutes * 0.05).toFixed(2)} kWh</p>
                  <div className='popup'>
                    Your activity saves energy. A more active lifestyle contributes to a sustainable future!
                  </div>
                </div>
              </div>
              <div className='stats-card11 air-quality gradientBasic'>
                <div className='stats-info'>
                  <h3>Air Quality Improved:</h3>
                  <p>{(totalCO2 * 0.8).toFixed(2)} kg</p>
                  <div className='popup'>
                    Every bit of CO2 you save helps improve air quality. Keep up the great work!
                  </div>
                </div>
              </div>
              <div className='stats-card11 distance-medal gradientAlternative'>
                <div className='stats-info'>
                  <h3>Best Route (CO2 saved):</h3>
                  <p>{bestRouteCO2.distance_km} km with {bestRouteCO2.CO2} kg CO2 saved</p>
                  <div className='popup'>
                    This route achieved the highest CO2 savings. Fantastic effort!
                  </div>
                </div>
              </div>
              <div className='stats-card11 distance-year gradientBasic'>
                <div className='stats-info'>
                  <h3>Best Route (Calories burned):</h3>
                  <p>{bestRouteCalories.distance_km} km with {bestRouteCalories.kcal} kcal burned</p>
                  <div className='popup'>

                    This route burned the most calories. Keep up the excellent work!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
