import React, { useEffect, useState } from 'react';
import '../css/trophies.css';
import Sidebar from './Components/Sidebar';
import '../css/stats.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { jwtDecode } from "jwt-decode";
const Trophies = () => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [runningDistance, setRunningDistance] = useState(0);
  const [cyclingDistance, setCyclingDistance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [trophiesCount, setTrophiesCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');

      if (token) {
        try {
          // Dekodowanie tokena
          const decodedToken = jwtDecode(token);
          const id = decodedToken.id;

          // Pobieranie danych użytkownika na podstawie ID
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

              const runningDistance = routesData
                .filter(route => route.transport_mode_id === 1)
                .reduce((acc, route) => acc + route.distance_km, 0);
              const cyclingDistance = routesData
                .filter(route => route.transport_mode_id === 2)
                .reduce((acc, route) => acc + route.distance_km, 0);

              setRunningDistance(runningDistance);
              setCyclingDistance(cyclingDistance);

              // Obliczanie liczby zdobytych pucharków
              const runningTrophy = runningDistance >= 100;
              const cyclingTrophy = cyclingDistance >= 100;
              const totalTrophies = (runningTrophy ? 1 : 0) + (cyclingTrophy ? 1 : 0);
              setTrophiesCount(totalTrophies);
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

  const hasRunningTrophy = runningDistance >= 100;
  const hasCyclingTrophy = cyclingDistance >= 100;

  const runningProgress = !hasRunningTrophy ? (100 - runningDistance).toFixed(2) : 0;
  const cyclingProgress = !hasCyclingTrophy ? (100 - cyclingDistance).toFixed(2) : 0;

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
      <h2>Your Trophies</h2>
      <div className="trophies-container">
        <p className="trophies-count">Total Trophies: {trophiesCount}</p>
        <div className="trophy-list">
          {hasRunningTrophy ? (
            <div className="trophy">
              <h3>🏅 First 100 km Running</h3>
              <p>Congratulations! You've run your first 100 km!</p>
            </div>
          ) : (
            <div className="trophy">
              <h3>🏅 First 100 km Running</h3>
              <p>You are {runningProgress} km away from your first 100 km running trophy.</p>
            </div>
          )}
          {hasCyclingTrophy ? (
            <div className="trophy">
              <h3>🚴‍♂️ First 100 km Cycling</h3>
              <p>Great job! You've cycled your first 100 km!</p>
            </div>
          ) : (
            <div className="trophy">
              <h3>🚴‍♂️ First 100 km Cycling</h3>
              <p>You are {cyclingProgress} km away from your first 100 km cycling trophy.</p>
            </div>
          )}
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  );
};

export default Trophies;
