import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Navbar Component
 * Main navigation bar with links and user authentication status
 */
const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-xl font-bold">HemoLink</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="hover:bg-primary-700 px-3 py-2 rounded-md transition"
            >
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:bg-primary-700 px-3 py-2 rounded-md transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/requests"
                  className="hover:bg-primary-700 px-3 py-2 rounded-md transition"
                >
                  Blood Requests
                </Link>
                <Link
                  to="/my-requests"
                  className="hover:bg-primary-700 px-3 py-2 rounded-md transition"
                >
                  My Requests
                </Link>
                <Link
                  to="/chat"
                  className="hover:bg-primary-700 px-3 py-2 rounded-md transition"
                >
                  Messages
                </Link>
                
                {/* User Menu */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => navigate('/profile')}
                    className="text-sm hover:bg-primary-700 px-3 py-2 rounded-md transition cursor-pointer"
                  >
                    {user?.name}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-primary-800 hover:bg-primary-900 px-4 py-2 rounded-md transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:bg-primary-700 px-3 py-2 rounded-md transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary-600 hover:bg-gray-100 px-4 py-2 rounded-md transition font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-primary-700 transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="hover:bg-primary-700 px-3 py-2 rounded-md transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="hover:bg-primary-700 px-3 py-2 rounded-md transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/requests"
                    className="hover:bg-primary-700 px-3 py-2 rounded-md transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blood Requests
                  </Link>
                  <Link
                    to="/my-requests"
                    className="hover:bg-primary-700 px-3 py-2 rounded-md transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Requests
                  </Link>
                  <Link
                    to="/chat"
                    className="hover:bg-primary-700 px-3 py-2 rounded-md transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Messages
                  </Link>
                  
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setMobileMenuOpen(false);
                    }}
                    className="hover:bg-primary-700 px-3 py-2 rounded-md transition"
                  >
                    Profile
                  </button>
                  
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm">{user?.name}</span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="bg-primary-800 hover:bg-primary-900 px-4 py-2 rounded-md transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:bg-primary-700 px-3 py-2 rounded-md transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 hover:bg-gray-100 px-4 py-2 rounded-md transition font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
