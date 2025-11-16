import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Droplet,
  Users,
  Bell,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity,
  MapPin,
  Award,
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { logout } from '../../features/auth/authSlice';

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/hospital/dashboard',
      badge: null
    },
    {
      title: 'Blood Requests',
      icon: Bell,
      path: '/hospital/requests'
    },
    {
      title: 'Blood Inventory',
      icon: Droplet,
      path: '/hospital/inventory',
      badge: null
    },
    {
      title: 'Find Donors',
      icon: Users,
      path: '/hospital/donors',
      badge: null
    },
    {
      title: 'Appointments',
      icon: Calendar,
      path: '/hospital/appointments',
      badge: '5'
    },
    {
      title: 'Health Records',
      icon: FileText,
      path: '/hospital/health-records',
      badge: null
    },
    {
      title: 'Reports',
      icon: FileText,
      path: '/hospital/reports',
      badge: null
    },
    {
      title: 'Donor Recognition',
      icon: Award,
      path: '/hospital/recognition',
      badge: null
    },
    {
      title: 'Activity Log',
      icon: Activity,
      path: '/hospital/activity',
      badge: null
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg text-gray-700 hover:bg-gray-50"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-xl z-40 transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? 'w-64' : 'w-20'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isOpen ? (
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <Droplet className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900">Give Life</span>
                <p className="text-xs text-gray-500">Hospital Portal</p>
              </div>
            </Link>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Droplet className="w-6 h-6 text-white" fill="currentColor" />
            </div>
          )}
        </div>

        {/* Toggle Button (Desktop only) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center text-gray-600 hover:bg-gray-50 shadow-md"
        >
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* User Info
        {isOpen && (
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.hospitalName?.charAt(0) || 'H'}
              </div>
            </div>
          </div>
        )} */}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-2 px-2">
          <div className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${active
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                    ${!isOpen && 'justify-center'}
                  `}
                  title={!isOpen ? item.title : ''}
                >
                  <Icon className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'} flex-shrink-0`} />
                  {isOpen && (
                    <>
                      <span className="flex-1 font-medium">{item.title}</span>
                      {item.badge && (
                        <span className={`
                          px-2 py-0.5 text-xs font-semibold rounded-full
                          ${active ? 'bg-white text-red-600' : 'bg-red-100 text-red-600'}
                        `}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Settings & Logout Section */}
        <div className="p-2 border-t border-gray-200 space-y-1">
          {/* Settings Button */}
          <Link
            to="/hospital/settings"
            onClick={() => setIsMobileOpen(false)}
            className={`
              w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
              ${isActive('/hospital/settings')
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
              }
              ${!isOpen && 'justify-center'}
            `}
            title={!isOpen ? 'Settings' : ''}
          >
            <Settings className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'} flex-shrink-0`} />
            {isOpen && <span className="font-medium">Settings</span>}
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200
              ${!isOpen && 'justify-center'}
            `}
            title={!isOpen ? 'Logout' : ''}
          >
            <LogOut className={`${isOpen ? 'w-5 h-5' : 'w-6 h-6'} flex-shrink-0`} />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
