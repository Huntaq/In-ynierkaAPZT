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
  const [preview, setPreview] = useState(null); // Stan do przechowywania URL podglądu

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
    localStorage.setItem('theme', theme);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file));
    } else {
      alert("Choose a proper jpg/png file.");
    }
  };

  const handleProfilePictureUpload = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('file', profilePicture);
    formData.append('userId', user.id);

    const response = await fetch('http://localhost:5000/api/profilePicture', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setUser(prevUser => ({ ...prevUser, profilePicture: data.url }));
    setPreview(null);
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
          <div className='row'>
          <div className='inline'>
        <a href="/Profile" className='user-info inline' style={{ textDecoration: 'none' }}>
          {user && user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt="Profile" 
              className='user-icon' 
              style={{ borderRadius: '50%', width: '60px', height: '60px' }} 
            />
          ) : (
            <div className='user-icon'>{user && user.username ? user.username[0] : 'U'}</div>
          )}
        </a>
        </div>
        <div className='inline'>
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
          <button
            className=' displayProfile button inline'
            type="button"
            onClick={() => document.getElementById('fileInput').click()}
          >
            Choose
          </button>
          <button
            className=' displayProfile button inline'
            type="submit"
            disabled={!profilePicture}
          >
            Upload
          </button>
          {preview && (
            <div className="previewContainer">
              <img src={preview} alt="Podgląd zdjęcia" className="profilePreview" />
            </div>
          )}
          
        </form>
        </div>
        </div>
        </div>
        <div>
          <div className='backgroundInfoProfile margintest'>
            sda
          </div>
          <div className='backgroundInfoProfile '>
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
