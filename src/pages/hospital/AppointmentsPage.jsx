import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Search, Filter, User, Phone, MapPin, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Loader2, X, Eye } from 'lucide-react';
import { useToast } from '../../components/ToastProvider.jsx';
import * as appointmentService from '../../services/appointmentService';

function AppointmentsPage() {
  const toast = useToast();
  // Get current hospital user from localStorage
  const getHospitalId = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id;
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    return null;
  };
  
  const hospitalId = getHospitalId();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('all'); 
  const [filterStatus, setFilterStatus] = useState('all');
  
  // API data states
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [confirmingConfirm, setConfirmingConfirm] = useState(false);
  const [confirmingComplete, setConfirmingComplete] = useState(false);
  const [completionUnits, setCompletionUnits] = useState('1');

  // Fetch appointments on component mount and when filters change
  useEffect(() => {
    if (hospitalId) {
      fetchHospitalAppointments();
      fetchAvailableSlots();
    }
  }, [hospitalId, selectedDate, filterStatus, viewMode]);

  // Reset pagination when filters/date/view change or data length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, selectedDate, viewMode, appointments.length]);

  const fetchHospitalAppointments = async () => {
    try {
      setLoading(true);
      // Only pass date if viewMode is 'day'
      const dateStr = viewMode === 'day' ? selectedDate.toISOString().split('T')[0] : null;
      const data = await appointmentService.getHospitalAppointments(
        hospitalId,
        dateStr,
        filterStatus
      );
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const data = await appointmentService.getAvailableSlots(hospitalId, dateStr);
      setAvailableSlots(data.availableSlots);
      setBookedSlots(data.bookedSlots);
    } catch (err) {
      console.error('Failed to fetch slots:', err);
    }
  };

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const result = await appointmentService.updateAppointment(appointmentId, {
        status: 'confirmed'
      });
      
      if (result.success) {
        // If currently filtering by 'pending', switch to 'all' to show confirmed appointment
        if (filterStatus === 'pending') {
          setFilterStatus('all');
        }
        toast.success('Appointment confirmed successfully.');
        await fetchHospitalAppointments();
      }
    } catch (err) {
      console.error('Error confirming appointment:', err);
      toast.error('Failed to confirm appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteAppointment = async (appointmentId, units) => {
    const donationUnits = units ? Number(units) || 1 : 1;

    try {
      setLoading(true);
      const result = await appointmentService.updateAppointment(appointmentId, {
        status: 'completed',
        donationUnits
      });
      
      if (result.success) {
        // If currently filtering by 'confirmed', switch to 'all' to show completed appointment
        if (filterStatus === 'confirmed') {
          setFilterStatus('all');
          toast.success('Appointment marked as completed.');
        } else {
          toast.success('Appointment marked as completed.');
        }
        // Refresh the appointments list
        await fetchHospitalAppointments();
      }
    } catch (err) {
      console.error('Error completing appointment:', err);
      toast.error('Failed to complete appointment.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const result = await appointmentService.updateAppointment(appointmentId, {
        status: 'cancelled'
      });
      
      if (result.success) {
        toast.success('Appointment cancelled successfully.');
        await fetchHospitalAppointments();
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      toast.error('Failed to cancel appointment.');
    } finally {
      setLoading(false);
    }
  };

  // Close modal when pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDetails(false);
        setSelectedAppointment(null);
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

  const handleViewDetails = async (appointment) => {
    try {
      setLoading(true);
      // Fetch fresh details to ensure donationUnits is present after completion
      const fresh = await appointmentService.getAppointmentById(appointment.id);
      const detailed = fresh || appointment;
      setSelectedAppointment({
        ...appointment,
        ...detailed,
        donationUnits: detailed.donationUnits ?? appointment.donationUnits,
      });
      setConfirmingConfirm(false);
      setConfirmingComplete(false);
      setCompletionUnits(detailed.donationUnits ? String(detailed.donationUnits) : '1');
      setShowDetails(true);
    } catch (e) {
      // Fallback to given appointment if detail fetch fails
      setSelectedAppointment(appointment);
      setConfirmingConfirm(false);
      setConfirmingComplete(false);
      setCompletionUnits(appointment.donationUnits ? String(appointment.donationUnits) : '1');
      setShowDetails(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowDetails(false);
    setSelectedAppointment(null);
    setConfirmingConfirm(false);
    setConfirmingComplete(false);
    setCompletionUnits('1');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false;
    return true;
  });

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + pageSize);

  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  };

  // Time slots for scheduling
  const timeSlots = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM'
  ];

  // Show login message if hospital is not authenticated
  if (!hospitalId) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in as a hospital to view appointments.</p>
          <a href="/login" className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-0.5 text-sm">Manage donation appointments and schedules</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-bold text-gray-900 mt-0.5">{stats.total}</p>
            </div>
            <Calendar className="w-7 h-7 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-xl font-bold text-green-600 mt-0.5">{stats.confirmed}</p>
            </div>
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600 mt-0.5">{stats.pending}</p>
            </div>
            <AlertCircle className="w-7 h-7 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-xl font-bold text-blue-600 mt-0.5">{stats.completed}</p>
            </div>
            <CheckCircle className="w-7 h-7 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cancelled</p>
              <p className="text-xl font-bold text-red-600 mt-0.5">{stats.cancelled}</p>
            </div>
            <XCircle className="w-7 h-7 text-red-600" />
          </div>
        </div>
      </div>

      {/* Calendar & Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
          {/* Date Navigation */}
          <div className="flex items-center space-x-3">
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="text-center">
              <p className="text-base font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                viewMode === 'all' ? 'bg-white text-red-600 shadow' : 'text-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                viewMode === 'day' ? 'bg-white text-red-600 shadow' : 'text-gray-600'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                viewMode === 'week' ? 'bg-white text-red-600 shadow' : 'text-gray-600'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                viewMode === 'month' ? 'bg-white text-red-600 shadow' : 'text-gray-600'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            { value: 'all', label: 'All', count: stats.total },
            { value: 'confirmed', label: 'Confirmed', count: stats.confirmed },
            { value: 'pending', label: 'Pending', count: stats.pending },
            { value: 'completed', label: 'Completed', count: stats.completed },
            { value: 'cancelled', label: 'Cancelled', count: stats.cancelled }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                filterStatus === filter.value
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Appointments Timeline */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {viewMode === 'all' ? 'All Appointments' : "Today's Schedule"}
            </h2>
            
            {loading && filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-red-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Loading appointments...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={fetchHospitalAppointments}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No appointments found for this date</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                        <th className="px-3 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-3 py-2 text-center text-[11px] font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {appointment.donorName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900 line-clamp-1">{appointment.donorName}</div>
                              {/* <div className="text-xs text-gray-500">ID: {appointment.donorId}</div> */}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusColor(appointment.status)}`}>
                              {getStatusIcon(appointment.status)}
                              <span className="capitalize">{appointment.status}</span>
                            </span>
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-center text-sm">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handleViewDetails(appointment)}
                                className="px-2.5 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-[11px] font-medium flex items-center space-x-1"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm">
                  <div className="text-sm text-gray-600">
                    Showing {filteredAppointments.length === 0 ? 0 : startIndex + 1}-{Math.min(startIndex + pageSize, filteredAppointments.length)} of {filteredAppointments.length}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 rounded-lg border text-sm ${currentPage === page ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booked Time Slots Only */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Booked Time Slots</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {bookedSlots.length === 0 ? (
                <div className="px-4 py-8 bg-gray-50 text-gray-500 rounded-lg text-center">
                  No booked slots for the selected date
                </div>
              ) : (
                bookedSlots.map((slot, index) => (
                  <div
                    key={index}
                    className="w-full px-4 py-3 rounded-lg text-left font-medium bg-gray-100 text-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <span>{slot}</span>
                      <span className="text-xs">Booked</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl shadow-lg p-6 text-white">
            <h3 className="font-bold mb-4">Today's Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-purple-100">Total Slots</span>
                <span className="font-bold">{timeSlots.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Booked</span>
                <span className="font-bold">{appointments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-100">Available</span>
                <span className="font-bold">{timeSlots.length - appointments.length}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-purple-400">
                <span className="text-purple-100">Occupancy</span>
                <span className="font-bold">{Math.round((appointments.length / timeSlots.length) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {showDetails && selectedAppointment && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-gray-500/10 backdrop-blur-sm transition-opacity"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden flex flex-col relative transform transition-all scale-100 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="border-b border-gray-200 pb-3 pr-8">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {selectedAppointment.donorName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedAppointment.donorName}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedAppointment.status)}`}>
                        {getStatusIcon(selectedAppointment.status)}
                        <span className="capitalize">{selectedAppointment.status}</span>
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                        {selectedAppointment.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information Grid - All info visible without scrolling */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Time */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Time</p>
                  <p className="text-sm font-semibold text-gray-900 flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-blue-600" />
                    {selectedAppointment.time}
                  </p>
                </div>

                {/* Date */}
                {selectedAppointment.date && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">Date</p>
                    <p className="text-sm font-semibold text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5 text-green-600" />
                      {new Date(selectedAppointment.date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Phone */}
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                  <p className="text-sm font-semibold text-gray-900 flex items-center">
                    <Phone className="w-4 h-4 mr-1.5 text-purple-600" />
                    {selectedAppointment.phone || 'N/A'}
                  </p>
                </div>

                {/* Location */}
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 font-medium mb-1">Location</p>
                  <p className="text-sm font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5 text-orange-600" />
                    {selectedAppointment.location || 'Main Donation Center'}
                  </p>
                </div>

                {/* Donation Units (visible when completed) */}
                {selectedAppointment.status === 'completed' && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">Donation Units</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedAppointment.donationUnits ? `${selectedAppointment.donationUnits} unit${selectedAppointment.donationUnits > 1 ? 's' : ''}` : '—'}
                    </p>
                  </div>
                )}

                {/* Donor ID */}
                <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
                  <p className="text-xs text-gray-500 font-medium mb-1">Donor ID</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedAppointment.donorId}</p>
                </div>

                {/* Notes */}
                {selectedAppointment.notes && (
                  <div className="bg-yellow-50 rounded-lg p-3 md:col-span-2">
                    <p className="text-xs text-gray-500 font-medium mb-1">Notes</p>
                    <p className="text-sm text-gray-900">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <p className="text-xs text-gray-500">
                  {selectedAppointment.status === 'pending'
                    ? 'You can confirm or cancel this appointment. Confirm will ask you to verify first.'
                    : selectedAppointment.status === 'confirmed'
                    ? 'You can mark this appointment as completed. We will ask you to confirm and enter blood units.'
                    : 'Are you sure you want to update this appointment?'}
                </p>
                <div className="flex flex-col space-y-2">
                  {selectedAppointment.status === 'pending' && (
                    <>
                      {!confirmingConfirm ? (
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => {
                              setConfirmingConfirm(true);
                            }}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Confirm</span>
                          </button>
                          <button 
                            onClick={() => {
                              handleCloseModal();
                              handleCancelAppointment(selectedAppointment.id);
                            }}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      ) : (
                        <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-3">
                          <p className="text-xs text-yellow-800 font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1.5" />
                            Are you sure you want to mark this appointment as confirmed?
                          </p>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => {
                                handleCloseModal();
                                handleConfirmAppointment(selectedAppointment.id);
                                setConfirmingConfirm(false);
                              }}
                              disabled={loading}
                              className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Yes, confirm</span>
                            </button>
                            <button
                              onClick={() => setConfirmingConfirm(false)}
                              disabled={loading}
                              className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                              <XCircle className="w-4 h-4" />
                              <span>No, go back</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {selectedAppointment.status === 'confirmed' && (
                    <>
                      {!confirmingComplete ? (
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => {
                              setConfirmingComplete(true);
                            }}
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Mark as Complete</span>
                          </button>
                        </div>
                      ) : (
                        <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-3">
                          <p className="text-xs text-blue-800 font-medium flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1.5" />
                            Are you sure you want to mark this appointment as completed?
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                            <div className="md:col-span-1">
                              <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="completionUnits">
                                Blood units
                              </label>
                              <input
                                id="completionUnits"
                                type="number"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                value={completionUnits}
                                onChange={(e) => setCompletionUnits(e.target.value)}
                              />
                            </div>
                            <div className="md:col-span-2 flex space-x-3">
                              <button
                                onClick={() => {
                                  handleCloseModal();
                                  handleCompleteAppointment(selectedAppointment.id, completionUnits);
                                  setConfirmingComplete(false);
                                }}
                                disabled={loading || !completionUnits}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Yes, complete</span>
                              </button>
                              <button
                                onClick={() => setConfirmingComplete(false)}
                                disabled={loading}
                                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>No, go back</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;
