import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import Header from './Components/Header';
import { jwtDecode } from "jwt-decode";
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [userRoutes, setUserRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('');
  const [emailStatus, setEmailStatus] = useState(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const maxLength = 300;
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

  const handleIssueChange = (event) => {
    setSelectedIssue(event.target.value);
  };

  const toggleFAQ = () => {
    setShowFAQ(!showFAQ);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (inputValue.trim() === '' || selectedIssue.trim() === '') {
      setEmailStatus('error');
      return;
    }

    const combinedMessage = `Issue Type: ${selectedIssue}\n\nDescription: ${inputValue}`;
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
        setSelectedIssue('');
      }, (err) => {
        setEmailStatus('error');
      });
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  const remainingChars = maxLength - inputValue.length;

  return (

    <div className='w-full h-full min-h-screen bg-[#6E9B7B] content-center'>
      <div className='flex w-full max-w-[1440px] min-h-[800px]  h-full justify-self-center gap-[20px] p-[20px]'>
        <div className='w-[20%] max-w-[120px]  rounded-[10px] bg-[#D9EDDF] justify-items-center'>
          <Sidebar />
        </div>
        <div className='scrollbar-hide flex w-[100%] bg-[#D9EDDF] max-h-[760px] rounded-[10px] overflow-y-scroll justify-center'>
          <div className='flex justify-start h-screen min-h-screeen items-center flex-col w-full max-w-[1600px] justify-self-center'>
            <Header
              user={user}
              theme={theme}
              toggleTheme={toggleTheme}
              toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />
            <div className=' w-full h-full justify-items-center content-center'>
              <div onClick={toggleFAQ} className=' hover:cursor-pointer bg-black w-[150px] h-[60px] hover:scale-105 rounded-[5px] text-center content-center'>
                <a className='text-white' >
                  FAQ
                </a>
              </div>
              <div className=" w-[95%] max-w-[620px] h-[340px] bg-white justify-items-center rounded-[10px]">
                <div className=''>
                  <p>I have a problem</p>
                </div>
                <div className='h-[300px] w-[95%] max-w-[600px]'>
                  <div className=''>
                    <select
                      id="issue-select"
                      className="w-full p-[10px] border-[1px] border-[#ccc] rounded-[4px]"
                      value={selectedIssue}
                      onChange={handleIssueChange}
                    >
                      <option value="">Select an option</option>
                      <option value="Technical Issue">Technical Issue</option>
                      <option value="Account Issue">Account Issue</option>
                      <option value="Payment Issue">Payment Issue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {showFAQ && (
                    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 content-center justify-items-center'>
                      <div className='w-[95%] h-[300px] bg-white max-w-[500px] overflow-y-scroll scrollbar-hidden p-[30px] rounded-[10px]'>
                        <button className='' onClick={toggleFAQ}>X</button>
                        <h2>FAQ</h2>
                        <div className=''>
                          <h3>What is this website about?</h3>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla auctor vehicula lacus.</p>
                        </div>
                        <div className=''>
                          <h3>How do I reset my password?</h3>
                          <p>Curabitur vehicula neque nec sem tempus fermentum. Mauris ac sapien vel mauris eleifend fermentum.</p>
                        </div>
                        <div className=''>
                          <h3>How do I reset my password?</h3>
                          <p>Curabitur vehicula neque nec sem tempus fermentum. Mauris ac sapien vel mauris eleifend fermentum.</p>
                        </div>
                        <div className=''>
                          <h3>How do I reset my password?</h3>
                          <p>Curabitur vehicula neque nec sem tempus fermentum. Mauris ac sapien vel mauris eleifend fermentum.</p>
                        </div>
                        <div className=''>
                          <h3>How do I reset my password?</h3>
                          <p>Curabitur vehicula neque nec sem tempus fermentum. Mauris ac sapien vel mauris eleifend fermentum.</p>
                        </div>
                        <div className=''>
                          <h3>How do I reset my password?</h3>
                          <p>Curabitur vehicula neque nec sem tempus fermentum. Mauris ac sapien vel mauris eleifend fermentum.</p>
                        </div>

                      </div>
                    </div>
                  )}
                  <div className=''>
                    <div className="relative">
                      <label htmlFor="problem-input" className="absolute top-[10px] left-[10px] bg-white ">Describe your issue</label>
                      <input
                        id="problem-input"
                        className="box-border w-full h-[180px] border-[#ccc] border-[1px] rounded-[5px]  p-[10px] mt-[20px]"
                        placeholder=" "
                        value={inputValue}
                        onChange={handleInputChange}
                        maxLength={maxLength}
                      />
                      <div className="absolute bottom-[10px] right-[10px] text-[#888]">
                        {remainingChars} characters remaining
                      </div>
                    </div>
                  </div>
                  <div className='mt-[5px] CustomXSM:grid'>
                    <button className='w-[150px] h-[40px] bg-black text-white rounded-[5px] hover:scale-105' onClick={sendEmail}>Send</button>
                    {emailStatus === 'success' && <span className='ml-[10px] text-green-500 font-bold CustomXSM:ml-[0px] CustomXSM:mt-[10px]'>Email sent successfully!</span>}
                    {emailStatus === 'error' && <span className='ml-[10px] text-red-500 font-bold CustomXSM:ml-[0px] CustomXSM:mt-[10px]'>Please select an issue type and provide a description.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
