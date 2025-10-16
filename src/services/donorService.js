import api from '../config/api';

const donorService = {
  // Get all donors
  getAllDonors: async () => {
    try {
      const response = await api.get('/donors');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search donors with filters
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
  },

  // Get donor by ID
  getDonorById: async (donorId) => {
    try {
      const response = await api.get(`/donors/${donorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default donorService;
