import React, { useState, useEffect } from 'react';
import { Activity, Filter, Search, Download, Calendar, User, Droplet, Bell, FileText, Settings, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';

function ActivityLog() {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const activities = [
    {
      id: 1,
      type: 'blood_request',
      icon: Bell,
      title: 'New Blood Request Created',
      description: 'Critical request for O+ blood - 3 units needed',
      user: 'Dr. Sarah Johnson',
      timestamp: '2 minutes ago',
      details: 'Patient: John Doe, Emergency Case',
      status: 'critical',
      color: 'red'
    },
    {
      id: 2,
      type: 'inventory',
      icon: Droplet,
      title: 'Blood Inventory Updated',
      description: 'Added 5 units of A+ blood',
      user: 'Lab Technician Mary',
      timestamp: '15 minutes ago',
      details: 'Donor: Jane Smith, Donation ID: DON-1234',
      status: 'success',
      color: 'green'
    },
    {
      id: 3,
      type: 'donor',
      icon: User,
      title: 'New Donor Registered',
      description: 'Michael Brown registered as O- donor',
      user: 'System',
      timestamp: '1 hour ago',
      details: 'Location: Kigali, Gasabo District',
      status: 'info',
      color: 'blue'
    },
    {
      id: 4,
      type: 'request_fulfilled',
      icon: Bell,
      title: 'Blood Request Fulfilled',
      description: 'Request REQ-002 marked as fulfilled',
      user: 'Dr. James Wilson',
      timestamp: '2 hours ago',
      details: 'Blood Type: A+, Units: 2',
      status: 'success',
      color: 'green'
    },
    {
      id: 5,
      type: 'inventory',
      icon: Droplet,
      title: 'Blood Units Used',
      description: 'Used 4 units of B+ blood',
      user: 'Dr. Emily Davis',
      timestamp: '3 hours ago',
      details: 'Surgery Case #5678',
      status: 'warning',
      color: 'orange'
    },
    {
      id: 6,
      type: 'appointment',
      icon: Calendar,
      title: 'Appointment Scheduled',
      description: 'Donation appointment for tomorrow at 10:00 AM',
      user: 'Receptionist Lisa',
      timestamp: '4 hours ago',
      details: 'Donor: Robert Taylor, Blood Type: AB+',
      status: 'info',
      color: 'blue'
    },
    {
      id: 7,
      type: 'report',
      icon: FileText,
      title: 'Monthly Report Generated',
      description: 'September 2025 donation report created',
      user: 'System',
      timestamp: '5 hours ago',
      details: 'Total Donations: 156, Total Units: 428',
      status: 'info',
      color: 'purple'
    },
    {
      id: 8,
      type: 'settings',
      icon: Settings,
      title: 'Settings Updated',
      description: 'Critical blood level threshold changed',
      user: 'Admin User',
      timestamp: '6 hours ago',
      details: 'New threshold: 15 units',
      status: 'info',
      color: 'gray'
    },
    {
      id: 9,
      type: 'blood_request',
      icon: Bell,
      title: 'Blood Request Cancelled',
      description: 'Request REQ-005 cancelled by hospital',
      user: 'Dr. Sarah Johnson',
      timestamp: '8 hours ago',
      details: 'Reason: Patient condition improved',
      status: 'warning',
      color: 'yellow'
    },
    {
      id: 10,
      type: 'donor',
      icon: User,
      title: 'Donor Profile Updated',
      description: 'David Wilson updated contact information',
      user: 'David Wilson',
      timestamp: '10 hours ago',
      details: 'Updated phone and address',
      status: 'info',
      color: 'blue'
    },
    {
      id: 11,
      type: 'inventory',
      icon: Droplet,
      title: 'Low Inventory Alert',
      description: 'AB- blood type below critical level',
      user: 'System',
      timestamp: '12 hours ago',
      details: 'Current level: 6 units, Critical level: 10 units',
      status: 'critical',
      color: 'red'
    },
    {
      id: 12,
      type: 'appointment',
      icon: Calendar,
      title: 'Appointment Completed',
      description: 'Donation appointment completed successfully',
      user: 'Nurse Jennifer',
      timestamp: '1 day ago',
      details: 'Donor: Alice Cooper, Units collected: 1',
      status: 'success',
      color: 'green'
    }
  ];

  const activityTypes = [
    { value: 'all', label: 'All Activities', count: activities.length },
    { value: 'blood_request', label: 'Blood Requests', count: activities.filter(a => a.type === 'blood_request' || a.type === 'request_fulfilled').length },
    { value: 'inventory', label: 'Inventory', count: activities.filter(a => a.type === 'inventory').length },
    { value: 'donor', label: 'Donors', count: activities.filter(a => a.type === 'donor').length },
    { value: 'appointment', label: 'Appointments', count: activities.filter(a => a.type === 'appointment').length }
  ];

  const getIconColor = (color) => {
    const colors = {
      red: 'bg-red-100 text-red-600',
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      orange: 'bg-orange-100 text-orange-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600',
      gray: 'bg-gray-100 text-gray-600'
    };
    return colors[color] || colors.gray;
  };

  const getStatusBadge = (status) => {
    const badges = {
      critical: 'bg-red-100 text-red-700 border-red-200',
      success: 'bg-green-100 text-green-700 border-green-200',
      warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      info: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return badges[status] || badges.info;
  };

  const filteredActivities = activities.filter(activity => {
    if (filterType !== 'all' && !activity.type.includes(filterType)) return false;
    if (searchTerm && !activity.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !activity.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600 mt-1">Track all system activities and changes</p>
        </div>
        <button className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition shadow-lg">
          <Download className="w-5 h-5" />
          <span>Export Log</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-red-600">3</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Users Active</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Type Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilterType(type.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterType === type.value
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label} ({type.count})
            </button>
          ))}
        </div>
      </div>

      {/* Activity Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No activities found matching your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <tr key={activity.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor(activity.color)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">{activity.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{activity.description}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-500">{activity.details}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => {
                            setSelectedActivity(activity);
                            setShowDetails(true);
                          }}
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
        )}

        {/* Pagination Controls */}
        {filteredActivities.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(endIndex, filteredActivities.length)}</span> of{' '}
                <span className="font-semibold">{filteredActivities.length}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="itemsPerPage" className="text-sm text-gray-700">
                  Per page:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded text-sm font-medium transition ${
                        currentPage === page
                          ? 'bg-red-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Popup Card */}
      {showDetails && selectedActivity && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-gray-500/10 backdrop-blur-sm transition-opacity"
          onClick={() => {
            setShowDetails(false);
            setSelectedActivity(null);
          }}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col relative transform transition-all scale-100 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                setShowDetails(false);
                setSelectedActivity(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content - Compact Layout */}
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="border-b border-gray-200 pb-3 pr-8">
                <div className="flex items-start space-x-3 mb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconColor(selectedActivity.color)}`}>
                    {(() => {
                      const Icon = selectedActivity.icon;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedActivity.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(selectedActivity.status)}`}>
                        {selectedActivity.status.toUpperCase()}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                        {selectedActivity.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {selectedActivity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Grid - All info visible without scrolling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Description */}
                <div className="md:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
                    <p className="text-sm text-gray-900">{selectedActivity.description}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadge(selectedActivity.status)}`}>
                    {selectedActivity.status.toUpperCase()}
                  </span>
                </div>

                {/* Time */}
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Time</p>
                  <p className="text-sm font-semibold text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-green-600" />
                    {selectedActivity.timestamp}
                  </p>
                </div>

                {/* User */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">User</p>
                  <p className="text-sm font-semibold text-gray-900 flex items-center">
                    <User className="w-4 h-4 mr-1.5 text-blue-600" />
                    {selectedActivity.user}
                  </p>
                </div>

                {/* Details */}
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Details</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedActivity.details}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityLog;
