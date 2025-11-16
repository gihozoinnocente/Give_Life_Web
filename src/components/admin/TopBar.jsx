import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Bell, Search, MessageSquare, HelpCircle } from 'lucide-react';

function TopBar() {
  const { user } = useSelector((state) => state.auth);
  const [notifications] = useState(3);
  const [messages] = useState(1);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 h-14 sm:h-16 max-w-7xl mx-auto gap-2 sm:gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl min-w-0">
          <div className="relative">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search hospitals..."
              className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 ml-1 sm:ml-2 md:ml-4 flex-shrink-0">
          {/* Help */}
          <button className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition" aria-label="Help">
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Messages */}
          <button className="relative p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition" aria-label="Messages">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
            {messages > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center text-[10px] sm:text-xs">
                {messages}
              </span>
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg transition" aria-label="Notifications">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            {notifications > 0 && (
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center text-[10px] sm:text-xs">
                {notifications}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <div className="hidden sm:flex items-center space-x-2 md:space-x-3 pl-2 md:pl-4 border-l border-gray-200">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
              {(user?.firstName || user?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[150px]">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin'}
              </p>
              <p className="text-xs text-gray-500">System Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
