import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginRegisterBackground from './Components/LoginRegisterBackground';
const Register = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [ageError, setAgeError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [errorMessageDuplicate, setErrorMessageDuplicate] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const validateName = (name) => /^[A-Za-z]{2,30}$/.test(name);
    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Min 8 chars';
        }
        if (password.length > 24) {
            return 'Max 24 chars';
        }
        if (!/[a-z]/.test(password)) {
            return 'At least 1 lowercase';
        }
        if (!/[A-Z]/.test(password)) {
            return 'At least 1 uppercase';
        }
        if (!/\d/.test(password)) {
            return 'At least 1 digit';
        }
        if (!/[\W_]/.test(password)) {
            return 'At least 1 special char';
        }
        if (/\s/.test(password)) {
            return 'No whitespace';
        }
        return '';
    };
    const validateEmail = (email) => /^[^\s,@]+@[^\s,@]+\.[^\s,@]+$/.test(email);
    const validateAge = (age) => /^\d{1,3}$/.test(age) && age >= 18 && age <= 99;
    const validateGender = (gender) => /^(M|F)$/.test(gender);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            navigate('../UserAcc');
        }
    }, [navigate]);

    const handleRegister = () => {
        setErrorMessageDuplicate('');
        let isValid = true;

        if (!validateName(name)) {
            setNameError('Must contain only letters');
            isValid = false;
        } else {
            setNameError('');
        }

        const passwordValidationResult = validatePassword(password);
        if (passwordValidationResult !== '') {
            setPasswordError(passwordValidationResult);
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

        fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        if (errorData.error === 'username exists') {
                            setErrorMessageDuplicate('Nickname is already in use');
                        }
                        else if (errorData.error === 'email exists') {
                            setErrorMessageDuplicate('Email is already in use');
                        }
                        return Promise.reject();
                    });
                }
                return response.json();
            })
            .then(data => {
                setSuccessMessage('Register succesfull');

                setTimeout(() => {
                    navigate('/');
                }, 3000);
            })
            .catch(error => {
            });
    };

    return (
        <LoginRegisterBackground>
            <div className='flex flex-col items-center justify-center w-full h-screen bg-gray-100'>

                <div className='mb-4 flex justify-between max-w-[300px] w-full'>
                    <h2 className='text-2xl font-bold text-gray-700'>Register</h2>
                    {errorMessageDuplicate && <p className="text-red-500 self-center">{errorMessageDuplicate}</p>}
                    {successMessage && <p className='text-green-500'>{successMessage}</p>}
                </div>

                <div className='w-full max-w-[300px]'>
                    <div className='mb-4'>
                        <div className='flex justify-between max-w-[300px]'>
                            <p className='text-gray-600'>Nickname</p>
                            {nameError && <p className='text-red-500 '>{nameError}</p>}
                        </div>

                        <input
                            className='max-w-[300px] w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter your nickname'
                        />
                    </div>

                    <div className='mb-4'>
                        <div className='flex justify-between max-w-[300px]'>
                            <p className='text-gray-600'>Password</p>
                            {passwordError && <p className='text-red-500'>{passwordError}</p>}
                        </div>
                        <div className='relative flex w-full min-w-[350px]'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className='max-w-[300px] w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter your password'
                            />
                            <button
                                type='button'
                                className='absolute mt-[10px]  left-[250px]  text-blue-500 hover:underline'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className='mb-4'>
                        <div className='flex justify-between max-w-[300px]'>
                            <p className='text-gray-600'>E-mail</p>
                            {emailError && <p className='text-red-500'>{emailError}</p>}
                        </div>
                        <input
                            type='email'
                            className='max-w-[300px] w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your email'
                        />
                    </div>

                    <div className='mb-4'>
                        <div className='flex justify-between max-w-[300px]'>
                            <p className='text-gray-600'>Age</p>
                            {ageError && <p className='text-red-500'>{ageError}</p>}
                        </div>

                        <input
                            type='number'
                            className='max-w-[300px] w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder='Enter your age'
                        />
                    </div>

                    <div className='mb-4'>
                        <div className='flex justify-between max-w-[300px]'>
                            <p className='text-gray-600'>Gender</p>
                            {genderError && <p className='text-red-500'>{genderError}</p>}
                        </div>
                        <select
                            className='p-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value=''>Select Gender</option>
                            <option value='M'>Male</option>
                            <option value='F'>Female</option>
                        </select>
                    </div>
                    <div className='flex items-center justify-between'>
                        <button
                            className='w-full max-w-[120px] p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300'
                            onClick={() => window.location.href = '../'}
                        >
                            Go back
                        </button>
                        <button
                            className='w-full max-w-[120px] p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ml-2'
                            onClick={handleRegister}
                        >
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </LoginRegisterBackground>
    );
};

export default Register;
