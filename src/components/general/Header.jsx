import React from 'react';
import logo from '../../../public/assets/GreenwichLogo.png';
import { useNavigate, Link } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
function Header() {
  const navigate = useNavigate(); // Initialize navigate
  const handleLogout = () => {
    localStorage.clear(); // Uncomment if using localStorage
    navigate('/');
  };
  return (
    <header className="bg-gray-100 py-4 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and title */}
          <div className="flex items-center">
            <img src={logo} alt="University of Greenwich" className="h-20 w-auto mr-2" />

          </div>

          <nav className="hidden md:flex space-x-10">
            <Link to="/student/index" className="text-base font-medium text-gray-500 hover:text-gray-900">My articles</Link>
            <Link to="/student/addnew" className="text-base font-medium text-gray-500 hover:text-gray-900">New articles</Link>
            <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">Guidelines</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800">
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