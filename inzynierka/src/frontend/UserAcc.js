import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/stats.css';

const UserAcc = () => {
  const [user, setUser] = useState(null);
  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      const id = localStorage.getItem('id');

      if (token && id) {
        try {
          // Pobierz dane użytkownika
          const userResponse = await fetch(`http://localhost:5000/api/users/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData[0]);

            // Pobierz dane tras użytkownika
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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('id');
    navigate('/');
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', options);
  };

  return (
    <div className='container'>
      <div className='row'>
        <h1 className='title inline'>Witaj {user.username}</h1>
        <button className='button inline' onClick={handleLogout}>Wyloguj</button>
      </div>
      <div>
        <p className='Header'>Your routes</p>
      </div>
      <div className='activities'>
        {userRoutes.map((route, index) => (
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
  );
};

export default UserAcc;
