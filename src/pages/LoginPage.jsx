import React, { useState } from 'react';
import GeneralLayout from '../components/general/GeneralLayout';
import { Link } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log(username, password);
    // Redirect to dashboard or another page on successful login
  };

  return (
    <GeneralLayout>
      <div className='h-[100vh] w-full relative bg-[url("https://cms.greenwich.edu.vn/pluginfile.php/1/theme_adaptable/p1/1698976651/socialbg.png")] bg-no-repeat bg-cover'>
        <div className='h-[100vh] w-full bg-black opacity-40 absolute top-0 bottom-0'>

        </div>
        <div className=' absolute top-52 flex justify-center w-full'>
          <div className='w-fit  text-3xl text-white'>
            <h2 className='flex uppercase justify-center'>Login Account</h2>
            <form onSubmit={handleSubmit} className='text-black'>
              <div className='mt-4'>
                <input
                  type="text"
                  id="username"
                  value={username}
                  placeholder='Username'
                  className='p-2 rounded-md'
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className='mt-4' >

                <input
                  type="password"
                  id="password"
                  value={password}
                  placeholder='Password'
                  className='p-2 rounded-md'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='mt-4 flex justify-between'>
                <button type="submit" className=' p-2 bg-white font-bold rounded-xl px-8'>Login</button>
                <Link to={'/register'} className=' p-2 bg-white font-bold rounded-xl px-8' >Register</Link>
              </div>
            </form></div>
        </div>
      </div>
    </GeneralLayout>
  );
}

export default LoginPage;
