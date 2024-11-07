import React, { useState, useEffect } from 'react';
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
        localStorage.setItem('showPopup', 'true');

        navigate('/UserAcc');
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (err) {
      console.error('error', err);
      setLoginError('An error occurred during login');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className='flex flex-col items-center justify-center w-full h-screen p-6 bg-gray-100'>
      <div className='mb-4 flex max-w-[300px] w-full justify-between items-center'>
        <h2 className='text-2xl font-bold text-gray-700'>Login</h2>
        {loginError && <p className='text-red-500'>{loginError}</p>}
      </div>
      <div className='max-w-[300px] w-full max-w-xs'>
        <div className='flex flex-col mb-4'>
          <input
            className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <input
            className='p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className='flex items-center max-w-[300px] w-full justify-between'>
        <Link to='/register' className='text-blue-500 hover:underline text-xs'>
          Need an account? Register now!
        </Link>
        <button
          className='w-[100px] p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300'
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
