import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Droplet, Award, MapPin, Bell, CheckCircle, Clock, User, FileText, Heart, TrendingUp, Filter, Download, Search, X } from 'lucide-react';

function DonorActivityLog() {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Activity data
  const activities = [
    {
      id: 1,
      type: 'donation',
      title: 'Blood Donation Completed',
      description: 'Successfully donated 450ml of O+ blood at King Faisal Hospital',
      timestamp: '2025-09-15 10:30 AM',
      icon: Droplet,
      color: 'red',
      details: {
        hospital: 'King Faisal Hospital',
        bloodType: 'O+',
        units: 1,
        hemoglobin: 14.5
      }
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Achievement Unlocked',
      description: 'Earned "Life Saver" badge for completing 10 donations',
      timestamp: '2025-09-15 11:00 AM',
      icon: Award,
      color: 'yellow',
      details: {
        badge: 'Life Saver',
        points: 500
      }
    },
    {
      id: 3,
      type: 'appointment',
      title: 'Appointment Scheduled',
      description: 'Booked appointment at Rwanda Military Hospital',
      timestamp: '2025-09-10 02:15 PM',
      icon: Calendar,
      color: 'blue',
      details: {
        hospital: 'Rwanda Military Hospital',
        date: '2025-11-05',
        time: '02:00 PM'
      }
    },
    {
      id: 4,
      type: 'health',
      title: 'Health Record Updated',
      description: 'Pre-donation screening completed successfully',
      timestamp: '2025-09-15 09:45 AM',
      icon: FileText,
      color: 'green',
      details: {
        bloodPressure: '120/80',
        heartRate: 72,
        temperature: 36.6
      }
    },
    {
      id: 5,
      type: 'notification',
      title: 'Urgent Blood Request',
      description: 'O+ blood needed at Kigali Central Hospital',
      timestamp: '2025-09-08 08:20 AM',
      icon: Bell,
      color: 'orange',
      details: {
        hospital: 'Kigali Central Hospital',
        bloodType: 'O+',
        urgency: 'High'
      }
    },
    {
      id: 6,
      type: 'donation',
      title: 'Blood Donation Completed',
      description: 'Successfully donated 450ml of O+ blood at Kigali Central Hospital',
      timestamp: '2025-06-20 11:15 AM',
      icon: Droplet,
      color: 'red',
      details: {
        hospital: 'Kigali Central Hospital',
        bloodType: 'O+',
        units: 1,
        hemoglobin: 14.8
      }
    },
    {
      id: 7,
      type: 'achievement',
      title: 'Level Up!',
      description: 'Reached Gold Donor level',
      timestamp: '2025-06-20 11:30 AM',
      icon: TrendingUp,
      color: 'purple',
      details: {
        level: 'Gold Donor',
        points: 1000
      }
    },
    {
      id: 8,
      type: 'appointment',
      title: 'Appointment Completed',
      description: 'Attended scheduled appointment at King Faisal Hospital',
      timestamp: '2025-06-20 10:00 AM',
      icon: CheckCircle,
      color: 'green',
      details: {
        hospital: 'King Faisal Hospital',
        status: 'Completed'
      }
    },
    {
      id: 9,
      type: 'profile',
      title: 'Profile Updated',
      description: 'Updated contact information and health records',
      timestamp: '2025-06-15 03:30 PM',
      icon: User,
      color: 'gray',
      details: {
        fields: ['Email', 'Phone', 'Weight']
      }
    },
    {
      id: 10,
      type: 'donation',
      title: 'Blood Donation Completed',
      description: 'Successfully donated 450ml of O+ blood at University Teaching Hospital',
      timestamp: '2025-03-10 09:45 AM',
      icon: Droplet,
      color: 'red',
      details: {
        hospital: 'University Teaching Hospital',
        bloodType: 'O+',
        units: 1,
        hemoglobin: 14.2
      }
    }
  ];

  // Activity stats
  const activityStats = {
    totalActivities: activities.length,
    donations: activities.filter(a => a.type === 'donation').length,
    achievements: activities.filter(a => a.type === 'achievement').length,
    appointments: activities.filter(a => a.type === 'appointment').length
  };

  const activityTypes = [
    { id: 'all', name: 'All Activities', icon: Activity },
    { id: 'donation', name: 'Donations', icon: Droplet },
    { id: 'appointment', name: 'Appointments', icon: Calendar },
    { id: 'achievement', name: 'Achievements', icon: Award },
    { id: 'health', name: 'Health Records', icon: FileText },
    { id: 'notification', name: 'Notifications', icon: Bell }
  ];

  const filteredActivities = activities.filter(activity => {
    if (filterType !== 'all' && activity.type !== filterType) return false;
    if (searchTerm && !activity.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !activity.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Pagination
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, searchTerm, dateRange, activities.length]);

  // Close modal when pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDetails(false);
        setSelectedActivity(null);
      }
    };

    if (showDetails) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showDetails]);

  const getColorClasses = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-600',
      blue: 'bg-blue-100 text-blue-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600',
      gray: 'bg-gray-100 text-gray-600'
    };
    return colors[color] || 'bg-gray-100 text-gray-600';
  };

  const getTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600 mt-1">Track all your donation activities and milestones</p>
        </div>
        <button className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition shadow-lg">
          <Download className="w-5 h-5" />
          <span>Export Log</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Activities</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{activityStats.totalActivities}</p>
            </div>
            <Activity className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Donations</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{activityStats.donations}</p>
            </div>
            <Droplet className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Achievements</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{activityStats.achievements}</p>
            </div>
            <Award className="w-12 h-12 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Appointments</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{activityStats.appointments}</p>
            </div>
            <Calendar className="w-12 h-12 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters removed as requested */}

      {/* Activity Type Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
                  filterType === type.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{type.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Activity</h2>
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">When</th>
                    <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getColorClasses(activity.color)}`}>
                            <Icon className="w-4 h-4" />
                            <span className="capitalize">{activity.type}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{activity.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xl">
                          <p className="line-clamp-2">{activity.description}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div>{getTimeAgo(activity.timestamp)}</div>
                          <div className="text-xs text-gray-400">{activity.timestamp}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          <button
                            onClick={() => { setSelectedActivity(activity); setShowDetails(true); }}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-xs font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-2 mt-4">
              <div className="text-sm text-gray-600">
                Showing {filteredActivities.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, filteredActivities.length)} of {filteredActivities.length}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-lg border text-sm ${currentPage === page ? 'bg-red-600 text-white border-red-600 shadow' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedActivity && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative transform transition-all pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="space-y-4">
              {/* Header */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <span className={`w-12 h-12 rounded-full flex items-center justify-center ${getColorClasses(selectedActivity.color)}`}>
                    {(() => { const Icon = selectedActivity.icon; return <Icon className="w-6 h-6" />; })()}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedActivity.title}</h3>
                    <p className="text-sm text-gray-500">{selectedActivity.timestamp}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getColorClasses(selectedActivity.color)}`}>
                    {selectedActivity.type}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="py-2 border-b border-gray-100">
                <p className="text-sm text-gray-700">{selectedActivity.description}</p>
              </div>

              {/* Details */}
              {selectedActivity.details && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Additional Details</h4>
                  {Object.entries(selectedActivity.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600 font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-sm text-gray-900 font-semibold">
                        {Array.isArray(value) ? value.join(', ') : value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Your Journey</h3>
            <p className="text-purple-100 mb-4">
              You've been actively saving lives for the past months. Keep up the amazing work!
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-purple-200">This Month</p>
                <p className="text-2xl font-bold">2 Donations</p>
              </div>
              <div>
                <p className="text-sm text-purple-200">Total Impact</p>
                <p className="text-2xl font-bold">36 Lives</p>
              </div>
              <div>
                <p className="text-sm text-purple-200">Streak</p>
                <p className="text-2xl font-bold">6 Months</p>
              </div>
            </div>
          </div>
          <Heart className="hidden md:block w-24 h-24 text-purple-300 opacity-50" />
        </div>
      </div>
    </div>
  );
}

export default DonorActivityLog;
