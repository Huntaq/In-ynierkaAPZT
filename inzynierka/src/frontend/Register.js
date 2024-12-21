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
    const navigate = useNavigate();

    const validateName = (name) => /^[A-Za-z]{2,30}$/.test(name);
    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Min. 8 characters';
        }
        if (password.length > 24) {
            return 'Max. 24 characters';
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
            return 'At least 1 special character';
        }
        if (/\s/.test(password)) {
            return 'No whitespace';
        }
        return '';
    };
    const validateEmail = (email) => /^[^\s,@]+@[^\s,@]+\.[^\s,@]+$/.test(email);
    const validateAge = (age) => /^\d{1,3}$/.test(age) && age >= 18 && age <= 99;
    const validateGender = (gender) => /^(M|F)$/.test(gender);

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
            setGenderError('Select gender');
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
                            setErrorMessageDuplicate('Username is already in use');
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

    function GoToLogin(){
        navigate('../');
    }

    return (
        <LoginRegisterBackground>
            <div className='flex flex-col items-center justify-center w-full h-screen'>

                <div className='mb-4 flex justify-between max-w-[300px] w-full'>
                    <h2 className='text-2xl font-bold text-gray-700'>Let's start</h2>
                    {errorMessageDuplicate && <p className="text-red-500 self-center">{errorMessageDuplicate}</p>}
                    {successMessage && <p className='text-green-500'>{successMessage}</p>}
                </div>

                <div className='w-full max-w-[300px]'>
                    <div className='mb-4'>
                        <div className='flex justify-between max-w-[300px]'>
                        <label className="block mb-2 text-m font-medium text-[#3B4A3F]">Username</label>
                            {nameError && <p className='text-red-500 '>{nameError}</p>}
                        </div>

                        <input
                            className='max-w-[300px] w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84D49D]'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Enter your username'
                        />
                    </div>

                    <div className='mb-4'>
                        <div className='flex justify-between max-w-[300px]'>
                        <label className="block mb-2 text-m font-medium text-[#3B4A3F]">Password</label>
                            {passwordError && <p className='text-red-500'>{passwordError}</p>}
                        </div>
                        <div className='relative flex w-full min-w-[350px]'>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className='max-w-[300px] w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84D49D]'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Enter your password'
                            />
                            <button
                                type='button'
                                className='absolute mt-[10px]  left-[250px]  text-[#6E9B7B] hover:underline'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className='mb-4'>
                        <div className='flex justify-between max-w-[300px]'>
                        <label className="block mb-2 text-m font-medium text-[#3B4A3F]">Email</label>
                            {emailError && <p className='text-red-500'>{emailError}</p>}
                        </div>
                        <input
                            type='email'
                            className='max-w-[300px] w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84D49D]'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Enter your email'
                        />
                    </div>

                    <div className='mb-4'>
                        <div className='flex justify-between max-w-[300px]'>
                        <label className="block mb-2 text-m font-medium text-[#3B4A3F]">Age</label>
                            {ageError && <p className='text-red-500'>{ageError}</p>}
                        </div>

                        <input
                            type='number'
                            className='max-w-[300px] w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84D49D]'
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder='Enter your age'
                        />
                    </div>

                    <div className='mb-4'>
                        <div className='flex justify-between max-w-[300px]'>
                        <label className="block mb-2 text-m font-medium text-[#3B4A3F]">Gender</label>
                            {genderError && <p className='text-red-500'>{genderError}</p>}
                        </div>
                        <select
                            className='p-2 text-gray-600 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#84D49D]'
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
                            className='w-full max-w-[160px] p-2 font-medium text-xl text-[#6E9B7B] flex gap-[10px] items-center'
                            onClick={GoToLogin} 
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 22 22" fill="none">
                                <path d="M12.5 8L9.5 11L12.5 14" stroke="#6E9B7B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M1 11C1 6.286 1 3.929 2.464 2.464C3.93 1 6.286 1 11 1C15.714 1 18.071 1 19.535 2.464C21 3.93 21 6.286 21 11C21 15.714 21 18.071 19.535 19.535C18.072 21 15.714 21 11 21C6.286 21 3.929 21 2.464 19.535C1 18.072 1 15.714 1 11Z" stroke="#6E9B7B" strokeWidth="1.5"/>
                            </svg>

                            Go back
                        </button>
                        <button
                            className='w-full max-w-[120px] p-2 bg-[#84D49D] text-xl font-medium text-white rounded-md hover:bg-[#6E9B7B] focus:outline-none'
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
