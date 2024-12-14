import React, { useState, useEffect } from 'react';
import Logo from './Components/img/earthLogo.png';
import { Link, useNavigate } from 'react-router-dom';
import LoginRegisterBackground from './Components/LoginRegisterBackground';

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
    <>
      <LoginRegisterBackground>
      <div className='mb-4 flex max-w-[300px]'>
            <h1 className='text-4xl font-bold text-[#3B4A3F]'>Welcome back</h1>
          </div>

          <div className='flex flex-row items-center max-w-[300px] w-full justify-center mb-5 space-x-2'>
            <p className='font-medium text-[#3B4A3F]'>
              New to EcoSphere?
            </p>
            <Link to='/register' className=' text-[#6E9B7B] font-bold hover:underline'>
              Register now!
            </Link>
          </div>
          <div className='mb-5 flex max-w-[300px] w-full justify-center items-center'>
            {loginError ? (
              <p className='font-medium text-red-500 text-center'>{loginError}</p>
            ) : (
              <p className='invisible'>placeholder</p>
            )}
          </div>

          <div className='max-w-[300px] w-full max-w-xs'>
            <div className='flex flex-col mb-4'>
              <label className="block mb-2 text-m font-medium text-[#3B4A3F]">Username</label>
              <input
                className='p-2 border mb-4 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <label className="block  text-m font-medium text-[#3B4A3F] ">Password</label>
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
          <div className='flex items-center max-w-[300px] w-full justify-center'>

            <button
              className='w-[100px] p-2 bg-[#84D49D] text-xl font-medium text-white rounded-md hover:bg-[#6E9B7B] focus:outline-none focus:ring-2 focus:ring-blue-300'
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
      </LoginRegisterBackground>
    </>

  );
};

export default Login;
