import React, { useState, useEffect, useRef } from 'react';
import GeneralLayout from '../components/general/GeneralLayout';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../css/forms.css';
import * as jwt_decode from 'jwt-decode';
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    // Username validation
    if (!username.trim()) {
      errors.username = 'Username is required';
      formIsValid = false;
    }

    // Password validation
    if (!password) {
      errors.password = 'Password is required';
      formIsValid = false;
    }

    setErrors(errors);
    return formIsValid;
  };
  function decodeJWT(token) {
    if (!token) {
      console.error('Token is undefined or null.');
      return null;
    }

    try {
      const payload = token.split('.')[1];
      if (!payload) {
        throw new Error('JWT does not have the expected format.');
      }
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post('https://localhost:7002/api/Auth/login', {
          userName: username,
          password: password,
        });

        // Assuming the token is directly in the response body
        const token = response.data;
        if (token) {
          console.log('Login successful:', token);
          localStorage.setItem('token', token);

          // Decode the token to get the user role
          const decodedToken = decodeJWT(token);
          if (decodedToken) {
            const roleUri = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
            const userRole = decodedToken[roleUri];

            // Fetch user account information and store additional details
            const userResponse = await axios.get(`https://localhost:7002/api/Users/userName?userName=${username}`);
            const { facultyName, roleName } = userResponse.data;
            localStorage.setItem('username', username);
            localStorage.setItem('facultyName', facultyName);
            localStorage.setItem('userRole', roleName);
            localStorage.setItem('password',password);
            // Navigate based on the role
            if (userRole === 'Student') {
              navigate('/student/home');
            } else if (userRole === 'Admin') {
              navigate('/admin/user');
            } else if (userRole === 'Marketing Coordinator') {
              navigate('/coordinator/index');
            }else if (userRole === 'Marketing Manager') {
              navigate('/manager/index');
            }
            else if (userRole === 'Guest') {
              navigate('/guest/home');
            } else {
              console.log('User role not recognized or missing');
            }
          } else {
            console.error('Error decoding token');
          }
        } else {
          console.error('Token not found in login response');
        }
      } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 401) {
          setErrors({ apiError: 'Login failed. Please check your username and password.' });
        } else {
          setErrors({ apiError: 'An unexpected error occurred. Please try again.' });
        }
      }
    } else {
      console.error('Validation failed');
    }
  };

  return (
    <div className='h-[100vh] w-full relative bg-[url("https://cms.greenwich.edu.vn/pluginfile.php/1/theme_adaptable/p1/1698976651/socialbg.png")] bg-no-repeat bg-cover'>
      <div className='h-[100vh] w-full bg-black opacity-40 absolute top-0 bottom-0'>
      </div>
      <div className=' absolute top-52 flex justify-center w-full'>
        <div className="blurBox">
          <div className='w-fit  text-3xl text-white'>
            <h2 className='flex  justify-center mt-4 font-bold'>Login</h2>
            <form onSubmit={handleSubmit} className='text-black'>
              <div className='mt-8'>
                <input
                  type="text"
                  id="username"
                  value={username}
                  placeholder='Username'
                  className='p-2 rounded-xl transparentInput usernameInput'
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="errorMessage">⚠️{errors.username}</p>}
              </div>
              <div className='mt-4' >
                <input
                  type="password"
                  id="password"
                  value={password}
                  placeholder='Password'
                  className='p-2 rounded-xl transparentInput'
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="errorMessage">⚠️{errors.password}</p>}
              </div>
              <div className='mt-8 w-full flex justify-center'>
                <button type="submit" className=' p-2 bg-white font-bold loginButton w-full'>Login</button>
              </div>

            </form>
            {errors.apiError && <p className="errorMessage">⚠️ {errors.apiError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
