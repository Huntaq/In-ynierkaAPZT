import React, { useEffect, useState } from 'react';
import '../css/stats.css';
import Header from './Components/Header';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import Logo from './Components/img/earthLogo.png';
import BackGround from './Components/BackGround';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isCooldown, setIsCooldown] = useState(false);
  const [emailNotification, setEmailNotification] = useState('yes');
  const [pushNotification, setPushNotification] = useState('yes');
  const navigate = useNavigate();
  
  const fetchUserData = async () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const id = decodedToken.id;
        const sessionKey = decodedToken.sessionKey;

        const userResponse = await fetch(`http://localhost:5000/api/users/${id}/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'sessionKey': sessionKey
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData[0]);
          if (userData[0].is_banned === 1) {
            navigate('/Banned');
          }

          setEmailNotification(userData[0].email_notifications === 1 ? 'yes' : 'no');
          setPushNotification(userData[0].push_notifications === 1 ? 'yes' : 'no');

        } else {
          localStorage.removeItem('authToken');
          navigate('/');
        }
      } catch (err) {
        setError('query/server error');
      }
    } else {
      navigate('/');
      setError('Token is required');
    }
    setLoading(false);
  };
  useEffect(() => {

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

  const MAX_FILE_SIZE_MB = 1;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`img size too big. bax size is: ${MAX_FILE_SIZE_MB} MB.`);
        return;
      }

      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
      } else {
        alert("Choose jpg/png file.");
      }
    }
  };

  const handleProfilePictureUpload = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Choose a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', user.id);
    const token = localStorage.getItem('authToken');
    const decodedToken = jwtDecode(token);
    const sessionKey = decodedToken.sessionKey;

    const response = await fetch('http://localhost:5000/api/profilePicture', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`,
        'sessionKey': sessionKey
      },
    });

    const data = await response.json();
    setUser(prevUser => ({ ...prevUser, profilePicture: data.url }));
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleProfilePictureDelete = async () => {
    const token = localStorage.getItem('authToken');
    const decodedToken = jwtDecode(token);
    const sessionKey = decodedToken.sessionKey;

    const response = await fetch('http://localhost:5000/api/profilePicture', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'sessionKey': sessionKey
      },
      body: JSON.stringify({ userId: user.id }),
    });

    if (response.ok) {
      setUser(prevUser => ({ ...prevUser, profilePicture: null }));
      setPreviewUrl(null);
      fetchUserData();
    } else {
      alert('error deleting profile pucture');
    }
  };

  const handleEmailNotificationChange = (value) => {
    setEmailNotification(value);
  };

  const handlePushNotificationChange = (value) => {
    setPushNotification(value);
  };

  const handleUpdateClick = async () => {
    
    setIsCooldown(true);
    setTimeout(()=>
      setIsCooldown(false),
      2000);
    const token = localStorage.getItem('authToken');


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
      } 
    } catch (error) {
    }
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;
  return (
    <BackGround>
      <div className='scrollbar-hide flex w-[100%] bg-[#D9EDDF]  rounded-[10px] overflow-y-scroll justify-center'>

        <div className='flex justify-start items-center flex-col w-full max-w-[1600px] justify-self-center max-h-[760px]'>
          <Header user={user} theme={theme} toggleTheme={toggleTheme} toggleSidebar={toggleSidebar} currentPage="Profile" />
          <div className='w-full justify-center '>
            <div className='flex justify-center'>
              <p className='w-[50%] text-center CustomSM:hidden'>Your profile</p>
              <p className='w-[50%] text-center CustomSM:hidden'>Notification settings</p>
            </div>
            <div className='flex justify-center gap-[10px] max-w-[98%] place-self-center CustomSM:block'>
              <div className='w-full max-w-[550px] h-[550px] p-[10px] items-center bg-[#F1FCF3] rounded-[5px] shadow-[2px_2px_15px_rgba(88,88,88,0.2)] CustomSM:mb-[10px]'>
                <div className='flex flex-col items-center CustomXXSM:block'>
                  <div className='w-full max-w-[100px] mt-[16px] justify-self-center'>
                    <div className='relative'>
                      <a href="/Profile" className='' style={{ textDecoration: 'none' }}>
                        {user && (previewUrl || user.profilePicture) ? (
                          <img
                            src={previewUrl || `http://localhost:3000/uploads/${user.profilePicture.split('/').pop()}`}
                            alt="Profile"
                            className='w-[100px] h-[100px] rounded-[50%]'
                          />
                        ) : (
                          <div className='w-[100px] h-[100px] rounded-[50%] text-center justify-self-center content-center'>
                            {user && user.username ? <img className='w-[100px] h-[100px] rounded-[50%]' src='./empty-avatar.jpg'/>: 'U'}
                          </div>
                        )}
                      </a>
                      <div className='flex absolute bottom-[-10px] right-[-5px] bg-[#84D49D] rounded-[50%] w-[40px] h-[40px] items-center justify-center'><svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                        <path d="M6.04167 5.4375C5.88144 5.43752 5.72777 5.50117 5.61447 5.61447C5.50117 5.72777 5.43752 5.88144 5.4375 6.04167V20.5417C5.4375 20.7019 5.50115 20.8556 5.61446 20.9689C5.72776 21.0822 5.88143 21.1458 6.04167 21.1458C6.2019 21.1458 6.35557 21.0822 6.46888 20.9689C6.58218 20.8556 6.64583 20.7019 6.64583 20.5417V19.6755L12.7713 15.9998L18.0318 12.8444L22.3542 17.1668V22.3542H6.04167C5.88143 22.3542 5.72776 22.4178 5.61446 22.5311C5.50115 22.6444 5.4375 22.7981 5.4375 22.9583C5.4375 23.1186 5.50115 23.2722 5.61446 23.3855C5.72776 23.4988 5.88143 23.5625 6.04167 23.5625H22.9583C23.1186 23.5625 23.2722 23.4988 23.3855 23.3855C23.4988 23.2722 23.5625 23.1186 23.5625 22.9583V6.04167C23.5625 5.88144 23.4988 5.72777 23.3855 5.61447C23.2722 5.50117 23.1186 5.43752 22.9583 5.4375H6.04167ZM6.64583 6.64583H22.3542V15.4582L18.5522 11.6562C18.4432 11.5471 18.2968 11.4838 18.1427 11.4792C18.0274 11.476 17.9135 11.5059 17.8147 11.5653L12.5553 14.7218L10.0938 12.2603C9.99507 12.1616 9.86516 12.1001 9.72618 12.0863C9.58721 12.0726 9.44776 12.1074 9.33154 12.1848L6.64583 13.9749V6.64583ZM13.2917 7.25C11.9641 7.25 10.875 8.33913 10.875 9.66667C10.875 10.9942 11.9641 12.0833 13.2917 12.0833C14.6192 12.0833 15.7083 10.9942 15.7083 9.66667C15.7083 8.33913 14.6192 7.25 13.2917 7.25ZM13.2917 8.45833C13.9662 8.45833 14.5 8.99217 14.5 9.66667C14.5 10.3412 13.9662 10.875 13.2917 10.875C12.6172 10.875 12.0833 10.3412 12.0833 9.66667C12.0833 8.99217 12.6172 8.45833 13.2917 8.45833ZM9.58997 13.4651L11.4862 15.3614L6.64583 18.2666V15.4275L9.58997 13.4651Z" fill="black" />
                      </svg></div>
                    </div>
                  </div>
                  <div className='w-full mt-[40px] max-w-[400px] items-center'>
                    <form className='justify-self-center text-center CustomXXSM:mt-[20px]' onSubmit={handleProfilePictureUpload}>
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
                          className='w-[120px] h-[40px] bg-[#84D49D] text-white rounded-[20px] m-[5px] hover:scale-105'
                          type="button"
                          onClick={() => document.getElementById('fileInput').click()}
                        >
                          Change avatar
                        </button>
                      ) : (
                        <button
                          className='w-[120px] h-[40px] bg-[#84D49D] text-white rounded-[20px] m-[5px] hover:scale-105'
                          type="submit"
                        >
                          Upload
                        </button>
                      )}
                      {user && (
                        <button
                          className='w-[120px] h-[40px] border-[2px] border-[#84D49D] text-[#84D49D] rounded-[20px] m-[5px] hover:scale-105'
                          type="button"
                          onClick={handleProfilePictureDelete}
                        >
                          Delete avatar
                        </button>
                      )}
                    </form>
                  </div>
                </div>
                {user && (
                  <div className='w-full max-w-[600px] text-center h-[480px] mt-[40px] CustomXXSM:h-[350px]'>
                    <div className='flex w-full'>
                      <p className='w-[50%] text-center'>Username:</p>
                      <p className='w-[50%] text-center'>Email:</p>
                    </div>
                    <div className='flex w-full'>
                      <p className='w-[50%] text-center'>{user.username}</p>
                      <p className='w-[50%] text-center'>{user.email}</p>
                    </div>
                    <p className='w-[50%] text-center'>Age:</p>
                    <p className='w-[50%] text-center'>{user.age}</p>
                    <p className='w-[50%] text-center'>ID:</p>
                    <p className='w-[50%] text-center'>{user.id}</p>
                    <p className='w-[50%] text-center'>Gender:</p>
                    <p className='w-[50%] text-center'>{user.gender}</p>
                  </div>
                )}
              </div>

              <div>
                <div className='w-full max-w-[600px] h-[250px] p-[10px] rounded-[7px] bg-[#F1FCF3] '>
                  <div className='h-full flex flex-col p-[30px] items-center'>
                    <p className='mb-[10px] '>Notifications by email</p>
                    <div style={{ display: 'flex', gap: '80px', height: '25px' }}>
                      <label className='flex gap-[5px] items-center '>
                        <input
                          type="checkbox"
                          checked={emailNotification === 'yes'}
                          onChange={() => handleEmailNotificationChange('yes')}
                          className="appearance-none w-[20px] h-[20px] rounded-md cursor-pointer bg-white checked:bg-[#38A169] border-[1px] border-[#9D9D9D] checked:border-none"
                        />
                        <p>Yes</p>
                      </label>
                      <label className='flex gap-[5px] items-center'>
                        <input
                          type="checkbox"
                          checked={emailNotification === 'no'}
                          onChange={() => handleEmailNotificationChange('no')}
                          className="appearance-none w-[20px] h-[20px] rounded-md cursor-pointer bg-white checked:bg-[#38A169] border-[1px] border-[#9D9D9D] checked:border-none"
                        /> No
                      </label>
                    </div>

                    <p className='mb-[10px] mt-[10px]'>Push notifications</p>
                    <div style={{ display: 'flex', gap: '80px', height: '25px' }}>
                      <label className='flex gap-[5px] items-center'>
                        <input
                          type="checkbox"
                          checked={pushNotification === 'yes'}
                          onChange={() => handlePushNotificationChange('yes')}
                          className="appearance-none w-[20px] h-[20px] rounded-md cursor-pointer bg-white checked:bg-[#38A169] border-[1px] border-[#9D9D9D] checked:border-none"

                        /> Yes
                      </label>
                      <label className='flex gap-[5px] items-center'>
                        <input
                          type="checkbox"
                          checked={pushNotification === 'no'}
                          onChange={() => handlePushNotificationChange('no')}
                          className="appearance-none w-[20px] h-[20px] rounded-md cursor-pointer bg-white checked:bg-[#38A169] border-[1px] border-[#9D9D9D] checked:border-none"

                        /> No
                      </label>
                    </div>
                    <div className='mt-[20px] content-center text-center'>
                      <button
                        className={`bg-[#84D49D] text-white w-[120px] h-[40px] rounded-[10px] ${isCooldown ? 'Updated!' : ''}`}
                        onClick={handleUpdateClick}
                      >
                        {isCooldown ? `Updated!` : 'Update'}
                      </button>
                    </div>
                  </div>
                </div>
                <div className='w-full max-w-[550px] bg-[#F1FCF3] rounded-[5px] mt-[10px] h-[250px] text-center'>
                  <div className='flex justify-between pl-[20px] pr-[20px] pt-[20px] items-center'>
                    <p className='text-[#3B4A3F]'>Inspire Others</p>
                    <p><img src={Logo} alt='Earth' className='w-[40px] h-[40px]' /></p>
                  </div>
                  <p className='text-[#3B4A3F] p-[20px] text-[14px]'>
                    Did you know that regular exercise can boost your
                    brainpower? Physical activity increases
                    the production of proteins that improve brain
                    function, memory, and learning capabilities. Just
                    30 minutes of exercise a few times a week can
                    make a significant difference!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackGround>
  );
};

export default Profile;
