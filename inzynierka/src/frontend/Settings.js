import React, { useEffect, useState } from 'react';
import Sidebar from './Components/Sidebar';
import '../css/Settings.css';
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
          setError('Wystąpił błąd podczas pobierania danych');
        }
      } else {
        setError('Użytkownik nie jest zalogowany');
      }
      setLoading(false);
    };
  
    fetchUserData();
  }, []);

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
        console.log('SUCCESS!', response.status, response.text);
        setEmailStatus('success');
        setInputValue('');
        setSelectedIssue('');
      }, (err) => {
        console.error('FAILED...', err);
        setEmailStatus('error');
      });
  };

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Błąd: {error}</p>;

  const remainingChars = maxLength - inputValue.length;

  return (
    <div className='container'>
      <Sidebar 
        isOpen={sidebarOpen} 
        user={user}  
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        userRoutes={userRoutes} 
      />
      <Header 
        user={user} 
        theme={theme} 
        toggleTheme={toggleTheme} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />
      <div className='row'>
        <div className="rest-content">
          <div className='Problem FAQ'>
            <a className='none' onClick={toggleFAQ}>
              FAQ
            </a>
          </div>
          <div className='row'>
            <p>I have a problem</p>
          </div>
          <div className='Problem'>
            <div className='row'>
              <select
                id="issue-select"
                className="styled-select"
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
              <div className='modal-overlay'>
                <div className='modal-content'>
                  <button className='modal-close' onClick={toggleFAQ}>X</button>
                  <h2>FAQ</h2>
                  <div className='faq-item'>
                    <h3>What is this website about?</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla auctor vehicula lacus.</p>
                  </div>
                  <div className='faq-item'>
                    <h3>How do I reset my password?</h3>
                    <p>Curabitur vehicula neque nec sem tempus fermentum. Mauris ac sapien vel mauris eleifend fermentum.</p>
                  </div>
                </div>
              </div>
            )}
            <div className='row'>
              <div className="input-container">
                <label htmlFor="problem-input" className="input-label">Describe your issue</label>
                <input
                  id="problem-input"
                  className="styled-input"
                  placeholder=" "
                  value={inputValue}
                  onChange={handleInputChange}
                  maxLength={maxLength}
                />
                <div className="char-count">
                  {remainingChars} characters remaining
                </div>
              </div>
            </div>
            <div className='row'>
              <button className='buttonSendEmail' onClick={sendEmail}>Send</button>
              {emailStatus === 'success' && <span className='email-success'>Email sent successfully!</span>}
              {emailStatus === 'error' && <span className='email-error'>Please select an issue type and provide a description.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
