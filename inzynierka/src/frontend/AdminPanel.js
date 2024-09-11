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
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('bike');
  const [eventDistance, setEventDistance] = useState('');
  const [events, setEvents] = useState([]);
  const [eventsError, setEventsError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [eventImage, setEventImage] = useState(null);
  const [showEvent, setShowEvent] = useState(false);



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
            const eventsResponse = await fetch('http://localhost:5000/api/event', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'sessionKey': sessionKey
              },
            });

            if (eventsResponse.ok) {
              const eventsData = await eventsResponse.json();
              setEvents(eventsData);
            } else {
              setEventsError('Błąd podczas pobierania wydarzeń');
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
  const toggleEvent = () => {
    setShowEvent(prev => !prev);
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

  const handleEventSubmit = async () => {
    const token = localStorage.getItem('authToken');

    if (!eventTitle.trim() || !eventDescription.trim() || !startDate || !endDate || !eventDistance || !eventImage) {
      alert('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', eventTitle);
    formData.append('description', eventDescription);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('type', eventType);
    formData.append('distance', eventDistance);
    formData.append('image', eventImage);

    if (token) {
      try {
        const response = await fetch('http://localhost:5000/api/event', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });


        if (response.ok) {
          alert('Event created successfully');
          setEventTitle('');
          setEventDescription('');
          setStartDate('');
          setEndDate('');
          setEventDistance('');
          setEventImage(null);
        } else {
          console.error('Failed to create event');
          alert('Failed to create event');
        }
      } catch (error) {
        console.error('Error creating event:', error);
        alert('Error creating event');
      }
    }
  };
  const handleToggleEventStatus = async (eventId, currentStatus) => {
    const token = localStorage.getItem('authToken');
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

    if (token) {
      try {
        const response = await fetch(`http://localhost:5000/api/event/${eventId}/status`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: newStatus })
        });

        if (response.ok) {
          setEvents(events.map(event =>
            event.id === eventId ? { ...event, status: newStatus } : event
          ));
        } else {
          alert('Error updating event status');
        }
      } catch (error) {
        console.error('Error updating event status:', error);
        alert('Error updating event status');
      }
    }
  };
  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch(`http://localhost:5000/api/event/${eventId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          setEvents(events.filter(event => event.id !== eventId));
        } else {
          alert('Error deleting event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event');
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
      <button onClick={toggleEvent} className="button">
        {showEvent ? "Hide" : "Show"}
      </button>
      </div>
      {showEvent && (
        <>
      <div className='row'><h3>Create Event</h3></div>
      <div className='row'>
        <div className="event-form">
          <input type="text" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Enter event title" className="input" />
          <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="Enter event description" className="textarea" />
          <div className='row'><p>Start Date</p></div>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" />
          <div className='row'><p>End Date</p></div>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input"
          />
          <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="input">
            <option value="bike">Bike</option>
            <option value="run">Running</option>
          </select>
          <input type="number" value={eventDistance} onChange={(e) => setEventDistance(e.target.value)} placeholder="Enter distance in km" className="input" />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setEventImage(e.target.files[0])}
            className="input"
          />
          <button onClick={handleEventSubmit} className="button">Create</button>
        </div>
        <div className='row'>Event Preview</div>
        <div className="event-preview unique-event-item">
          <div
            className="unique-event-background"
            style={eventImage ? { backgroundImage: `url(${URL.createObjectURL(eventImage)})` } : {}}
          />
          <div className="unique-event-header">
            <h3 className="unique-event-title">{eventTitle || "Event Title"}</h3>
            <div className="progress-bar-container-wrapper">
              <p className="progress-label">Preview Progress</p>
              <div className="progress-bar-container">
                <div className="progress-bar1" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
          <div className="unique-event-content">
            <p className="unique-event-description">{eventDescription || "Event description goes here."}</p>
          </div>
          <div className="unique-event-footer">
            <p className="unique-event-date">
              <strong>Start Date:</strong> {startDate || "Not set"}
            </p>
            <p className="unique-event-date">
              <strong>End Date:</strong> {endDate || "Not set"}
            </p>
          </div>
        </div>
      </div>
      </>
)}

      <div className='row EventsTable'>
      <div className='row'><h3>Events</h3></div>
        <div className="admin-table-container inline adminEvent">

          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Type</th>
                <th>Distance (km)</th>
                <th>Image</th>
                <th>Status</th>
                <th>User IDs</th>
                <th>Change Status</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.title}</td>
                  <td>{event.description}</td>
                  <td>{new Date(event.startDate).toLocaleDateString()}</td>
                  <td>{new Date(event.endDate).toLocaleDateString()}</td>
                  <td>{event.type}</td>
                  <td>{event.distance}</td>
                  <td>
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="event-image"
                      />
                    )}
                  </td>
                  <td>{event.status}</td>
                  <td>{event.user_ids.join(', ')}</td>
                  <td>
                    <button onClick={() => handleToggleEventStatus(event.id, event.status)}>
                      {event.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {eventsError && <p>{eventsError}</p>}
        </div>
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
