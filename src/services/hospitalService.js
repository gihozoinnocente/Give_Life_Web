import api from '../config/api';

const hospitalService = {
  // Get all hospitals
  getAllHospitals: async () => {
    try {
      const response = await api.get('/hospitals');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search hospitals
  searchHospitals: async (searchTerm) => {
    try {
      const params = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const response = await api.get(`/hospitals/search${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get hospital by ID
  getHospitalById: async (hospitalId) => {
    try {
      const response = await api.get(`/hospitals/${hospitalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/hospital/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get blood inventory
  getBloodInventory: async () => {
    try {
      const response = await api.get('/hospital/inventory');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update blood inventory
  updateBloodInventory: async (bloodType, units, action) => {
    try {
      const response = await api.post('/hospital/inventory/update', {
        bloodType,
        units,
        action // 'add' or 'use'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all blood requests
  getBloodRequests: async (status = 'all') => {
    try {
      const params = status !== 'all' ? `?status=${status}` : '';
      const response = await api.get(`/hospital/requests${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create blood request
  createBloodRequest: async (requestData) => {
    try {
      const response = await api.post('/hospital/requests', requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update request status
  updateRequestStatus: async (requestId, status) => {
    try {
      const response = await api.patch(`/hospital/requests/${requestId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get analytics data
  getAnalytics: async (period = 'month') => {
    try {
      const response = await api.get(`/hospital/analytics?period=${period}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get appointments
  getAppointments: async (date) => {
    try {
      const params = date ? `?date=${date}` : '';
      const response = await api.get(`/hospital/appointments${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Schedule appointment
  scheduleAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/hospital/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default hospitalService;
