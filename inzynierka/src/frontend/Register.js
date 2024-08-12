// Register.js
import React, { useState } from 'react';
import '../css/register.css';
const Register = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const handleRegister = () => {
        const userData = {
        name,
        password,
        email,
        age,
        gender,
        };

        fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          })
            .then(response => response.json())
            .then(data => {
              console.log('Success:', data);
              
            })
            .catch(error => {
              console.error('Error:', error);
             
            });
        };
        return (
            <div className='container'>
              <div className='row'>
                <h2>Register</h2>
              </div>
              <div className='row'>
                <p>Name</p>
                <input
                  className='inputRegister'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='row'>
                <p>Password</p>
                <input
                  type='password'
                  className='inputRegister'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='row'>
                <p>E-mail</p>
                <input
                  type='email'
                  className='inputRegister'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='row'>
                <p>Age</p>
                <input
                  type='number'
                  className='inputRegister'
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className='row'>
                <p>Gender</p>
                <select
                  className='inputRegister'
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value=''>Select Gender</option>
                  <option value='M'>Male</option>
                  <option value='F'>Female</option>
                </select>
              </div>
              <div className='row'>
                <button className='btnRegister' onClick={handleRegister}>
                  Register
                </button>
              </div>
            </div>
          );
        };

export default Register;
