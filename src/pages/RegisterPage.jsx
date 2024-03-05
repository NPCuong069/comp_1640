import React, { useState } from 'react';
import GeneralLayout from '../components/general/GeneralLayout';
import { Link } from 'react-router-dom';

function RegisterPage() {
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('User Info:', userInfo);
    };

    return (
        <GeneralLayout>

            <div className='h-[100vh] w-full relative bg-[url("https://cms.greenwich.edu.vn/pluginfile.php/1/theme_adaptable/p1/1698976651/socialbg.png")] bg-no-repeat bg-cover'>
                <div className='h-[100vh] w-full bg-black opacity-40 absolute top-0 bottom-0'>
                </div>
                <div className=' absolute top-52 flex justify-center w-full'>
                    <div className='w-fit  text-3xl text-white'>
                        <h2 className='flex uppercase justify-center'>Register Account</h2>
                        <form onSubmit={handleSubmit} className='text-black mt-8'>
                            <div className='mt-4 flex gap-4'>

                                <input
                                    type="text"
                                    id="lastname"
                                    name="lastName"
                                    value={userInfo.lastName}
                                    placeholder='Last name'
                                    className='p-2 rounded-md'
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    id="firstName"
                                    name='firstName'
                                    value={userInfo.firstName}
                                    placeholder='First name'
                                    className='p-2 rounded-md'
                                    onChange={handleChange}
                                />

                            </div>
                            <div className='mt-4 flex' >
                                <input
                                    type="text"
                                    id="username"
                                    name='username'
                                    value={userInfo.username}
                                    placeholder='Username'
                                    className='p-2 rounded-md w-full'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='mt-4' >
                                <input
                                    type="text"
                                    id="password"
                                    name='password'
                                    value={userInfo.password}
                                    placeholder='Password'
                                    className='p-2 rounded-md  w-full'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='mt-4' >
                                <input
                                    type="text"
                                    id="email"
                                    name='email'
                                    value={userInfo.email}
                                    placeholder='Email'
                                    className='p-2 rounded-md  w-full'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='mt-4 flex justify-center'>
                            
                                <Link to={'/register'} className=' p-2 bg-white font-bold rounded-xl px-8' >Register</Link>
                            </div>
                        </form></div>
                </div>
            </div>
            {/* <div>
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={userInfo.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userInfo.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={userInfo.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div> */}
        </GeneralLayout>
    );
}

export default RegisterPage;
