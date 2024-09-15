import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/register.css';

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

    const validateName = (name) => /^[A-Za-z]{2,30}$/.test(name);
    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password should be at least 8 characters long';
        }
        if (password.length > 24) {
            return 'Password should be no more than 24 characters long';
        }
        if (!/[a-z]/.test(password)) {
            return 'Password should contain at least one lowercase letter';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Password should contain at least one uppercase letter';
        }
        if (!/\d/.test(password)) {
            return 'Password should contain at least one digit';
        }
        if (!/[\W_]/.test(password)) {
            return 'Password should contain at least one special character';
        }
        if (/\s/.test(password)) {
            return 'Password should not contain any whitespace characters';
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
        let isValid = true;

        if (!validateName(name)) {
            setNameError('Nickname must contain only letters');
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
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    return (
        <div className='container2'>
            <div className='row2 marginP'>
                <h2 className='register'>Register</h2>
            </div>
            <div className='row2'>
                <p className='inline1 inputype1'>Nickname </p>
                {nameError && <p className='error inline1'>{nameError}</p>}
                <input
                    className='inputRegister margin-top'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className='row2'>
                <p className='inline1 inputype1'>Password </p>
                {passwordError && <p className='error1 inline1'>{passwordError}</p>}
                <div className='input-container'>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className='inputRegister margin-top'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type='button'
                        className='show-password-button'
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>
            <div className='row2'>
                <p className='inline1 inputype1'>E-mail </p>
                {emailError && <p className='error inline1'>{emailError}</p>}
                <input
                    type='email'
                    className='inputRegister margin-top'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className='row2'>
                <p className='inline1 inputype1'>Age </p>
                {ageError && <p className='error inline1'>{ageError}</p>}
                <input
                    type='number'
                    className='inputRegister margin-top'
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
            </div>
            <div className='row2'>
                <p className='inline1 inputype1'>Gender </p>
                {genderError && <p className='error inline1'>{genderError}</p>}
                <select
                    className='inputRegister margin-top' 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value=''>Select Gender</option>
                    <option value='M'>Male</option>
                    <option value='F'>Female</option>
                </select>
            </div>
            <div className='row2'>
                <button className='button margin-top inline1' onClick={() => window.location.href = '../'}>
                    Go back
                </button>
                <button className='button margin-top float-right inline1' onClick={handleRegister}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default Register;
