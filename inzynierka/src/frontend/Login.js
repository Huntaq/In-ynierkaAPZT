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
    console.log('Attempting to login with username:', username);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        navigate('/UserAcc');
      } else {
        setLoginError(data.error || 'Invalid login');
      }
    } catch 
    (error) {
      console.error('Error during login:', error);
      setLoginError('An error occurred. Please try again.');
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <h2 className='inline'>Login</h2>
        {loginError && <p className='error inline'>{loginError}</p>}
      </div>
      <div className='row'>
        <div className='credentials'>
          <input
            className='login margin-bottom'
            placeholder='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input
            className='passwd'
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className='row'>
        <button className='buttonLogin float-right' onClick={handleLogin}>
          Login
        </button>
        <Link to='/register'>Need account? Register now!</Link>
      </div>
    </div>
  );
};

export default Login;
