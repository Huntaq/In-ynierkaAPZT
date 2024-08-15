import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);

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

            // Obliczanie całkowitego dystansu
            const distance = routesData.reduce((acc, route) => acc + route.distance_km, 0);
            setTotalDistance(distance);
          } else {
            console.error('Błąd podczas pobierania danych tras użytkownika');
          }
        } catch (err) {
          console.error('Wystąpił błąd podczas pobierania danych', err);
        }
      }
    };

    fetchUserRoutes();
  }, []);

  return (
    <UserContext.Provider value={{ userRoutes, totalDistance }}>
      {children}
    </UserContext.Provider>
  );
};
