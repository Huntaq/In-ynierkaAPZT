import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/adminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchId, setSearchId] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [notificationContent, setNotificationContent] = useState('');
  const [notificationHeader, setNotificationHeader] = useState('');
  const [notifications_popup, setNotifications_popup] = useState([]);


  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          const sessionKey = decodedToken.sessionKey;

          if (userId !== 48) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('cooldownTimestamp');
            navigate('/');
            return;
          }

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

            const allUsersResponse = await fetch(`http://localhost:5000/api/users/${userId}/admin`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'sessionKey': sessionKey
              },
            });

            if (allUsersResponse.ok) {
              const usersData = await allUsersResponse.json();
              setUsers(usersData);
              setFilteredUsers(usersData);
            } else {
              setError('Błąd podczas pobierania listy użytkowników1');
            }
            const notificationsResponse = await fetch('http://localhost:5000/api/notifications/popup', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'sessionKey': sessionKey
              },
            });

            if (notificationsResponse.ok) {
              const notificationsData = await notificationsResponse.json();
              setNotifications_popup(notificationsData);
            } else {
              setError('Błąd podczas pobierania powiadomień');
            }
          } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('cooldownTimestamp');
            navigate('/');
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
  }, [navigate]);
  useEffect(() => {
    const filtered = users.filter(user =>
      (searchUsername ? user.username.toLowerCase().includes(searchUsername.toLowerCase()) : true) &&
      (searchId ? user.id.toString().includes(searchId) : true)
    );
    setFilteredUsers(filtered);
  }, [searchUsername, searchId, users]);
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('cooldownTimestamp');
    navigate('/');
  };
  const handleNotificationSubmit = async () => {
    const token = localStorage.getItem('authToken');

    if (!notificationHeader.trim() || !notificationContent.trim()) {
      alert('Both header and content are required.');
      return;
    }

    if (token) {
      try {

        const response = await fetch('http://localhost:5000/api/notifications', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: notificationContent, header: notificationHeader })
        });

        console.log('Notification Response Status:', response.status);

        if (response.ok) {
          setNotificationContent('');
          setNotificationHeader('');
        } else {
          alert('Error sending notification');
        }
      } catch (error) {
        console.error('Error sending notification:', error);
        alert('Error sending notification');
      }
    }
  };
  const handleDeleteNotification = async (id) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch(`http://localhost:5000/api/notifications/popup/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          setNotifications_popup(notifications_popup.filter(notification => notification.id !== id));
        } else {
          alert('Error deleting notification');
        }
      } catch (error) {
        console.error('Error deleting notification:', error);
        alert('Error deleting notification');
      }
    }
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='container'>
      <div className='row'>
      <p>Admin Panel</p>
        <button onClick={() => navigate('/UserAcc')} className="button">Admin</button>
        <button className="button a" onClick={handleLogout}>Logout</button>
      </div>
      <div className='row'>
        <div className="search-container">
          <input
            type="text"
            placeholder="Username"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="search-input"
          />
        </div>

      </div>
      <div className='row'>
        <div className="admin-table-container inline">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Banned</th>
                <th>Email Notifications</th>
                <th>Push Notifications</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.age}</td>
                  <td className={`gender-cell ${user.gender === 'M' ? 'male' : 'female'}`}>{user.gender}</td>
                  <td>{user.is_banned ? 'Yes' : 'No'}</td>
                  <td>{user.email_notifications ? 'Enabled' : 'Disabled'}</td>
                  <td>{user.push_notifications ? 'Enabled' : 'Disabled'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-table-container inline">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Header</th>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications_popup.map(notification => (
                <tr key={notification.id}>
                  <td>{notification.id}</td>
                  <td>{notification.header}</td>
                  <td>
                    {notification.content.length > 50
                      ? `${notification.content.slice(0, 150)}...`
                      : notification.content}
                  </td>
                  <td>
                    <button onClick={() => handleDeleteNotification(notification.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
      <div className='row'>
        <div className="notification-form">
          <input
            type="text"
            value={notificationHeader}
            onChange={(e) => setNotificationHeader(e.target.value)}
            placeholder="Enter notification header"
          />
          <textarea
            value={notificationContent}
            onChange={(e) => setNotificationContent(e.target.value)}
            placeholder="Enter notification content"
          />
          <button onClick={handleNotificationSubmit} className='button'>Send</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
