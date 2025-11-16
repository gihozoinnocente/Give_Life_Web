import api from '../config/api';

const donorService = {
  // ==================== DONOR PROFILE ====================
  
  // Get donor profile
  getDonorProfile: async () => {
    try {
      const response = await api.get('/donors/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get hospital health records for the logged-in donor
  getHospitalHealthRecords: async () => {
    try {
      const response = await api.get('/donors/me/hospital-health-records');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Export hospital health records for the logged-in donor
  exportHospitalHealthRecords: async (format = 'pdf') => {
    try {
      const response = await api.get(`/donors/me/hospital-health-records/export?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update donor profile
  updateDonorProfile: async (profileData) => {
    try {
      const response = await api.put('/donors/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get donor dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/donors/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== DONATIONS ====================
  
  // Get donor's donation history
  getDonationHistory: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await api.get(`/donors/donations?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get donation by ID
  getDonationById: async (donationId) => {
    try {
      const response = await api.get(`/donors/donations/${donationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Download donation certificate
  downloadCertificate: async (donationId) => {
    try {
      const response = await api.get(`/donors/donations/${donationId}/certificate`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== APPOINTMENTS ====================
  
  // Get all appointments
  getAppointments: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.upcoming) queryParams.append('upcoming', params.upcoming);
      
      const response = await api.get(`/donors/appointments?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Book new appointment
  bookAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/donors/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update appointment
  updateAppointment: async (appointmentId, updateData) => {
    try {
      const response = await api.put(`/donors/appointments/${appointmentId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId, reason) => {
    try {
      const response = await api.delete(`/donors/appointments/${appointmentId}`, {
        data: { reason }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get available time slots
  getAvailableSlots: async (hospitalId, date) => {
    try {
      const response = await api.get(`/donors/appointments/slots`, {
        params: { hospitalId, date }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== HOSPITALS ====================
  
  // Get nearby hospitals
  getNearbyHospitals: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.latitude) queryParams.append('latitude', params.latitude);
      if (params.longitude) queryParams.append('longitude', params.longitude);
      if (params.radius) queryParams.append('radius', params.radius);
      if (params.bloodType) queryParams.append('bloodType', params.bloodType);
      
      const response = await api.get(`/donors/hospitals/nearby?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get hospital details
  getHospitalDetails: async (hospitalId) => {
    try {
      const response = await api.get(`/donors/hospitals/${hospitalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get hospital blood inventory
  getHospitalInventory: async (hospitalId) => {
    try {
      const response = await api.get(`/donors/hospitals/${hospitalId}/inventory`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== ACHIEVEMENTS ====================
  
  // Get all achievements
  getAchievements: async () => {
    try {
      const response = await api.get('/donors/achievements');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get achievement details
  getAchievementById: async (achievementId) => {
    try {
      const response = await api.get(`/donors/achievements/${achievementId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get donor level and points
  getDonorLevel: async () => {
    try {
      const response = await api.get('/donors/level');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get leaderboard
  getLeaderboard: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.period) queryParams.append('period', params.period);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await api.get(`/donors/leaderboard?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== HEALTH RECORDS ====================
  
  // Get health profile
  getHealthProfile: async () => {
    try {
      const response = await api.get('/donors/health/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update health profile
  updateHealthProfile: async (healthData) => {
    try {
      const response = await api.put('/donors/health/profile', healthData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get vital signs history
  getVitalSigns: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      const response = await api.get(`/donors/health/vitals?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add vital signs record
  addVitalSigns: async (vitalData) => {
    try {
      const response = await api.post('/donors/health/vitals', vitalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get medical history
  getMedicalHistory: async () => {
    try {
      const response = await api.get('/donors/health/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add medical record
  addMedicalRecord: async (recordData) => {
    try {
      const response = await api.post('/donors/health/history', recordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check donation eligibility
  checkEligibility: async () => {
    try {
      const response = await api.get('/donors/health/eligibility');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== COMMUNITY ====================
  
  // Get community feed
  getCommunityFeed: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.type) queryParams.append('type', params.type);
      
      const response = await api.get(`/donors/community/feed?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create post
  createPost: async (postData) => {
    try {
      const response = await api.post('/donors/community/posts', postData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Like post
  likePost: async (postId) => {
    try {
      const response = await api.post(`/donors/community/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Comment on post
  commentOnPost: async (postId, comment) => {
    try {
      const response = await api.post(`/donors/community/posts/${postId}/comments`, { comment });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get community events
  getCommunityEvents: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.upcoming) queryParams.append('upcoming', params.upcoming);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await api.get(`/donors/community/events?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Join event
  joinEvent: async (eventId) => {
    try {
      const response = await api.post(`/donors/community/events/${eventId}/join`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get community stats
  getCommunityStats: async () => {
    try {
      const response = await api.get('/donors/community/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== ACTIVITY LOG ====================
  
  // Get activity log
  getActivityLog: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.type) queryParams.append('type', params.type);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await api.get(`/donors/activity?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Export activity log
  exportActivityLog: async (format = 'pdf') => {
    try {
      const response = await api.get(`/donors/activity/export?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== NOTIFICATIONS ====================
  
  // Get notifications
  getNotifications: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.unread) queryParams.append('unread', params.unread);
      if (params.limit) queryParams.append('limit', params.limit);
      
      const response = await api.get(`/donors/notifications?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark notification as read
  markNotificationRead: async (notificationId) => {
    try {
      const response = await api.put(`/donors/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark all notifications as read
  markAllNotificationsRead: async () => {
    try {
      const response = await api.put('/donors/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update notification preferences
  updateNotificationPreferences: async (preferences) => {
    try {
      const response = await api.put('/donors/notifications/preferences', preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ==================== SEARCH & FILTERS ====================
  
  // Search donors
  searchDonors: async (filters) => {
    try {
      const params = new URLSearchParams();
      if (filters.bloodGroup) params.append('bloodGroup', filters.bloodGroup);
      if (filters.district) params.append('district', filters.district);
      if (filters.state) params.append('state', filters.state);
      if (filters.minAge) params.append('minAge', filters.minAge);
      if (filters.maxAge) params.append('maxAge', filters.maxAge);

      const response = await api.get(`/donors/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get donors by blood group
  getDonorsByBloodGroup: async (bloodGroup) => {
    try {
      const response = await api.get(`/donors/blood-group/${bloodGroup}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default donorService;
