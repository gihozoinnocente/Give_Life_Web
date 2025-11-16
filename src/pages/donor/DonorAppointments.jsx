import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, MapPin, Phone, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight, Hospital, User, Loader2 } from 'lucide-react';
import { useToast } from '../../components/ToastProvider.jsx';
import * as appointmentService from '../../services/appointmentService';

function DonorAppointments() {
  const toast = useToast();
  // Get current user from localStorage (set by auth system)
  const getUserId = () => {
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
  
  const currentUserId = getUserId();
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [donationType, setDonationType] = useState('regular');
  const [notes, setNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // API data states
  const [appointments, setAppointments] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch hospitals on component mount
  useEffect(() => {
    fetchHospitals();
    fetchDonorAppointments();
  }, []);

  // Fetch appointments when filter changes
  useEffect(() => {
    fetchDonorAppointments();
  }, [filterStatus]);

  // Check available slots when hospital or date changes
  useEffect(() => {
    if (selectedHospital && selectedDate) {
      checkAvailableSlots();
    }
  }, [selectedHospital, selectedDate]);

  // Reset pagination when filters or data change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, appointments.length]);

  const fetchHospitals = async () => {
    try {
      const data = await appointmentService.getAllHospitals();
      setHospitals(data);
    } catch (err) {
      console.error('Failed to fetch hospitals:', err);
      const message = 'Failed to load hospitals. Please refresh the page.';
      setError(message);
      toast.error(message);
    }
  };

  const fetchDonorAppointments = async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getDonorAppointments(
        currentUserId,
        filterStatus
      );
      setAppointments(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      const message = 'Failed to load appointments. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailableSlots = async () => {
    try {
      setLoadingSlots(true);
      const data = await appointmentService.getAvailableSlots(
        selectedHospital,
        selectedDate
      );
      setAvailableSlots(data.availableSlots);
      setBookedSlots(data.bookedSlots);
    } catch (err) {
      console.error('Failed to check availability:', err);
      setAvailableSlots([]);
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus === 'all') return true;
    return apt.status === filterStatus;
  });

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + pageSize);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    if (!selectedHospital || !selectedDate || !selectedTime) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    try {
      setLoading(true);
      
      const appointmentData = {
        donorId: currentUserId,
        hospitalId: selectedHospital,
        date: selectedDate,
        time: selectedTime,
        type: donationType,
        notes: notes
      };
      
      const result = await appointmentService.bookAppointment(appointmentData);
      
      if (result.success) {
        toast.success('Appointment scheduled successfully.');
        setShowBookingModal(false);
        // Reset form
        setSelectedHospital('');
        setSelectedDate('');
        setSelectedTime('');
        setDonationType('regular');
        setNotes('');
        // Refresh appointments list
        fetchDonorAppointments();
      } else {
        if (result.code === 409) {
          toast.error(`Booking conflict: ${result.error}. Please choose a different time.`);
        } else {
          toast.error(result.error || 'Failed to book appointment.');
        }
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      if (err.message && err.message.includes('fetch')) {
        toast.error('Cannot connect to server. Please check the backend connection.');
      } else {
        toast.error(`Failed to book appointment: ${err.message || 'Please try again.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }
    
    try {
      setLoading(true);
      const result = await appointmentService.cancelAppointment(appointmentId);
      
      if (result.success) {
        toast.success('Appointment cancelled successfully.');
        fetchDonorAppointments();
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      toast.error('Failed to cancel appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'confirmed' || apt.status === 'pending'
  );

  const pastAppointments = appointments.filter(apt => 
    apt.status === 'completed' || apt.status === 'cancelled'
  );

  // Show login message if user is not authenticated
  if (!currentUserId) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view and book appointments.</p>
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
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-0.5 text-sm">Manage your donation appointments</p>
        </div>
        <button 
          onClick={() => setShowBookingModal(true)}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition shadow"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Book Appointment</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{upcomingAppointments.length}</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {appointments.filter(a => a.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {appointments.filter(a => a.status === 'pending').length}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {appointments.filter(a => a.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm px-3 py-2">
        <div className="flex space-x-2 text-sm">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'all'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('confirmed')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'confirmed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filterStatus === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-2 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                        <Hospital className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 line-clamp-1">{appointment.hospital}</div>
                        <div className="text-[11px] text-gray-500 capitalize">{appointment.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-700">
                    {new Date(appointment.date).toLocaleDateString('en-US', {
                      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-700">{appointment.time}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-700 max-w-xs truncate">{appointment.address}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-gray-700">{appointment.phone}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      <span className="capitalize">{appointment.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-right text-sm">
                    {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        disabled={loading}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium disabled:opacity-50 text-xs"
                      >
                        {loading ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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

      {/* Loading State */}
      {loading && filteredAppointments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Loader2 className="w-16 h-16 text-red-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white border-l-4 border-red-400 rounded-xl shadow-sm p-5 flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div>
              <p className="text-gray-900 font-semibold">We couldn't load your appointments.</p>
              <p className="text-gray-600 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button 
            onClick={fetchDonorAppointments}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredAppointments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600 mb-6">Book your first appointment to start saving lives</p>
          <button 
            onClick={() => setShowBookingModal(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Book Appointment
          </button>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <XCircle className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            <form onSubmit={handleBookAppointment} className="p-6 space-y-6">
              {/* Hospital Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Hospital *
                </label>
                <select
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Choose a hospital...</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={hospital.id}>
                      {hospital.name} - {hospital.address}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Time *
                </label>
                {loadingSlots ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-8 h-8 text-red-600 mx-auto animate-spin" />
                    <p className="text-sm text-gray-600 mt-2">Checking availability...</p>
                  </div>
                ) : availableSlots.length === 0 && selectedHospital && selectedDate ? (
                  <div className="text-center py-8 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No available slots for this date</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`px-4 py-3 rounded-lg font-medium transition ${
                          selectedTime === time
                            ? 'bg-red-600 text-white'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
                {!selectedHospital || !selectedDate ? (
                  <p className="text-sm text-gray-500 mt-2">Please select a hospital and date first</p>
                ) : null}
              </div>

              {/* Donation Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Donation Type
                </label>
                <select 
                  value={donationType}
                  onChange={(e) => setDonationType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="regular">Regular Donation</option>
                  <option value="platelet">Platelet Donation</option>
                  <option value="plasma">Plasma Donation</option>
                  <option value="urgent">Urgent Donation</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Any special requirements or notes..."
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 flex items-center justify-center space-x-2"
                  disabled={!selectedHospital || !selectedDate || !selectedTime || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Booking...</span>
                    </>
                  ) : (
                    <span>Confirm Booking</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonorAppointments;
