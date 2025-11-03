import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Activity, 
  Droplet, 
  Users, 
  TrendingUp, 
  Bell, 
  LogOut, 
  Menu,
  X,
  AlertTriangle
} from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import StatCard from '../components/hospital/StatCard';
import BloodInventoryChart from '../components/hospital/BloodInventoryChart';
import RequestsChart from '../components/hospital/RequestsChart';
import RecentRequests from '../components/hospital/RecentRequests';
import QuickActions from '../components/hospital/QuickActions';
import NotificationCenter from '../components/hospital/NotificationCenter';
import AppointmentScheduler from '../components/hospital/AppointmentScheduler';
import DonorRecognition from '../components/hospital/DonorRecognition';
import RecordsTracker from '../components/hospital/RecordsTracker';

function HospitalDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    if (!user || user.role !== 'hospital') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  // Mock statistics - replace with real API data
  const stats = {
    totalRequests: 156,
    activeRequests: 12,
    totalDonors: 1248,
    bloodUnits: 198,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <Droplet className="w-6 h-6 text-white" fill="currentColor" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">Give Life</span>
                <p className="text-xs text-gray-500">Hospital Portal</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-gray-700 hover:text-red-600 font-medium transition">
                Dashboard
              </Link>
              <Link to="/hospital/request-blood" className="text-gray-700 hover:text-red-600 font-medium transition">
                Requests
              </Link>
              <Link to="/find-blood" className="text-gray-700 hover:text-red-600 font-medium transition">
                Find Donors
              </Link>
              
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-red-600 transition">
                <Bell className="w-6 h-6" />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user.hospitalName}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/hospital/request-blood"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Requests
                </Link>
                <Link
                  to="/find-blood"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Find Donors
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Welcome back, {user.hospitalName}!
                </h1>
                <p className="text-red-100 text-lg">
                  Here's what's happening with your blood donation center today
                </p>
              </div>
              <Link
                to="/hospital/request-blood"
                className="flex items-center space-x-2 bg-white text-red-700 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Bell className="w-5 h-5" />
                <span>New Request</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Critical Alert */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">Low Blood Inventory Alert</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Blood types O- and AB- are running low. Consider organizing a donation drive.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Requests"
            value={stats.totalRequests}
            icon={Activity}
            trend="up"
            trendValue="12%"
            color="blue"
          />
          <StatCard
            title="Active Requests"
            value={stats.activeRequests}
            icon={Bell}
            trend="down"
            trendValue="3%"
            color="red"
          />
          <StatCard
            title="Registered Donors"
            value={stats.totalDonors}
            icon={Users}
            trend="up"
            trendValue="8%"
            color="green"
          />
          <StatCard
            title="Blood Units Available"
            value={stats.bloodUnits}
            icon={Droplet}
            trend="up"
            trendValue="5%"
            color="purple"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BloodInventoryChart />
          <RequestsChart />
        </div>

        {/* Recent Requests and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <RecentRequests />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Notification Center & Appointment Scheduler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <NotificationCenter />
          <AppointmentScheduler />
        </div>

        {/* Donor Recognition & Gamification */}
        <div className="mb-8">
          <DonorRecognition />
        </div>

        {/* Records Tracker */}
        <div className="mb-8">
          <RecordsTracker />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2025 Give Life Blood Donation. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/about" className="text-sm text-gray-600 hover:text-red-600">
                About Us
              </Link>
              <Link to="#" className="text-sm text-gray-600 hover:text-red-600">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm text-gray-600 hover:text-red-600">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HospitalDashboard;
