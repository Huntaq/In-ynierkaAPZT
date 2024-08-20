import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import '../css/stats.css';
import '../css/profile.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [emailNotification, setEmailNotification] = useState('yes');
  const [pushNotification, setPushNotification] = useState('yes');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const id = decodedToken.id;
          const userResponse = await fetch(`http://localhost:5000/api/users/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData[0]);
            setProfilePicture(userData[0].profilePicture);

            setEmailNotification(userData[0].email_notifications === 1 ? 'yes' : 'no');
            setPushNotification(userData[0].push_notifications === 1 ? 'yes' : 'no');

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
  };

  const MAX_FILE_SIZE_MB = 1.7; 
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; 

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`Plik jest za duży. Maksymalny rozmiar pliku to ${MAX_FILE_SIZE_MB} MB.`);
        return;
      }
      
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
      } else {
        alert("Wybierz poprawny plik jpg/png.");
      }
    }
  };

  const handleProfilePictureUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Proszę wybrać plik przed przesłaniem.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', user.id);

    const response = await fetch('http://localhost:5000/api/profilePicture', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setUser(prevUser => ({ ...prevUser, profilePicture: data.url }));
    setProfilePicture(data.url);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleProfilePictureDelete = async () => {
    const response = await fetch('http://localhost:5000/api/profilePicture', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: user.id }),
    });

    if (response.ok) {
      setUser(prevUser => ({ ...prevUser, profilePicture: null }));
      setProfilePicture(null);
      setPreviewUrl(null);
    } else {
      alert('Błąd podczas usuwania zdjęcia profilowego.');
    }
  };

  const handleEmailNotificationChange = (value) => {
    setEmailNotification(value);
  };

  const handlePushNotificationChange = (value) => {
    setPushNotification(value);
  };
  const handleUpdateClick = async () => {
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      alert('Brak tokena autoryzacyjnego. Proszę zalogować się ponownie.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/users/${user.id}/notifications`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email_notifications: emailNotification === 'yes' ? 1 : 0,
          push_notifications: pushNotification === 'yes' ? 1 : 0,
        }),
      });
  
      if (response.ok) {
        alert('Ustawienia zostały zaktualizowane.');
      } else {
        const errorData = await response.json();
        alert(`Błąd: ${errorData.message || 'Nie udało się zaktualizować ustawień.'}`);
      }
    } catch (error) {
      alert('Wystąpił błąd podczas aktualizacji ustawień.');
    }
  };
  

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
      <div>
        <div className='row'>
          <div className='backgroundProfileInfo inline'>
            <div className='rowProfile profile-container11'>
              <div className='inline'>
                <div className='profile-picture-wrapper'>
                  <a href="/Profile" className='inline profilePlacement' style={{ textDecoration: 'none' }}>
                    {user && (previewUrl || user.profilePicture) ? (
                      <img
                        src={previewUrl || user.profilePicture}
                        alt="Profile"
                        className='profilePlacement'
                        style={{ borderRadius: '50%' }}
                      />
                    ) : (
                      <div className='profilePlacement'>
                        {user && user.username ? user.username[0] : 'U'}
                      </div>
                    )}
                  </a>
                  <div className='status-indicator'><svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                    <path d="M6.04167 5.4375C5.88144 5.43752 5.72777 5.50117 5.61447 5.61447C5.50117 5.72777 5.43752 5.88144 5.4375 6.04167V20.5417C5.4375 20.7019 5.50115 20.8556 5.61446 20.9689C5.72776 21.0822 5.88143 21.1458 6.04167 21.1458C6.2019 21.1458 6.35557 21.0822 6.46888 20.9689C6.58218 20.8556 6.64583 20.7019 6.64583 20.5417V19.6755L12.7713 15.9998L18.0318 12.8444L22.3542 17.1668V22.3542H6.04167C5.88143 22.3542 5.72776 22.4178 5.61446 22.5311C5.50115 22.6444 5.4375 22.7981 5.4375 22.9583C5.4375 23.1186 5.50115 23.2722 5.61446 23.3855C5.72776 23.4988 5.88143 23.5625 6.04167 23.5625H22.9583C23.1186 23.5625 23.2722 23.4988 23.3855 23.3855C23.4988 23.2722 23.5625 23.1186 23.5625 22.9583V6.04167C23.5625 5.88144 23.4988 5.72777 23.3855 5.61447C23.2722 5.50117 23.1186 5.43752 22.9583 5.4375H6.04167ZM6.64583 6.64583H22.3542V15.4582L18.5522 11.6562C18.4432 11.5471 18.2968 11.4838 18.1427 11.4792C18.0274 11.476 17.9135 11.5059 17.8147 11.5653L12.5553 14.7218L10.0938 12.2603C9.99507 12.1616 9.86516 12.1001 9.72618 12.0863C9.58721 12.0726 9.44776 12.1074 9.33154 12.1848L6.64583 13.9749V6.64583ZM13.2917 7.25C11.9641 7.25 10.875 8.33913 10.875 9.66667C10.875 10.9942 11.9641 12.0833 13.2917 12.0833C14.6192 12.0833 15.7083 10.9942 15.7083 9.66667C15.7083 8.33913 14.6192 7.25 13.2917 7.25ZM13.2917 8.45833C13.9662 8.45833 14.5 8.99217 14.5 9.66667C14.5 10.3412 13.9662 10.875 13.2917 10.875C12.6172 10.875 12.0833 10.3412 12.0833 9.66667C12.0833 8.99217 12.6172 8.45833 13.2917 8.45833ZM9.58997 13.4651L11.4862 15.3614L6.64583 18.2666V15.4275L9.58997 13.4651Z" fill="black"/>
                  </svg></div>
                </div>
              </div>
              <div className='inline margin-left-button'>
                <form onSubmit={handleProfilePictureUpload}>
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileChange}
                    style={{
                      opacity: 0,
                      position: 'absolute',
                      zIndex: -1,
                    }}
                  />
                  {!selectedFile ? (
                    <button
                      className='displayProfile buttonAvatar inline'
                      type="button"
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      Choose
                    </button>
                  ) : (
                    <button
                      className='displayProfile buttonAvatar inline'
                      type="submit"
                    >
                      Upload
                    </button>
                  )}
                  {user && (
                    <button
                      className='displayProfile buttonAvatarDelete inline'
                      type="button"
                      onClick={handleProfilePictureDelete}
                    >
                      Delete
                    </button>
                  )}
                </form>
              </div>
            </div>
            {user && (
              <div className='ProfileDiv'>
                <div className='rowInfo'>
                  <p className='HeaderProfile'>Username:</p>
                  <p className='HeaderProfile'>Email:</p>
                </div>
                <div className='rowInfo'>
                  <p className='HeaderProfileName'>{user.username}</p>
                  <p className='HeaderProfileName'>{user.email}</p>
                </div>
                <p className='HeaderProfile'>Age:</p>
                <p className='HeaderProfileName'>{user.age}</p>
                <p className='HeaderProfile'>ID:</p>
                <p className='HeaderProfileName'>{user.id}</p>
                <p className='HeaderProfile'>Gender:</p>
                <p className='HeaderProfileName'>{user.gender}</p>
              </div>
            )}
          </div>

          <div>
            <div className='backgroundInfoProfile margintest checkboxStyle'>
              <p className='CBS'>Notifications by email</p>
              <div style={{ display: 'flex', gap: '80px' }}>
                <label className='checkbox'>
                  <input
                    type="checkbox"
                    checked={emailNotification === 'yes'}
                    onChange={() => handleEmailNotificationChange('yes')}
                  /> Yes
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={emailNotification === 'no'}
                    onChange={() => handleEmailNotificationChange('no')}
                  /> No
                </label>
              </div>

              <p className='CBS'>Push notifications</p>
              <div style={{ display: 'flex', gap: '80px' }}>
                <label className='checkbox'>
                  <input
                    type="checkbox"
                    checked={pushNotification === 'yes'}
                    onChange={() => handlePushNotificationChange('yes')}
                  /> Yes
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={pushNotification === 'no'}
                    onChange={() => handlePushNotificationChange('no')}
                  /> No
                </label>
              </div>
              <button className='button' onClick={handleUpdateClick}>
  Update
</button>
            </div>
            <div className='backgroundInfoProfile fitFact '>
              <div className='rowWidthFact'>
                Did you know that regular exercise can boost your brainpower? Physical activity increases the production of proteins that improve brain function, memory, and learning capabilities. Just 30 minutes of exercise a few times a week can make a significant difference!
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  );
};

export default Profile;
