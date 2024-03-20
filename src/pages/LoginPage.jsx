import React, { useState, useEffect,useRef  } from 'react';
import GeneralLayout from '../components/general/GeneralLayout';
import { Link, useNavigate, useLocation  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../css/forms.css';
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post('https://localhost:7002/api/Auth/login', {
          userName: username,
          password: password
        });

        console.log('Login successful:', response.data);
        localStorage.setItem('token', response.data);
        navigate('/admin/user');
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
  }
  return (
    <GeneralLayout>
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
                <div className='mt-4 flex justify-center text-white'>
                  <p className="registerText">Don't have an account yet? <Link to={'/register'} className="registerLink">Click here</Link></p>
                </div>
              </form>
              {errors.apiError && <p className="errorMessage">⚠️ {errors.apiError}</p>}
            </div>
          </div>
        </div>
      </div>
    </GeneralLayout>
  );
}

export default LoginPage;
