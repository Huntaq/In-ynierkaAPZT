import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';

const UserAcc = () => {
  const [user, setUser] = useState(null); // Używamy pojedynczego obiektu, a nie tablicy
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      const id = localStorage.getItem('id');

      if (token && id) {
        try {
          const response = await fetch(`http://localhost:5000/api/users/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Assuming `data` is an array with a single user object
            setUser(data[0]);
          } else {
            setError('Failed to fetch user data');
          }
        } catch (err) {
          setError('An error occurred while fetching user data');
        }
        setLoading(false);
      } else {
        setError('User is not authenticated');
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {user ? (
        <>
          <h1>Hello {user.username}</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <p>No user data available</p>
      )}
      <button className='button' onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default UserAcc;
