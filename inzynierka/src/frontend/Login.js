import React, { useState, useEffect } from 'react';
import '../css/login.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/UserAcc');
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
  
        console.log('Token:', data.token);
  
        const protectedResponse = await fetch('http://localhost:5000/api/protected', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });
  
        if (protectedResponse.ok) {
          const protectedData = await protectedResponse.json();
        } else {
          console.error('Error with protected data');
        }
        navigate('/UserAcc');
      } else {
        console.error('Login error');
        setLoginError('Invalid username or password');
      }
    } catch (err) {
      console.error('Wystąpił błąd:', err);
      setLoginError('An error occurred during login');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className='container1'>
      <div className='row1'>
        <h2 className='inline'>Login</h2>
        {loginError && <p className='error inline'>{loginError}</p>}
      </div>
      <div className='row1'>
        <div className='credentials'>
          <input
            className='login margin-bottom'
            placeholder='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            className='passwd'
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className='row1'>
        <button className='buttonLogin float-right' onClick={handleLogin}>
          Login
        </button>
        <Link to='/register'>Need account? Register now!</Link>
      </div>
    </div>
  );
};

export default Login;
