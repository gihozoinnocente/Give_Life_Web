import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, User, LogOut, Bell, MapPin } from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import { fetchUnreadCount } from '../features/notifications/notificationSlice';
import Notifications from './Notifications';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchUnreadCount(user.id));
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount(user.id));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 transition">
              About Us
            </Link>
            {isAuthenticated && user && (
              <>
                {user.role === 'hospital' && (
                  <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition">
                    Dashboard
                  </Link>
                )}
                <Link to="/find-blood" className="text-gray-600 hover:text-gray-900 transition">
                  Find Blood
                </Link>
                {user.role === 'donor' && (
                  <Link to="/nearby-hospitals" className="text-gray-600 hover:text-gray-900 transition flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Nearby Hospitals</span>
                  </Link>
                )}
                {user.role === 'hospital' && (
                  <Link to="/hospital/request-blood" className="text-red-700 hover:text-red-800 transition font-medium">
                    Request Blood
                  </Link>
                )}
              </>
            )}
            {!isAuthenticated && !user && (
              <div className="relative">
                <button
                  onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition"
                >
                  Register Now
                  <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                {registerDropdownOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                    <Link 
                      to="/register-donor" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setRegisterDropdownOpen(false)}
                    >
                      Register as Donor
                    </Link>
                    <Link 
                      to="/register-hospital" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setRegisterDropdownOpen(false)}
                    >
                      Register as Hospital
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <button 
                  onClick={() => setNotificationsOpen(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                  >
                    <User className="w-5 h-5 text-gray-700" />
                  </button>
                  
                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                      <Link
                        to="/profile"
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login">
                <button className="px-6 py-2 border-2 border-gray-900 text-gray-900 rounded hover:bg-gray-900 hover:text-white transition">
                  Log In
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Notifications Panel */}
      <Notifications 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />
    </header>
  );
}

export default Navbar;
