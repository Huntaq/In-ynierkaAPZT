// Register.js
import React, { useState } from 'react';
import '../css/register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');

    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [ageError, setAgeError] = useState('');
    const [genderError, setGenderError] = useState('');

    const validateName = (name) => /^[A-Za-z]{2,30}$/.test(name);
    const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[^\s,]{8,24}$/.test(password);
    const validateEmail = (email) => /^[^\s,@]+@[^\s,@]+\.[^\s,@]+$/.test(email);
    const validateAge = (age) => /^\d{1,3}$/.test(age) && age >= 18 && age <= 99;
    const validateGender = (gender) => /^(M|F)$/.test(gender);

    const handleRegister = () => {
        let isValid = true;

        if (!validateName(name)) {
            setNameError('Invalid name');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!validatePassword(password)) {
            setPasswordError('Invalid password');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (!validateEmail(email)) {
            setEmailError('Invalid email');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!validateAge(age)) {
            setAgeError('Invalid age');
            isValid = false;
        } else {
            setAgeError('');
        }

        if (!validateGender(gender)) {
            setGenderError('Invalid gender');
            isValid = false;
        } else {
            setGenderError('');
        }

        if (!isValid) return;

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
                {nameError && <p className='error'>{nameError}</p>}
            </div>
            <div className='row'>
                <p>Password</p>
                <input
                    type='password'
                    className='inputRegister'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {passwordError && <p className='error'>{passwordError}</p>}
            </div>
            <div className='row'>
                <p>E-mail</p>
                <input
                    type='email'
                    className='inputRegister'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <p className='error'>{emailError}</p>}
            </div>
            <div className='row'>
                <p>Age</p>
                <input
                    type='number'
                    className='inputRegister'
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
                {ageError && <p className='error'>{ageError}</p>}
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
                {genderError && <p className='error'>{genderError}</p>}
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
