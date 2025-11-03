import React, { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, X, Eye, MapPin, Phone, User, Calendar, Droplet, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRequestById } from '../../services/requestService';

function RequestsManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [requestDetails, setRequestDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const requests = [
    {
      id: 'REQ-001',
      patientName: 'John Doe',
      bloodType: 'O+',
      units: 3,
      urgency: 'critical',
      status: 'pending',
      createdAt: '2 hours ago',
      hospital: 'City General Hospital',
      contactPerson: 'Dr. Smith',
      contactPhone: '+250 788 123 456'
    },
    {
      id: 'REQ-002',
      patientName: 'Jane Smith',
      bloodType: 'A+',
      units: 2,
      urgency: 'high',
      status: 'in_progress',
      createdAt: '4 hours ago',
      hospital: 'Central Medical Center',
      contactPerson: 'Dr. Johnson',
      contactPhone: '+250 788 234 567'
    },
    {
      id: 'REQ-003',
      patientName: 'Mike Johnson',
      bloodType: 'B-',
      units: 4,
      urgency: 'medium',
      status: 'fulfilled',
      createdAt: '1 day ago',
      hospital: 'Regional Hospital',
      contactPerson: 'Dr. Williams',
      contactPhone: '+250 788 345 678'
    },
    {
      id: 'REQ-004',
      patientName: 'Sarah Williams',
      bloodType: 'AB+',
      units: 1,
      urgency: 'low',
      status: 'pending',
      createdAt: '3 hours ago',
      hospital: 'Community Health Center',
      contactPerson: 'Dr. Brown',
      contactPhone: '+250 788 456 789'
    },
    {
      id: 'REQ-005',
      patientName: 'David Brown',
      bloodType: 'O-',
      units: 5,
      urgency: 'critical',
      status: 'cancelled',
      createdAt: '2 days ago',
      hospital: 'Emergency Care Unit',
      contactPerson: 'Dr. Davis',
      contactPhone: '+250 788 567 890'
    }
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'fulfilled':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'fulfilled':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const filteredRequests = requests.filter(request => {
    if (activeTab !== 'all' && request.status !== activeTab) return false;
    if (searchTerm && !request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !request.bloodType.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

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

  // Close modal when clicking backdrop or pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedRequestId(null);
        setRequestDetails(null);
      }
    };

    if (selectedRequestId) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedRequestId]);

  // Fetch request details when a request is selected
  useEffect(() => {
    if (selectedRequestId) {
      fetchRequestDetails(selectedRequestId);
    }
  }, [selectedRequestId]);

  const fetchRequestDetails = async (requestId) => {
    try {
      setLoadingDetails(true);
      // Try to fetch from API first
      try {
        const details = await getRequestById(requestId);
        setRequestDetails(details);
      } catch (error) {
        // Fallback to mock data if API fails
        const mockRequest = requests.find(r => r.id === requestId);
        if (mockRequest) {
          // Enhance mock data with additional fields that would come from API
          setRequestDetails({
            ...mockRequest,
            hospital_name: mockRequest.hospital,
            contact_person: mockRequest.contactPerson,
            contact_phone: mockRequest.contactPhone,
            phone_number: mockRequest.contactPhone,
            address: 'Hospital Street, Kigali, Rwanda',
            patient_condition: 'Stable condition',
            additional_notes: 'Patient requires immediate blood transfusion',
            expiry_date: '2024-12-31',
            created_at: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error fetching request details:', error);
      // Use mock data as fallback
      const mockRequest = requests.find(r => r.id === requestId);
      if (mockRequest) {
        setRequestDetails({
          ...mockRequest,
          hospital_name: mockRequest.hospital,
          address: 'Hospital Street, Kigali, Rwanda',
          phone_number: mockRequest.contactPhone,
          patient_condition: 'Stable condition',
          additional_notes: 'Patient requires immediate blood transfusion',
          expiry_date: '2024-12-31',
          created_at: new Date().toISOString()
        });
      }
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewClick = (requestId) => {
    setSelectedRequestId(requestId);
  };

  const handleCloseModal = () => {
    setSelectedRequestId(null);
    setRequestDetails(null);
  };

  const stats = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    fulfilled: requests.filter(r => r.status === 'fulfilled').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blood Requests</h1>
          <p className="text-gray-600 mt-1">Manage and track all blood donation requests</p>
        </div>
        <Link
          to="/hospital/request-blood"
          className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Request</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'All Requests', value: stats.all, key: 'all', color: 'blue' },
          { label: 'Pending', value: stats.pending, key: 'pending', color: 'yellow' },
          { label: 'In Progress', value: stats.in_progress, key: 'in_progress', color: 'blue' },
          { label: 'Fulfilled', value: stats.fulfilled, key: 'fulfilled', color: 'green' },
          { label: 'Cancelled', value: stats.cancelled, key: 'cancelled', color: 'red' }
        ].map((stat) => (
          <button
            key={stat.key}
            onClick={() => handleTabChange(stat.key)}
            className={`p-4 rounded-xl transition ${
              activeTab === stat.key
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-900 hover:shadow-md'
            }`}
          >
            <p className={`text-2xl font-bold ${activeTab === stat.key ? 'text-white' : 'text-gray-900'}`}>
              {stat.value}
            </p>
            <p className={`text-sm mt-1 ${activeTab === stat.key ? 'text-red-100' : 'text-gray-600'}`}>
              {stat.label}
            </p>
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Request ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Blood Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Units
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                        {request.bloodType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {request.units} {request.units === 1 ? 'unit' : 'units'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${getStatusColor(request.status)} w-fit`}>
                        {getStatusIcon(request.status)}
                        <span className="text-xs font-semibold capitalize">{request.status.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => handleViewClick(request.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center space-x-2 shadow-sm hover:shadow-md"
                          title="View full details"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredRequests.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                <span className="font-semibold">{Math.min(endIndex, filteredRequests.length)}</span> of{' '}
                <span className="font-semibold">{filteredRequests.length}</span> results
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

      {/* Request Details Modal */}
      {selectedRequestId && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-gray-500/10 backdrop-blur-sm transition-opacity"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[95vh] overflow-hidden flex flex-col relative transform transition-all scale-100 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1">
              <div className="p-6">
            {loadingDetails ? (
              <div className="flex items-center justify-center py-12">
                <Clock className="w-8 h-8 text-red-600 animate-spin" />
                <span className="ml-2 text-gray-600">Loading details...</span>
              </div>
            ) : requestDetails ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      <Droplet className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Blood Request Details</h3>
                      <p className="text-sm text-gray-500">Request ID: {requestDetails.id}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getUrgencyColor(requestDetails.urgency || requestDetails.urgency_level)}`}>
                      {(requestDetails.urgency || requestDetails.urgency_level || 'normal').toUpperCase()}
                    </span>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${getStatusColor(requestDetails.status)}`}>
                      {getStatusIcon(requestDetails.status)}
                      <span className="text-xs font-semibold capitalize">{requestDetails.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Request Information */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Request Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Patient Name</p>
                        <p className="text-sm font-semibold text-gray-900">{requestDetails.patientName || requestDetails.patient_name || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Droplet className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Blood Type</p>
                        <p className="text-sm font-semibold text-red-600">{requestDetails.bloodType || requestDetails.blood_type || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Droplet className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Units Needed</p>
                        <p className="text-sm font-semibold text-gray-900">{requestDetails.units || requestDetails.units_needed || 'N/A'} {requestDetails.units === 1 ? 'unit' : 'units'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Requested Time</p>
                        <p className="text-sm font-semibold text-gray-900">{requestDetails.createdAt || requestDetails.created_at || 'N/A'}</p>
                      </div>
                    </div>

                    {requestDetails.expiry_date && (
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Expiry Date</p>
                          <p className="text-sm font-semibold text-gray-900">{new Date(requestDetails.expiry_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}

                    {requestDetails.patient_condition && (
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Patient Condition</p>
                          <p className="text-sm font-semibold text-gray-900">{requestDetails.patient_condition}</p>
                        </div>
                      </div>
                    )}

                    {requestDetails.additional_notes && (
                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Additional Notes</p>
                          <p className="text-sm text-gray-900">{requestDetails.additional_notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hospital Information */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-red-600" />
                    <span>Hospital Information</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Building2 className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Hospital Name</p>
                        <p className="text-sm font-semibold text-gray-900">{requestDetails.hospital || requestDetails.hospital_name || 'N/A'}</p>
                      </div>
                    </div>

                    {requestDetails.address && (
                      <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Address</p>
                          <p className="text-sm font-semibold text-gray-900">{requestDetails.address}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <User className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Contact Person</p>
                        <p className="text-sm font-semibold text-gray-900">{requestDetails.contactPerson || requestDetails.contact_person || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">Contact Phone</p>
                        <a 
                          href={`tel:${requestDetails.contactPhone || requestDetails.contact_phone || requestDetails.phone_number || ''}`}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {requestDetails.contactPhone || requestDetails.contact_phone || requestDetails.phone_number || 'N/A'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-gray-200">
                  {requestDetails.status === 'pending' && (
                    <div className="flex space-x-3 mb-3">
                      <button className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center justify-center space-x-2 shadow-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept Request</span>
                      </button>
                      <button className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center justify-center space-x-2 shadow-sm">
                        <XCircle className="w-4 h-4" />
                        <span>Decline Request</span>
                      </button>
                    </div>
                  )}
                  {requestDetails.status === 'in_progress' && (
                    <div className="flex space-x-3 mb-3">
                      <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center space-x-2 shadow-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark as Fulfilled</span>
                      </button>
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <a 
                      href={`tel:${requestDetails.contactPhone || requestDetails.contact_phone || requestDetails.phone_number || ''}`}
                      className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm flex items-center justify-center space-x-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Contact Hospital</span>
                    </a>
                    <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm">
                      Edit Request
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Failed to load request details</p>
              </div>
            )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RequestsManagement;
