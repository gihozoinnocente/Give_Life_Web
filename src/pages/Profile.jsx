import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronDown, User, LogOut, Bell, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { logout } from '../features/auth/authSlice';

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  // Mock donation history data
  const donationHistory = [
    { date: '13 Dec 2024', bloodUnits: 120 },
    { date: '28 Nov 2024', bloodUnits: 20 },
    { date: '04 Nov 2024', bloodUnits: 40 },
    { date: '15 Oct 2024', bloodUnits: 310 },
  ];

  // Calendar logic
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const today = new Date().getDate();
  const isCurrentMonth = currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <Link to="/find-blood" className="text-gray-900 font-medium border-b-2 border-gray-900 pb-1">
                Find Blood
              </Link>
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
                    <Link to="/register-donor" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                      Register as Donor
                    </Link>
                    <Link to="/register-hospital" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                      Register as Hospital
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center space-x-6">
                  <div className="w-28 h-28 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <User className="w-14 h-14 text-gray-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {user.firstName ? `${user.firstName} ${user.lastName}` : user.hospitalName}
                    </h1>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-600 hover:text-gray-900 transition">
                    <Bell className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => navigate('/edit-profile')}
                    className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">About</h2>
                <div className="space-y-0 bg-white rounded-lg">
                  <div className="grid grid-cols-2 gap-8 py-3 px-6 border-b border-gray-100">
                    <span className="text-gray-900 text-right font-medium">Full Name</span>
                    <span className="text-gray-900">
                      {user.firstName ? `${user.firstName} ${user.lastName}` : user.hospitalName || 'N/A'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 py-3 px-6 border-b border-gray-100">
                    <span className="text-gray-900 text-right font-medium">Email</span>
                    <span className="text-gray-900">{user.email || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 py-3 px-6 border-b border-gray-100">
                    <span className="text-gray-900 text-right font-medium">District</span>
                    <span className="text-gray-900">{user.district || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 py-3 px-6 border-b border-gray-100">
                    <span className="text-gray-900 text-right font-medium">Phone Number</span>
                    <span className="text-gray-900">{user.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 py-3 px-6 border-b border-gray-100">
                    <span className="text-gray-900 text-right font-medium">Pincode</span>
                    <span className="text-gray-900">{user.pinCode || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 py-3 px-6 border-b border-gray-100">
                    <span className="text-gray-900 text-right font-medium">Age</span>
                    <span className="text-gray-900">{user.age || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 py-3 px-6 border-b border-gray-100">
                    <span className="text-gray-900 text-right font-medium">Blood Group</span>
                    <span className="text-gray-900">{user.bloodGroup || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 py-3 px-6 border-b border-gray-100">
                    <span className="text-gray-900 text-right font-medium">Address</span>
                    <span className="text-gray-900">{user.address || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 py-3 px-6">
                    <span className="text-gray-900 text-right font-medium">Last Donation Date</span>
                    <span className="text-gray-900">{user.lastDonationDate || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Donation History & Calendar */}
          <div className="space-y-6">
            {/* Donation History */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4">Donation History</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium text-gray-600 pb-2 border-b">
                  <span>Date</span>
                  <span>Blood Units</span>
                </div>
                {donationHistory.map((donation, index) => (
                  <div key={index} className="flex justify-between text-sm py-2 border-b border-gray-100">
                    <span className="text-gray-600">{donation.date}</span>
                    <span className="text-gray-900 font-medium">{donation.bloodUnits}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <div className="flex items-center space-x-2">
                  <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
                  <div key={day} className="font-medium text-gray-600 py-2">{day}</div>
                ))}
                
                {[...Array(firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1)].map((_, i) => (
                  <div key={`empty-${i}`} className="py-2"></div>
                ))}
                
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const isToday = isCurrentMonth && day === today;
                  return (
                    <div
                      key={day}
                      className={`py-2 rounded ${
                        isToday ? 'bg-blue-500 text-white font-semibold' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
