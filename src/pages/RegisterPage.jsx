import React, { useState } from 'react';
import GeneralLayout from '../components/general/GeneralLayout';
import { Link, useNavigate  } from 'react-router-dom';
import axios from 'axios';
import '../css/forms.css';
function RegisterPage() {
    const [errors, setErrors] = useState({});
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const formattedData = {
                    UserName: userInfo.username,
                    Email: userInfo.email,
                    Password: userInfo.password,
                    FirstName: userInfo.firstName,
                    LastName: userInfo.lastName,
                };

                const response = await axios.post('https://localhost:7002/api/Auth/register', formattedData);

                if (response.data) {
                    console.log('Registration successful:', response.data);
                    alert('Registration successful. Please login.');
                    navigate('/');
                }
            } catch (error) {
                console.error('Registration failed:', error.response ? error.response.data : error.message);
                if (error.response && error.response.data) {
                    setErrors({ apiError: error.response.data });
                }
            }
        } else {
            console.error('Validation failed');
        }
    };
    const validateForm = () => {
        let errors = {};
        let formIsValid = true;
        const nameRegex = /^[A-Za-z]+$/;

        // First name validation
        if (!userInfo.firstName.trim()) {
            errors.firstName = 'First name is required';
            formIsValid = false;
        } else if (!nameRegex.test(userInfo.firstName)) {
            errors.firstName = 'First name must contain only letters';
            formIsValid = false;
        }

        // Last name validation
        if (!userInfo.lastName.trim()) {
            errors.lastName = 'Last name is required';
            formIsValid = false;
        } else if (!nameRegex.test(userInfo.lastName)) {
            errors.lastName = 'Last name must contain only letters';
            formIsValid = false;
        }

        // Username validation
        if (!userInfo.username.trim()) {
            errors.username = 'Username is required';
            formIsValid = false;
        }

        // Email validation
        if (!userInfo.email.trim()) {
            errors.email = 'Email is required';
            formIsValid = false;
        } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
            errors.email = 'Email is not valid';
            formIsValid = false;
        }

        // Password validation
        if (!userInfo.password) {
            errors.password = 'Password is required';
            formIsValid = false;
        } else if (userInfo.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            formIsValid = false;
        }

        setErrors(errors);
        return formIsValid;
    };
    return (
        <GeneralLayout>
            <div className='h-[100vh] w-full relative bg-[url("https://cms.greenwich.edu.vn/pluginfile.php/1/theme_adaptable/p1/1698976651/socialbg.png")] bg-no-repeat bg-cover'>
                <div className='h-[100vh] w-full bg-black opacity-40 absolute top-0 bottom-0'>
                </div>
                <div className=' absolute top-52 flex justify-center w-full'>
                    <div className="blurBox">
                        <div className='w-fit  text-3xl text-white'>
                            <h2 className='flex justify-center font-bold'>Register Account</h2>
                            <form onSubmit={handleSubmit} className='text-black mt-8'>
                                <div className='mt-4 flex gap-4'>

                                    <input
                                        type="text"
                                        id="lastname"
                                        name="lastName"
                                        value={userInfo.lastName}
                                        placeholder='Last name'
                                        className='p-2 rounded-md transparentInput'
                                        onChange={handleChange}
                                    />

                                    <input
                                        type="text"
                                        id="firstName"
                                        name='firstName'
                                        value={userInfo.firstName}
                                        placeholder='First name'
                                        className='p-2 rounded-md transparentInput'
                                        onChange={handleChange}
                                    />

                                </div>
                                <div className='flex gap-4'>
                                    {errors.lastName && <p className="errorMessage">⚠️{errors.lastName}</p>}
                                    {errors.firstName && <p className="errorMessage">⚠️{errors.firstName}</p>}
                                </div>
                                <div className='mt-4 flex' >
                                    <input
                                        type="text"
                                        id="username"
                                        name='username'
                                        value={userInfo.username}
                                        placeholder='Username'
                                        className='p-2 rounded-md w-full transparentInput'
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.username && <p className="errorMessage">⚠️{errors.username}</p>}
                                <div className='mt-4' >
                                    <input
                                        type="password"
                                        id="password"
                                        name='password'
                                        value={userInfo.password}
                                        placeholder='Password'
                                        className='p-2 rounded-md  w-full transparentInput'
                                        onChange={handleChange}
                                    />
                                    {errors.password && <p className="errorMessage">⚠️{errors.password}</p>}
                                </div>
                                <div className='mt-4' >
                                    <input
                                        type="text"
                                        id="email"
                                        name='email'
                                        value={userInfo.email}
                                        placeholder='Email'
                                        className='p-2 rounded-md  w-full transparentInput'
                                        onChange={handleChange}
                                    />
                                    {errors.email && <p className="errorMessage">⚠️{errors.email}</p>}
                                </div>
                                <div className='mt-4 flex justify-center'>
                                    <button type='submit' className=' p-2 bg-white font-bold rounded-xl px-8'  >Register</button>
                                </div>
                                <div className='mt-4 flex justify-center text-white'>
                                    <p className="registerText">Already have an account? <Link to={'/'} className="registerLink">Log in</Link></p>
                                </div>
                            </form>
                            {errors.apiError && <p className="errorMessage">⚠️{errors.apiError}</p>}
                        </div></div>
                </div>
            </div>

        </GeneralLayout>
    );
}

export default RegisterPage;
