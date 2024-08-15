import React, { useEffect, useState } from 'react';
import '../css/trophies.css';
import Sidebar from './Components/Sidebar';
import '../css/stats.css';

const Trophies = () => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [runningDistance, setRunningDistance] = useState(0);
  const [cyclingDistance, setCyclingDistance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserRoutes = async () => {
      const token = localStorage.getItem('authToken');
      const id = localStorage.getItem('id');

      if (token && id) {
        try {
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
          } else {
            setError('Błąd podczas pobierania danych tras użytkownika');
          }
        } catch (err) {
          setError('Wystąpił błąd podczas pobierania danych');
        }
      } else {
        setError('Użytkownik nie jest zalogowany');
      }
      setLoading(false);
    };

    fetchUserRoutes();
  }, []);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const hasRunningTrophy = runningDistance >= 100;
  const hasCyclingTrophy = cyclingDistance >= 100;

  const runningProgress = !hasRunningTrophy ? (100 - runningDistance).toFixed(2) : 0;
  const cyclingProgress = !hasCyclingTrophy ? (100 - cyclingDistance).toFixed(2) : 0;

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (
    <div className='container'>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className='row'>
            <button className="button inline margin-left" onClick={toggleSidebar}>☰</button>
        </div>
        <div className='row'>
        
        </div>
        <h2>Your Trophies</h2>
      <div className="trophies-container ">
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
          {!hasRunningTrophy && !hasCyclingTrophy && (
            <p>No trophies yet. Keep going!</p>
            
          )}
        </div>
      </div>
    </div>
  );
};

export default Trophies;
