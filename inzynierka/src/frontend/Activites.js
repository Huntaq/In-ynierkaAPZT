import React, { useEffect, useState } from 'react';
import Chart from './Components/Chart';
import MonthSelector from './Components/MonthSelector';
import Sidebar from './Components/Sidebar';
import '../css/stats.css';

const Activities = () => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transportMode, setTransportMode] = useState(1);

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
  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };
  const handleTransportChange = (selectedMode) => {
    setTransportMode(selectedMode);
  };
  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (
    <div className='container'>
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className='row'>
            <button className="button inline margin-left" onClick={toggleSidebar}>☰</button>
        </div>
        <div className='row'>
        <div className='activities backgroundChart'>
            <MonthSelector onMonthChange={handleMonthChange} onTransportChange={handleTransportChange} />
            <Chart month={month} year={year} transportMode={transportMode} userRoutes={userRoutes} />
        </div>
        </div>
    </div>
  );
};

export default Activities;
