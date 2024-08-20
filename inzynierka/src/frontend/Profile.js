import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import '../css/stats.css';
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    } else {
      alert("Wybierz poprawny plik jpg/png.");
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
      <div>
        <p>Email: {user.email}</p>
        <p>Wiek: {user.age}</p>
        <p>ID: {user.id}</p>
        <p>Gender: {user.gender}</p>
      </div>
    )}
          </div>
          
          <div>
            <div className='backgroundInfoProfile margintest'>
              sda
            </div>
            <div className='backgroundInfoProfile'>
              sda
            </div>
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </div>
  );
};

export default Profile;
