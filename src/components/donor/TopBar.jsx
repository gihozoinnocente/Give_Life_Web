import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Bell, Search, MessageSquare, HelpCircle, Droplet } from 'lucide-react';

function TopBar() {
  const { user } = useSelector((state) => state.auth);
  const [notifications] = useState(5);
  const [messages] = useState(2);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search hospitals, appointments, or donations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Eligibility Status */}
          <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <Droplet className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Eligible to Donate</span>
          </div>

          {/* Help Button */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <HelpCircle className="w-6 h-6" />
          </button>

          {/* Messages */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <MessageSquare className="w-6 h-6" />
            {messages > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                {messages}
              </span>
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <Bell className="w-6 h-6" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.name || 'Donor'}</p>
              <p className="text-xs text-gray-500">Blood Type: {user?.bloodType || 'O+'}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'D'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
