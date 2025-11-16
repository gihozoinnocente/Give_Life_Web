import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Bell, AlertCircle, CheckCircle, X, Clock, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import notificationService from '../services/notificationService';
import * as requestService from '../services/requestService';

function HospitalBloodRequest() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState(null);
  const [requests, setRequests] = useState([]);
  
  const [formData, setFormData] = useState({
    bloodType: '',
    urgency: 'normal',
    unitsNeeded: '',
    patientCondition: '',
    contactPerson: '',
    contactPhone: '',
    additionalNotes: '',
    expiryDate: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'critical', label: 'Critical (Immediate)', color: 'red' },
    { value: 'urgent', label: 'Urgent (Within 24hrs)', color: 'orange' },
    { value: 'normal', label: 'Normal (Within 48hrs)', color: 'blue' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Only send form data - hospitalId, hospitalName, and location will be fetched from backend
      const requestData = {
        bloodType: formData.bloodType,
        unitsNeeded: parseInt(formData.unitsNeeded),
        urgency: formData.urgency,
        patientCondition: formData.patientCondition,
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        additionalNotes: formData.additionalNotes,
        expiryDate: formData.expiryDate
      };

      // Call API to create blood request and send notifications
      await notificationService.sendBloodRequest(requestData);
      
      setShowSuccess(true);
      
      // Redirect to dashboard after 2 seconds to see the updated stats
      setTimeout(() => {
        navigate('/hospital/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create blood request');
      console.error('Error creating blood request:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all requests created by this hospital
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoadingRequests(true);
        const hospitalId = user?.id;
        if (!hospitalId) return;
        const data = await requestService.getHospitalRequests(hospitalId);
        // Normalize shape for rendering
        const normalized = data.map((r) => ({
          id: r.id,
          bloodType: r.blood_type,
          units: r.units_needed,
          urgency: (r.urgency || 'normal').toLowerCase(),
          status: r.status,
          requestedAt: new Date(r.created_at),
          patientName: r.patient_condition || 'Patient',
        }));
        setRequests(normalized);
        setRequestsError(null);
      } catch (err) {
        console.error('Failed to fetch hospital requests:', err);
        setRequestsError('Failed to load your requests');
      } finally {
        setLoadingRequests(false);
      }
    };
    if (user?.id) {
      fetchRequests();
    }
  }, [user?.id, showSuccess]);

  if (!user || user.role !== 'hospital') {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
              <p className="text-gray-600 mb-4">
                Your blood request has been sent to all registered donors. They will receive a notification immediately.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Bell className="w-4 h-4" />
                <span>Notification sent to all users</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-pink-700 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-8 h-8 text-white" />
            <h1 className="text-4xl font-bold text-white">Request Blood</h1>
          </div>
          <p className="text-red-100">
            Post a blood request to notify all registered donors in your area
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Hospital Info */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Hospital Information</h3>
            <p className="text-sm text-blue-700 mb-4">
              Your hospital details will be automatically included in the blood request
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Hospital Name:</span>
                <p className="font-medium text-gray-900">
                  {user.hospitalName || 'Not available'}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Location:</span>
                <p className="font-medium text-gray-900">
                  {user.address || 'Not available'}
                </p>
              </div>
            </div>
            {(!user.hospitalName || !user.address) && (
              <p className="text-xs text-amber-600 mt-3">
                ⚠️ Please complete your hospital profile to ensure accurate information in blood requests
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blood Type and Units */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Blood Type Required <span className="text-red-600">*</span>
                </label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Blood Type</option>
                  {bloodTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Units Needed <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="unitsNeeded"
                  value={formData.unitsNeeded}
                  onChange={handleChange}
                  placeholder="e.g., 2"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Urgency Level <span className="text-red-600">*</span>
              </label>
              <div className="grid md:grid-cols-3 gap-4">
                {urgencyLevels.map(level => (
                  <label
                    key={level.value}
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                      formData.urgency === level.value
                        ? `border-${level.color}-500 bg-${level.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={level.value}
                      checked={formData.urgency === level.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className={`w-5 h-5 text-${level.color}-600`} />
                        <span className="font-medium text-gray-900">{level.label}</span>
                      </div>
                    </div>
                    {formData.urgency === level.value && (
                      <CheckCircle className={`w-5 h-5 text-${level.color}-600`} />
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Patient Condition */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Patient Condition <span className="text-red-600">*</span>
              </label>
              <textarea
                name="patientCondition"
                value={formData.patientCondition}
                onChange={handleChange}
                placeholder="Brief description of patient's condition..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Contact Person <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Name of contact person"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Contact Phone <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+250 788 123 456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Request Valid Until <span className="text-red-600">*</span>
              </label>
              <input
                type="datetime-local"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                placeholder="Any additional information for donors..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
              <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Notification Alert</p>
                <p>Once you submit this request, all registered donors will receive an immediate notification about your blood requirement.</p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800 transition flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <Bell className="w-5 h-5" />
                <span>{isLoading ? 'Sending...' : 'Send Request & Notify Donors'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* All Requests for this Hospital */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Your Blood Requests</h3>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Refresh
            </button>
          </div>

          {loadingRequests ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Loading your requests...</p>
            </div>
          ) : requestsError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium mb-1">Error</p>
                <p>{requestsError}</p>
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No blood requests have been created yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-700 font-bold text-lg">{request.bloodType}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-semibold text-gray-900">{request.patientName}</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${request.urgency === 'critical' ? 'bg-red-600 text-white' : request.urgency === 'urgent' ? 'bg-orange-500 text-white' : request.urgency === 'normal' ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'}`}>
                          {request.urgency.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {request.units} {request.units === 1 ? 'unit' : 'units'} • {request.requestedAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {request.status === 'fulfilled' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : request.status === 'cancelled' ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'fulfilled' ? 'bg-green-100 text-green-800' : request.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HospitalBloodRequest;
