
import React, { useEffect, useState } from 'react';
import '../css/login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='container'>
      <div className='row'>
        <h2>Login</h2>
      </div>
      <div className='row'>
        <div className='credentials'>
          <input className='login'placeholder='login'></input>
          <input className='passwd'placeholder='password'></input>
        </div>
      </div>
      <div className='row'>
      <Link to='/register'>Need account? Register now!</Link>
      </div>
    </div>
  );
};

export default Login;
