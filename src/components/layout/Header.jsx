import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              ShopHub
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            {user ? (
              <>
                {user.role === 'shop_owner' ? (
                  <Link to="/shop-dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/customer-dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                )}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <span>{user.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link to="/" className="block text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            {user ? (
              <>
                {user.role === 'shop_owner' ? (
                  <Link to="/shop-dashboard" className="block text-gray-700 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/customer-dashboard" className="block text-gray-700 hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                )}
                <Link to="/profile" className="block text-gray-700 hover:text-blue-600 transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="block text-gray-700 hover:text-blue-600 transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header; 