import React, { useState } from 'react';
import logo from '../../../public/assets/GreenwichLogo.png';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';

function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleProfileNavigation = () => {
    if (userRole === 'Marketing Coordinator') {
      navigate('/coordinator/profile');
    } else if (userRole === 'Student') {
      navigate('/student/profile');
    }
  };

  return (
    <header className="bg-gray-100 py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/student/home">
            <img src={logo} alt="University of Greenwich" className="h-20 w-auto" />
          </Link>
          <button className="md:hidden" onClick={() => setIsDrawerOpen(true)}>
            <FiMenu className="h-6 w-6 text-gray-600" />
          </button>
          <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsDrawerOpen(false)}></div>
          <div className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 w-64 transform transition-transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-5">
              <h2 className="font-bold text-lg mb-4">Navigation</h2>
              {userRole === 'Student' && (
                <Link to="/student/index" className="block text-base font-medium text-gray-500 hover:text-gray-900 mb-2">Articles list</Link>
              )}
                {userRole === 'Marketing Coordinator' && (
                <Link to="/coordinator/index" className="block text-base font-medium text-gray-500 hover:text-gray-900 mb-2">Articles list</Link>
              )}
              {userRole === 'Student' && (
                <Link to="/student/addnew" className="block text-base font-medium text-gray-500 hover:text-gray-900 mb-2">New articles</Link>
              )}
              {userRole === 'Student' && (
                <Link to="/student/overview" className="block text-base font-medium text-gray-500 hover:text-gray-900 mb-2">Overview</Link>
              )}
              {userRole === 'Marketing Coordinator' && (
                <Link to="/coordinator/overview" className="block text-base font-medium text-gray-500 hover:text-gray-900 mb-2">Overview</Link>
              )}
              <button onClick={handleProfileNavigation} className="mt-4 text-gray-600 hover:text-gray-800">
                <FiUser className="h-6 w-6 inline" /> Profile
              </button>
              <div></div>
              <button onClick={handleLogout} className="mt-4 text-gray-600 hover:text-gray-800">
                <FiLogOut className="h-6 w-6 inline" /> Logout
              </button>
            </div>
          </div>
          <nav className="hidden md:flex space-x-10">
            {userRole === 'Student' && (
              <Link to="/student/index" className="text-base font-medium text-gray-500 hover:text-gray-900">Articles list</Link>
            )}
            {userRole === 'Student' && (
              <Link to="/student/addnew" className="text-base font-medium text-gray-500 hover:text-gray-900">New articles</Link>
            )}
                {userRole === 'Marketing Coordinator' && (
                <Link to="/coordinator/index" className="block text-base font-medium text-gray-500 hover:text-gray-900 mb-2">Articles list</Link>
              )}
            {userRole === 'Student' && (
              <Link to="/student/overview" className="block text-base font-medium text-gray-500 hover:text-gray-900 mb-2">Overview</Link>
            )}
            {userRole === 'Marketing Coordinator' && (
              <Link to="/coordinator/overview" className="block text-base font-medium text-gray-500 hover:text-gray-900 mb-2">Overview</Link>
            )}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <button onClick={handleProfileNavigation} className="text-gray-600 hover:text-gray-800">
              <FiUser className="h-6 w-6" />
            </button>
            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">
              <FiLogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
