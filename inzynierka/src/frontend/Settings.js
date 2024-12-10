import React, { useEffect, useState } from 'react';
import Header from './Components/Header';
import { jwtDecode } from "jwt-decode";
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';
import BackGround from './Components/BackGround';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);
  const [showSettings, setShowSettings] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {

    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const id = decodedToken.id;
        const sessionKey = decodedToken.sessionKey;

        const userResponse = await fetch(`http://localhost:5000/api/users/${id}`, {
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
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    localStorage.setItem('theme', theme);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (inputValue.trim() === '') {
      setEmailStatus('error');
      return;
    }

    const combinedMessage = `Description: ${inputValue}`;
    const templateParams = {
      from_name: user.id,
      message: combinedMessage,
    };

    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.REACT_APP_EMAILJS_USER_ID
    )
      .then((response) => {
        setEmailStatus('success');
        setInputValue('');
      }, (err) => {
        setEmailStatus('error');
      });
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  return (

    <BackGround>
      <div className='scrollbar-hide flex w-[100%] bg-[#D9EDDF]  rounded-[10px] overflow-y-scroll justify-center max-h-[760px]'>
        <div className='flex justify-start min-h-screeen items-center flex-col w-full max-w-[1600px] justify-self-center'>
          <Header
            user={user}
            theme={theme}
            toggleTheme={toggleTheme}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          <div className=' w-[95%] h-full max-w-[1160px] '>
            {showSettings ? (
              <>
                <div onClick={() => setShowSettings(false)} className=' hover:cursor-pointer w-full max-w-[98%] h-[60px] content-center mb-[30px] mt-[10px]'>
                  <a className='text-[#3B4A3F] text-[26px] hover:text-[30px] CustomXSM:text-[20px]  CustomXSM:hover:text-[24px]'>
                    Frequently Asked Questions {">"}
                  </a>
                </div>
                <div className=" w-full max-w-[620px]">
                  <div className='max-w-[280px]'>
                    <p className='text-[#3B4A3F] text-[26px] CustomXSM:text-[20px]'>I have a problem</p>
                    <p className='mt-[10px] text-[#3B4A3F] text-[20px] CustomXSM:text-[16px]'>This module lets you quickly report any issues you're experiencing so we can help resolve them.</p>
                  </div>
                  <div className=' w-[95%] max-w-[600px]'>
                    <div className='mt-[20px]'>
                      <p className="text-[#3B4A3F] text-[20px] CustomXSM:text-[14px]">1.Describe your issue</p>
                      <p className="text-[#3B4A3F] text-[20px] CustomXSM:text-[14px]">2. Include error messages</p>
                      <p className="text-[#3B4A3F] text-[20px] CustomXSM:text-[14px]">3. List steps that caused the issue</p>
                      <div className="">
                        <textarea
                          id="problem-input"
                          className="box-border w-full h-[180px] bg-[#F1FCF3] border-[1px] border-[#D8D8D8] rounded-[20px] p-[10px]  mt-[5px]"
                          placeholder=" "
                          value={inputValue}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={`mt-[5px] CustomXSM:grid flex ${!emailStatus ? 'justify-end' : 'justify-between'}`}>
                      {emailStatus === 'success' && (
                        <span className="ml-[10px] text-green-500 font-bold CustomXSM:ml-[0px] CustomXSM:mt-[10px]">
                          Email sent successfully!
                        </span>
                      )}
                      {emailStatus === 'error' && (
                        <span className="ml-[10px] text-red-500 font-bold CustomXSM:ml-[0px] CustomXSM:mt-[10px]">
                          Please select an issue type and provide a description.
                        </span>
                      )}
                      <button className="w-[100px] h-[40px] bg-[#84D49D] text-white rounded-[20px] hover:scale-105" onClick={sendEmail}>
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className='w-full overflow-hidden'>
                <div className='w-[95%]'>
                  <button onClick={() => setShowSettings(true)} className='text-[#3B4A3F] text-[26px] hover:text-[30px] CustomXSM:text-[20px]  CustomXSM:hover:text-[24px] h-[60px]'>{"<"} Go back</button>
                  <div className='w-full max-w-[500px] justify-self-center mt-[20px] text-[#3B4A3F] text-[20px] overflow-y-auto scrollbar-hide max-h-[500px] p-[10px]'>
                    <div>
                      <h3>What is this website about?</h3>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla auctor vehicula lacus.</p>
                    </div>
                    <div>
                      <h3>How do I reset my password?</h3>
                      <p>Curabitur vehicula neque nec sem tempus fermentum. Mauris ac sapien vel mauris eleifend fermentum.</p>
                    </div>
                    <div>
                      <h3>How do I reset my password?</h3>
                      <p>Curabitur vehicula neque nec sem tempus fermentum. Mauris ac sapien vel mauris eleifend fermentum.</p>
                    </div>
                    <div>
                      <h3>How do I reset my password?</h3>
                      <p>Curabitur vehicula neque nec sem tempus fermentum. Mauris ac sapien vel mauris eleifend fermentum.</p>
                    </div>
                    <div>
                      <h3>How do I reset my password?</h3>
                      <p>Curabitur vehicula neque nec sem tempus fermentum. Mauris ac sapien vel mauris eleifend fermentum.</p>
                    </div>
                    <div>
                      <h3>How do I reset my password?</h3>
                      <p>Curabitur vehicula neque nec sem tempus fermentum. Mauris ac sapien vel mauris eleifend fermentum.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </BackGround>

  );
};

export default Settings;
